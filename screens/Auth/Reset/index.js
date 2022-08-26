import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  BackHandler,
  StatusBar,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {useMutation} from '@apollo/react-hooks';
import {GET_USER_EMAIL} from '../../../components/GraphQL/mutations';
import {formatPhoneNumber} from '../authHelper';
import IOIcon from 'react-native-vector-icons/Ionicons';
import {Phone} from '../../../assets/svg';
import Input from '../input';
import GS, {customFont,TextBasic} from '../../../GlobeStyle';
import ProgressLoading from '../../../components/Loading/ProgressLoading';
import VerifyMail from '../../../components/VerifyMail';

const Reset = ({setScreen}) => {

  const [phoneNumber, setPhoneNumber] = useState('+965 ');
  const [userEmail, setUserEmail] = useState('');

  const INITIAL_STATE_ERROR = {
    phoneNumber: '',
  };

  const [errors, setErrors] = useState(INITIAL_STATE_ERROR);
  const [getUserEmail] = useMutation(GET_USER_EMAIL);
  const [isLoading, setIsLoading] = useState(false);
  const [notifyMailSend, setNotifyMailSend] = useState(false);
  
  const onRequestReset = async () => {
    try{
      setIsLoading(true)
      const {data} = await getUserEmail({variables:{phoneNumber: formatPhoneNumber(phoneNumber)}})
      setUserEmail(data.getUserEmail)
      const res = await auth().sendPasswordResetEmail(data.getUserEmail);
      setIsLoading(false);
      setNotifyMailSend(true);
       
    }catch(error){
      if(error.message.includes('User not found')){
        setErrors({phoneNumber:'User not found, check your phone number once again!'});
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const handleBackButtonClick = () => {
      setScreen('Login');
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: GS.primaryColor}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: StatusBar.currentHeight,
        }}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            style={{
              height: 50,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
            onPress={() => setScreen('Login')}>
            <IOIcon
              name="md-arrow-back"
              size={30}
              color={GS.secondaryColor}
              style={{}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#fff',
            width: '100%',
            flexGrow: 1,
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
            placeHolder={'Phone number'}
            keyboardType="number-pad"
            maxLength={13}
            value={phoneNumber}
            returnKeyType="done"
            onChangeText={(text) =>
              setPhoneNumber(`+965 ${text.substring(5)}`)
            }
          />
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
            }}>
            <TouchableOpacity
              onPress={onRequestReset}
              style={{
                backgroundColor: '#00B800',
                padding: 10,
                marginRight: 'auto',
                marginLeft: 'auto',
                borderRadius: 100,
                alignItems: 'center',
                flexGrow: 1,
                maxWidth: 200,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TextBasic
                style={{
                  color: '#fff',
                  fontFamily: customFont.axiformaMedium,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Send Reset Link
              </TextBasic>
            </TouchableOpacity>
          </View>
        </View>

        <View />
        {isLoading && <ProgressLoading />}
        {notifyMailSend && 
          <VerifyMail
            onPressOutSide={() => setScreen('Login')}
            email={userEmail}
            message="A reset password link has been sent to "
            onPressOk={() => setScreen('Login')}/>
        }
      </View>
    </SafeAreaView>
  );
};

export default Reset;
