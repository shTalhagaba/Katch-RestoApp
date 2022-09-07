import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Keyboard,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';

//3rd party
import { useMutation } from '@apollo/client'
import auth from '@react-native-firebase/auth';
import ADIcon from 'react-native-vector-icons/AntDesign';

//others
import { Phone, Lock } from '../../../assets/svg';
import { isFormValidated, formatPhoneNumber } from '../authHelper';
import { GET_USER_EMAIL } from '../../../components/GraphQL/mutations';
import Input from '../input';
import ProgressLoading from '../../../components/Loading/ProgressLoading';
import GS, { RText, customFont, BoldText } from '../../../GlobeStyle';
import { analyticsOnLogin } from '../../../components/AppReporting';
import { verifyEmail } from '../../../components/Alerts';
import VerifyMail from '../../../components/VerifyMail';
import { animateLayout, getGreetings } from '../../../components/Helpers';
import { RAMADAN_BANNER } from '../../../assets/images';
import { connect } from 'react-redux';

const windowHeight = Dimensions.get('window').height;

const Login = ({ navigation, routeParams, setScreen, marketingData }) => {
  const INITIAL_STATE = {
    phoneNumber: '+965 ',
    password: '',
  };

  const [userEmail, setUserEmail] = useState('');

  const [showHeader, setShowHeader] = useState(true);
  const [inputValue, setInputValue] = useState(INITIAL_STATE);

  const [errors, setErrors] = useState({
    phoneNumber: '',
    password: '',
    others: '',
  });

  const [notifyMailSend, setNotifyMailSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [getUserEmail] = useMutation(GET_USER_EMAIL);

  const [keyBoardStatus, isBoardStatus] = useState(false);

  const _onChange = (name, text) => {
    const formValue = { ...inputValue };
    formValue[name] = text;
    setInputValue(formValue);
  };

  const [ramadan, setRamadan] = useState(false);

  useEffect(() => {
    setRamadan(marketingData.ramadan);
  }, [marketingData]);

  const _onSignIn = async () => {
    setIsLoading(true);

    const { phoneNumber, password } = inputValue;

    clearErrors();

    try {
      const formErrors = await isFormValidated(inputValue);
      if (formErrors.hasError) {
        setIsLoading(false);
        setErrors({ ...formErrors });
      } else {
        const { data } = await getUserEmail({
          variables: { phoneNumber: formatPhoneNumber(phoneNumber) },
        });
        const { user } = await auth().signInWithEmailAndPassword(
          data.getUserEmail,
          password,
        );
        if (user.emailVerified) {
          setInputValue(INITIAL_STATE);
          analyticsOnLogin(user);
          if (routeParams?.cameFrom) {
            routeParams.cameFrom(navigation);
          } else if (routeParams?.accountContent) {
            setScreen('');
          } else {
            navigation.navigate('Home');
          }
        } else {
          auth().signOut();
          verifyEmail({
            onConfirm: async () => {
              const { user } = await auth().signInWithEmailAndPassword(
                data.getUserEmail,
                password,
              );
              user.sendEmailVerification();
              setIsLoading(false);
              setUserEmail(auth().currentUser.email);
              setNotifyMailSend(true);
              auth().signOut();
            },
            onReject: () => {
              auth().signOut();
              setIsLoading(false);
            },
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password' });
      } else if (error.message.includes('User not found')) {
        setErrors({
          phoneNumber: 'User not found, check your phone number once again!',
        });
      } else {
        setErrors({ others: 'Oops something went wrong' });
      }
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  useEffect(() => {
    return () => {
      if (auth().currentUser && !auth().currentUser.emailVerified) {
        auth().signOut();
      }
    };
  }, []);

  useEffect(() => {
    const _keyboardDidShow = () => {
      animateLayout();
      isBoardStatus(true);
      setShowHeader(false);
    };

    const _keyboardDidHide = () => {
      animateLayout();
      isBoardStatus(false);
      setShowHeader(true);
    };

    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  });

  const headerHeight = windowHeight / 4 < 200 ? 200 : windowHeight / 4;

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: keyBoardStatus ? GS.primaryColor : ramadan ? '#20963e': GS.secondaryColor,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: ramadan ? '#20963e' : GS.secondaryColor,
            paddingTop: StatusBar.currentHeight,
          }}>
          {ramadan && (
            <Image
              source={RAMADAN_BANNER}
              style={{
                width: '100%',
                position: 'absolute',
                minHeight: 280,
              }}
            />
          )}
          <View
            style={{
              paddingVertical: showHeader ? 20 : 0,
              paddingHorizontal: 20,
              overflow: 'hidden',
              backgroundColor: 'transparent', // GS.secondaryColor,
              height: showHeader ? headerHeight : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <BoldText style={{ color: '#fff', fontSize: 40 }}>
              Good {getGreetings()}
            </BoldText>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: '100%',
                height: '100%',
                borderTopLeftRadius: showHeader ? 20 : 0,
                borderTopRightRadius: showHeader ? 20 : 0,
                marginRight: 'auto',
                marginLeft: 'auto',
                padding: 10,
                paddingTop: 50,
                justifyContent: 'flex-start',
              }}>
              <Input
                Svg={Phone}
                SvgColor={'silver'}
                borderBottomColor={'silver'}
                errorMessage={errors.phoneNumber}
                secureTextEntry={false}
                placeHolder="Phone number"
                keyboardType="number-pad"
                value={inputValue.phoneNumber}
                onChangeText={(text) =>
                  _onChange('phoneNumber', `+965 ${text.substring(5)}`)
                }
                maxLength={13}
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
                maxLength={null}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                }}>
                <TouchableOpacity
                  onPress={_onSignIn}
                  style={{
                    backgroundColor: GS.secondaryColor,
                    padding: 10,
                    paddingHorizontal: 20,
                    borderRadius: 100,
                    alignItems: 'center',
                    flex: 0.4,
                    flexDirection: 'row',
                  }}>
                  <RText
                    style={{
                      color: '#fff',
                      fontFamily: customFont.axiformaMedium,
                      fontSize: 17,
                      marginRight: 10,
                    }}>
                    Log In
                  </RText>
                  <ADIcon name="login" color="#fff" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setScreen('Reset')}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    alignItems: 'flex-end',
                    marginTop: 'auto',
                    justifyContent: 'center',
                    flex: 0.6,
                    flexGrow: 1,
                  }}>
                  <RText
                    style={{
                      color: '#000',
                      fontFamily: customFont.axiformaMedium,
                      fontSize: 17,
                    }}>
                    Forgot password?
                  </RText>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setScreen('SignUp');
                  clearErrors();
                }}
                style={{
                  paddingVertical: 9,
                  borderRadius: 100,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: GS.secondaryColor,
                  marginTop: 55,
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  minWidth: 180,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <RText
                  style={{
                    color: GS.secondaryColor,
                    fontFamily: customFont.axiformaMedium,
                    fontSize: 17,
                    marginRight: 10,
                  }}>
                  Sign up
                </RText>
                <ADIcon name="arrowright" color="#00B800" size={18} />
              </TouchableOpacity>
            </View>
            <View />
          </View>
        </View>
        {isLoading && <ProgressLoading />}
        {notifyMailSend && (
          <VerifyMail
            onPressOutSide={() => setNotifyMailSend(false)}
            email={userEmail}
            onPressOk={() => setNotifyMailSend(false)}
          />
        )}
      </SafeAreaView>

      <SafeAreaView style={{ backgroundColor: GS.primaryColor }} />
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(Login);