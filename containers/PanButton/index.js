import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import RNLocation from 'react-native-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
//others
import GS from '../../GlobeStyle';
import style from './style';

const PanButton = (props) => {
  const { mapRef } = props;
  const [currentPhysicalLocation, setCurrentPhysicalLocation] = useState(null);
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;

  const showHeight =
    Platform.OS !== 'ios'
      ? StatusBar.currentHeight + 50 + statusBarHeight
      : insets.top + 50 + statusBarHeight;

  const pickLocationPress = () => {
    if (currentPhysicalLocation) {
      mapRef.current.animateToRegion(currentPhysicalLocation);
    }
  };

  useEffect(() => {
    RNLocation.checkPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    })
      .then((res) => {
        if (res) {
          RNLocation.getLatestLocation().then((location) => {
            if (location) {
              setCurrentPhysicalLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          });
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      {currentPhysicalLocation && (
        <View style={[style.container, { top: showHeight }]}>
          {
            <View style={[style.locationContainer]}>
              <TouchableOpacity
                style={style.locationButton}
                onPress={pickLocationPress}>
                <FAIcon
                  name="location-arrow"
                  color={GS.secondaryColor}
                  size={15}
                />
              </TouchableOpacity>
            </View>
          }
        </View>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
  };
};

export default connect(mapStateToProps, null)(PanButton);
