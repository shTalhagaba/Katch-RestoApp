import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  SafeAreaView,
} from 'react-native';

//3rd party
import Toast from 'react-native-simple-toast';
import ADIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
//others
import {isFormValidated} from '../../screens/Auth/authHelper';
import Input from '../../screens/Auth/input';
import GS, {RText, BoldText, customFont} from '../../GlobeStyle';
import ProgressLoading from '../../components/Loading/ProgressLoading';

const Reset = ({goBack}) => {
  const INITIAL_STATE = {
    currentPass: '',
    password: '',
    password2: '',
  };

  const [inputValue, setInputValue] = useState(INITIAL_STATE);

  const INITIAL_STATE_ERROR = {
    currentPass: '',
    password: '',
    password2: '',
    others: '',
  };

  const [errors, setErrors] = useState(INITIAL_STATE_ERROR);
  const [isLoading, setIsLoading] = useState(false);

  const _onChange = (name, text) => {
    const formValue = {...inputValue};
    formValue[name] = text;
    setInputValue(formValue);
  };

  useEffect(() => {
    const handleBackButton = () => {
      goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  });

  const changePassword = async () => {
    try {
      setErrors(INITIAL_STATE_ERROR);
      setIsLoading(true);
      const fromErrors = await isFormValidated(inputValue);
      if (fromErrors.hasError) {
        if (fromErrors.hasOwnProperty('password2'))
          fromErrors.password2 = 'Confirm password cannot be empty.';
        if (fromErrors.hasOwnProperty('currentPass'))
          fromErrors.currentPass = 'Current Password cannot be empty.';
        setErrors(fromErrors);
        setIsLoading(false);
      } else {
        if (inputValue.password === inputValue.password2) {
          const credential = await auth.EmailAuthProvider.credential(auth().currentUser.email,inputValue.currentPass);
          const {user} = await auth().currentUser.reauthenticateWithCredential(credential);
          user.updatePassword(inputValue.password);
          Toast.show('Password Updated', Toast.SHORT, ['UIAlertController']);
          setIsLoading(false);
          goBack();
        } else {
          setErrors({
            password2: 'The password and its confirmation do not match.',
          });
          setIsLoading(false);
        }
      }
    } catch (error) {
      if(error.code === 'auth/wrong-password'){
        setErrors({currentPass: 'User current password is incorrect.'});
      }else if(error.code === 'auth/too-many-requests'){
        setErrors({others: 'Too many unsuccessful attempts. Please try again later.'});
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexGrow: 1}}>
        <TouchableOpacity style={{flexGrow: 1}} onPress={goBack} />
      </View>
      <View
        style={{
          backgroundColor: GS.primaryColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        }}>
        {/* head */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderBottomWidth: 0.3,
            borderBottomColor: 'silver',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{marginRight: 10, flex: 1}}>
            <BoldText
              style={{
                fontSize: 20,
                color: GS.textColor,
              }}>
              Change password
            </BoldText>
          </View>

          <TouchableOpacity
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
            onPress={goBack}>
            <ADIcon color="gray" name="close" size={30} />
          </TouchableOpacity>
        </View>

        {/* head */}
      </View>
      <ScrollView
        style={{backgroundColor: GS.primaryColor}}
        contentContainerStyle={{flexGrow: 1, backgroundColor: GS.primaryColor}}>
        {/* body */}
        <View
          style={{
            backgroundColor: '#fff',
            width: '100%',
            flexGrow: 1,
            marginRight: 'auto',
            marginLeft: 'auto',
            padding: 10,
            justifyContent: 'flex-start',
            paddingVertical: 20,
          }}>
          <Input
            errorMessage={errors.currentPass}
            secureTextEntry={true}
            placeHolder="Current Password"
            value={inputValue.currentPass}
            onChangeText={(text) => _onChange('currentPass', text)}
            maxLength={15}
            IconCorrect={() => <ADIcon name="check" color="green" size={15} />}
            IconWrong={() => (
              <ADIcon name="exclamationcircle" color={GS.errorRed} size={15} />
            )}
          />

          <Input
            errorMessage={errors.password}
            secureTextEntry={true}
            placeHolder="Password"
            value={inputValue.password}
            onChangeText={(text) => _onChange('password', text)}
            maxLength={15}
            IconCorrect={() => <ADIcon name="check" color="green" size={15} />}
            IconWrong={() => (
              <ADIcon name="exclamationcircle" color={GS.errorRed} size={15} />
            )}
          />
          <Input
            errorMessage={errors.password2}
            secureTextEntry={true}
            placeHolder="Confirm Password"
            value={inputValue.password2}
            onChangeText={(text) => _onChange('password2', text)}
            maxLength={15}
            IconCorrect={() => <ADIcon name="check" color="green" size={15} />}
            IconWrong={() => (
              <ADIcon name="exclamationcircle" color={GS.errorRed} size={15} />
            )}
          />
          {errors.others !== ''&&
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <RText style={{color:GS.errorRed,fontSize:16,paddingHorizontal: 50, textAlign:'center'}}>{errors.others}</RText>
          </View>
          }
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={changePassword}
              style={{
                backgroundColor: GS.secondaryColor,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                paddingVertical: 10,
                width: '100%',
                marginTop: 20,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <RText
                style={{
                  color: '#fff',
                  fontFamily: customFont.axiformaMedium,
                  fontSize: 17,
                }}>
                Reset password
              </RText>
            </TouchableOpacity>
          </View>
        </View>

        {/* body */}

        {isLoading && <ProgressLoading />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reset;
