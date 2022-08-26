/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
//3rd party
import RNLocation from 'react-native-location';
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
import { connect } from 'react-redux';
//others
import { userLoc as userLocRedux } from '../../components/Redux/Actions/appActions';
import { Map as MapText } from '../../constants/staticText';
import GS, { BoldText } from '../../GlobeStyle';

const mapDispatchToProps = (dispatch) => {
  return {
    setUserLoc: (location) => {
      dispatch(userLocRedux(location));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
  };
};

export const LocationPermission = connect(
  mapStateToProps,
  mapDispatchToProps,
)((/** @type {{ children: any; setUserLoc: any; userLoc: any; }}*/ props) => {
  const { children, setUserLoc, userLoc } = props;
  const requestLocation = async (callBack) => {
    if (Platform.OS === 'android') {
      const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const result = await request(permission);
      if (result === 'granted') {
        const location = await RNLocation.getLatestLocation();
        setUserLoc({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        if (callBack) {
          callBack();
        }
      } else if (['unavailable', 'denied', 'blocked'].includes(result)) {
        openSettings();
      }
    } else {
      openSettings();
    }
  };

  const buttonText =
    Platform.OS === 'android'
      ? 'Click to give location permissions'
      : 'Click to go to settings';

  return (
    <>
      {userLoc === null ? (
        <View style={styles.container}>
          <BoldText style={styles.title1}>
            {MapText.error.noLocation.title1}
            <BoldText style={styles.title2}>
              {MapText.error.noLocation.title2}
            </BoldText>
          </BoldText>
          <BoldText style={styles.textMessage}>
            {MapText.error.noLocation.message}
          </BoldText>

          <TouchableOpacity style={styles.button} onPress={requestLocation}>
            <BoldText style={styles.buttonText}>{buttonText}</BoldText>
          </TouchableOpacity>
        </View>
      ) : (
        children
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 210,
  },
  title1: {
    color: GS.secondaryColor,
  },
  title2: {
    color: '#000',
  },
  textMessage: {
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    color: GS.secondaryColor,
  },
});
