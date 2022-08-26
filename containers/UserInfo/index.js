import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import IOIcon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//others
import GS, { normalizedFontSize, RText, customFont } from '../../GlobeStyle';
import { getGreetings } from '../../components/Helpers';
import { RAMADAN_BANNER } from '../../assets/images';
import { connect } from 'react-redux';

const UserInfo = (props) => {
  const { navigation, marketingData } = props;
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios'
      ? Math.ceil(StatusBar.currentHeight)
      : insets.top < 1
      ? 25
      : insets.top;

  const getName = () => {};
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: statusBarHeight,
        paddingBottom: 15,
        paddingHorizontal: 0,
      }}>
      <BackButton navigation={navigation} statusBarHeight={statusBarHeight} />
      {marketingData?.ramadan && (
        <ImageBackground
          source={RAMADAN_BANNER}
          style={{
            width: '100%',
            position: 'absolute',
            top: -statusBarHeight,
            minHeight: 250,
          }}
        />
      )}
      <RText
        style={{
          color: '#fff',
          fontSize: normalizedFontSize(13),
          fontFamily: customFont.axiformaSemiBold,
        }}>
        Good {getGreetings()}
      </RText>
      <RText
        numberOfLines={1}
        style={{
          color: '#fff',
          fontSize: normalizedFontSize(18),
          marginTop: 10,
          fontFamily: customFont.axiformaSemiBold,
        }}>
        {auth().currentUser.displayName}
      </RText>
      <RText
        style={{
          color: '#fff',
          fontSize: normalizedFontSize(7),
          marginTop: 10,
          fontFamily: customFont.axiformaRegular,
        }}>
        {auth().currentUser.phoneNumber}
      </RText>
      <RText
        style={{
          color: '#fff',
          fontSize: normalizedFontSize(7),
          marginTop: 7,
          fontFamily: customFont.axiformaRegular,
        }}>
        {auth().currentUser.email}
      </RText>
    </View>
  );
};

const NoUser = ({ setScreen }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: GS.primaryColor,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <View
        style={{
          backgroundColor: '#ffffff',
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 20,
          borderRadius: 10,
        }}>
        <RText style={{ padding: 20 }}>
          Login or create an account to find your favorite dishes easily and
          have a faster checkout experience
        </RText>
        <TouchableOpacity
          style={{
            backgroundColor: GS.secondaryColor,
            borderRadius: 8,
            padding: 10,
          }}
          onPress={() => setScreen('Login')}>
          <RText
            style={{
              textAlign: 'center',
              fontSize: 15,
              color: GS.buttonTextColor,
            }}>
            Login
          </RText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BackButton = ({ navigation, statusBarHeight }) => (
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={{
      position: 'absolute',
      top: statusBarHeight - 10,
      left: 10,
      zIndex: 1,
    }}>
    <IOIcon name="md-arrow-back" size={40} color="#fff" />
  </TouchableOpacity>
);

const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(UserInfo);


export { NoUser };
