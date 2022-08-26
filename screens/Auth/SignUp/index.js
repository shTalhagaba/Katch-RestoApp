import { useMutation } from '@apollo/react-hooks';
import auth from '@react-native-firebase/auth';
import passwordStrength from 'check-password-strength';
import isValidEmail from 'is-valid-email';
import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Email, Lock, Phone, User } from '../../../assets/svg';
import { analyticsOnSignUp } from '../../../components/AppReporting';
import { USER_SIGNUP } from '../../../components/GraphQL';
import { capitalizeFirstLetter, deepClone } from '../../../components/Helpers';
import { Context as GLoadingContext } from '../../../context/gLoading';
import GS, { BoldText, customFont, normalizedFontSize, RText } from '../../../GlobeStyle';
import { Header } from '../../../Navigation/SignUpNav';
import Input from '../input';

const SignUp = (props) => {
  const { routeParams, navigation, route, tabNavigation, setScreen } = props;
  const phoneNum = route.params?.data?.phoneNum || '';

  const INITIAL_STATE = {
    fullName: '',
    email: '',
    phoneNumber: `${phoneNum}`,
    password: '',
    password2: '',
    referralCode: '',
  };

  const [inputValue, setInputValue] = useState(INITIAL_STATE);

  const INITIAL_STATE_ERROR = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    password2: '',
    referralCode: '',
    others: '',
  };

  const [errors, setErrors] = useState(INITIAL_STATE_ERROR);
  const gLoading = useContext(GLoadingContext);

  const [signUp] = useMutation(USER_SIGNUP);

  const _onChange = (name, text) => {
    setInputValue((state) => {
      const formValue = state;
      formValue[name] = text;
      return deepClone(formValue);
    });
  };

  const isFormValidated = async (form) => {
    const { password2 } = form;
    return new Promise((res, rej) => {
      setErrors((state) => {
        const newState = deepClone(state);
        let errorsExist = false;
        for (let key in form) {
          const value = form[key];
          const skipKeys = ['referralCode', 'phoneNumber', 'password2'];
          if (skipKeys.includes(key)) {
            continue;
          }

          if (value === '') {
            if (key === 'fullName') {
              newState[key] = `Full name cannot be empty`;
            } else {
              const eMessage = `${capitalizeFirstLetter(key)} cannot be empty`;
              newState[key] = eMessage;
              if (key === 'password' && password2 === '') {
                newState.password2 = eMessage;
              }
            }
            errorsExist = true;
          }

          if (key === 'password' && value !== '') {
            const passStrength = value && passwordStrength(value).value;
            if (value.length <= 5) {
              newState[key] = `Password must contain up to 6 characters`;
              errorsExist = true;
            } else if (passStrength === 'Weak') {
              newState[key] = 'Your password is too weak.';
              errorsExist = true;
            } else if (value !== password2) {
              newState.password2 =
                "The password and it's confirmation do not match.";
              errorsExist = true;
            }
          }

          if (key === 'email' && value !== '' && !isValidEmail(value)) {
            newState[key] = `Invalid Email Address`;
            errorsExist = true;
          }
        }
        res(errorsExist);
        return newState;
      });
    });
  };

  const submit = async () => {
    try {
      gLoading.actions.toggleGLoading(true, '#ffffff99');
      setErrors(INITIAL_STATE_ERROR);
      const { fullName, email, phoneNumber, password, referralCode } =
        inputValue;
      const fromHasErrors = await isFormValidated(inputValue);
      if (fromHasErrors) {
        gLoading.actions.toggleGLoading(false);
        return;
      }
      const variables = {
        input: {
          displayName: fullName,
          phoneNumber: `+965${phoneNumber}`,
          emailVerified: true,
          referralCode: referralCode,
          password: password,
          email: email,
        },
      };
      const { data } = await signUp({ variables });
      if (data && data.createUser) {
        const res = data.createUser;
        if (!res.success) {
          setErrors((state) => {
            if (Array.isArray(res.fieldErrors) && res.fieldErrors.length > 0) {
              res.fieldErrors.forEach((x) => {
                state[x.field] = x.message;
              });
            }
            if (typeof res.message === 'string' && res.message !== '') {
              state.others = res.message;
            }
            return deepClone(state);
          });
        }
        if (res.success) {
          await auth().signInWithEmailAndPassword(email, password);
          analyticsOnSignUp(auth().currentUser);

          if (routeParams?.cameFrom) {
            routeParams.cameFrom(tabNavigation);
          } else if (routeParams?.accountContent) {
            setScreen('');
          } else {
            tabNavigation.navigate('Home');
          }
        }
      }
      gLoading.actions.toggleGLoading(false);
    } catch (error) {
      setErrors((state) => {
        state.others = 'Oops something when wrong';
        return state;
      });
    }
  };

  const goBack = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header onBack={goBack} />
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.scrollView}>
        <BoldText style={styles.header}>Complete Your Profile</BoldText>
        <RText style={styles.errorText}>{errors.others || ''}</RText>

        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Input
              Svg={User}
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              errorMessage={errors.fullName}
              placeHolder={'Full Name'}
              value={inputValue.fullName}
              onChangeText={(text) => _onChange('fullName', text)}
            />
            <Input
              Svg={Email}
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              errorMessage={errors.email}
              placeHolder={'Email'}
              value={inputValue.email}
              onChangeText={(text) => _onChange('email', text.trim())}
            />

            <Input
              Svg={Lock}
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              errorMessage={errors.password}
              secureTextEntry={true}
              placeHolder="Password"
              value={inputValue.password}
              onChangeText={(text) => _onChange('password', text)}
              maxLength={15}
            />

            <Input
              Svg={Lock}
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              errorMessage={errors.password2}
              secureTextEntry={true}
              placeHolder="Confirm password"
              value={inputValue.password2}
              onChangeText={(text) => _onChange('password2', text)}
              maxLength={15}
            />

            <Input
              textAlign="center"
              borderBottomColor={'silver'}
              errorMessage={errors.referralCode}
              placeHolder={'Referral Code (optional)'}
              value={inputValue.referralCode}
              onChangeText={(text) => _onChange('referralCode', text)}
              maxLength={8}
            />
           
          </View>
          <View />
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
              <TouchableOpacity onPress={submit} style={styles.signUpBtn}>
                <RText
                  fontName={customFont.axiformaMedium}
                  style={styles.signUpBtnText}>
                  Sign up
                </RText>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  loginBtn: {
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00B800',
    marginLeft: 10,
    flex: 1,
  },
  loginBtnText: {
    color: '#00B800',
    fontSize: 17,
  },
  signUpBtn: {
    backgroundColor: '#00B800',
    padding: 10,
    paddingRight: 20,
    borderRadius: 100,
    alignItems: 'center',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpBtnText: {
    color: '#fff',
    fontSize: 17,
  },
  footerContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scrollView: {},
  contentContainerStyle: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 10,
    paddingTop: 25,
    justifyContent: 'flex-start',
  },
  errorText: {
    color: GS.errorRed,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  header: {
    fontSize: normalizedFontSize(13),
    marginTop: 20,
    color: '#000',
    alignSelf: 'center',
  },
});

export default SignUp;
