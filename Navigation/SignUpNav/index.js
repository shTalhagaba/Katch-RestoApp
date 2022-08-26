import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import IOIcon from 'react-native-vector-icons/Ionicons';
import GS from '../../GlobeStyle';
import Otp from '../../screens/Auth/Otp';
import PhoneAuth from '../../screens/Auth/PhoneAuth';
import SignUp from '../../screens/Auth/SignUp';

const { Screen, Navigator } = createStackNavigator();

const SignUpNav = (props) => {
  const { setScreen, routeParams, tabNavigation } = props;
  const backToLogin = () => {
    setScreen('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: GS.primaryColor }}>
      <Navigator initialRouteName="PhoneAuth">
        <Screen name="PhoneAuth" options={{ headerShown: false }}>
          {(props) => <PhoneAuth goBack={backToLogin} {...props} />}
        </Screen>
        <Screen name="Otp" options={{ headerShown: false }}>
          {(props) => <Otp {...props} />}
        </Screen>
        <Screen name="Register" options={{ headerShown: false }}>
          {(props) => <SignUp {...props} routeParams={routeParams} tabNavigation={tabNavigation}/>}
        </Screen>
      </Navigator>
    </SafeAreaView>
  );
};

export const Header = (props) => {
  const { onBack } = props;
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <IOIcon
          name="md-arrow-back"
          size={30}
          color={GS.secondaryColor}
          style={{}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: StatusBar.currentHeight,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backBtn: {
    height: 50,
    justifyContent: 'center',
  },
});

export default SignUpNav;
