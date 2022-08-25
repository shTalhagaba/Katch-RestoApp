import React, {useState, useEffect} from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  SafeAreaView,
} from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import ADIcon from 'react-native-vector-icons/AntDesign';

//others
import Header from '../../components/AccountHeader';
import GS, {RText, BoldText} from '../../GlobeStyle';
import {onLeaveAlert, onReAuth} from '../../components/Alerts';
import ProgressLoading from '../../components/Loading/ProgressLoading';
import Input from '../../screens/Auth/input';
import {ScrollView} from 'react-native-gesture-handler';

const EditAccountInfo = ({navigation, goBack}) => {
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);

  const INITIAL_STATE_ERROR = {
    email: '',
    displayName: '',
  };

  const [errors, setError] = useState(INITIAL_STATE_ERROR);

  const INITIAL_STATE = {
    displayName: user.displayName,
    email: user.email ? user.email : '',
  };

  const [userInfo, setUserInfo] = useState(INITIAL_STATE);

  const onChange = (name, text) => {
    const values = {...userInfo};
    values[name] = text;
    setUserInfo({...values});
  };

  const checkChanges = () => {
    let anyChange;
    for (let key in userInfo) {
      const authInfo = auth().currentUser[key]
        ? auth().currentUser[key].toLowerCase().trim()
        : '';
      const currentUserInfo = userInfo[key]
        ? userInfo[key].toLowerCase().trim()
        : '';
      if (currentUserInfo !== authInfo) {
        anyChange = true;
        return anyChange;
      }
    }
    anyChange = false;
    return anyChange;
  };

  const onUpdate = async () => {
    setIsLoading(true);
    setError(INITIAL_STATE_ERROR);
    if (userInfo.displayName !== '') {
      try {
        await auth().currentUser.updateProfile({
          displayName: userInfo.displayName,
        });

        if (userInfo.email !== '') {
          await auth().currentUser.updateEmail(userInfo.email);
        }

        Toast.show('Updated!', Toast.SHORT, ['UIAlertController']);
        setIsLoading(false);
        goBack();
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          onReAuth({
            onConfirm: async () => {
              await auth().signOut();
              navigation.navigate('Account', {
                screen: 'Login',
              });
            },
            onReject: () => setIsLoading(false),
          });
          return
        }
        
        if (error.code === 'auth/email-already-in-use') {
          setError({
            email: `This email address is already registered with another user`,
          });
        }

        if (error.code === 'auth/invalid-email') {
          setError({email: 'The email address is badly formatted.'});
        }

        setIsLoading(false);
      }
    } else {
      setError({
        displayName: `You're name is the greatest connection to your own identity.`,
      });
      setIsLoading(false);
    }
  };

  const onBack = () => {
    if (checkChanges()) {
      onLeaveAlert({
        onConfirm: () => {
          goBack();
        },
        onReject: () => null,
      });
    } else {
      goBack();
    }
  };

  useEffect(() => {
    const handleBackButton = () => {
      onBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexGrow: 1}}>
        <TouchableOpacity style={{flexGrow: 1}} onPress={onBack} />
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
              Edit Account Details
            </BoldText>
          </View>

          <TouchableOpacity
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
            onPress={onBack}>
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
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <Input
            SvgColor={'silver'}
            borderBottomColor={'silver'}
            placeHolder="Full name"
            value={userInfo.displayName}
            onChangeText={(text) => onChange('displayName', text)}
            errorMessage={errors.displayName}
          />
          <Input
            borderBottomColor={'silver'}
            placeHolder="Email"
            value={userInfo.email}
            onChangeText={(text) => onChange('email', text)}
            errorMessage={errors.email}
            editable={false}
            textColor="silver"
          />

          <Input
            placeHolder="Phone number"
            value={user.phoneNumber.replace(/(.965)(\d+)/, '$1 - $2')}
            editable={false}
            textColor="silver"
          />
          <TouchableOpacity
            disabled={!checkChanges()}
            onPress={onUpdate}
            style={{
              backgroundColor: !checkChanges()
                ? `${GS.secondaryColor}75`
                : GS.secondaryColor,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              paddingVertical: 10,
              width: '100%',
              marginTop: 20,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <RText style={{color: '#fff', fontSize: 17}}>Save</RText>
          </TouchableOpacity>
        </View>
        {/* body */}

        {isLoading && <ProgressLoading />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAccountInfo;
