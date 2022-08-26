/* eslint-disable react-native/no-color-literals */
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

//3rd party
import { Marker } from 'react-native-maps';
import GS from '../../GlobeStyle';
const ClusterMarkerUser = (
  /** @type {{ value: any; identifier?: String; cluster: boolean }} */ props,
) => {
  const { value, identifier } = props;
  return (
    <Marker
      identifier={identifier}
      coordinate={value}
      tracksViewChanges={false}
      tracksInfoWindowChanges={false}>
      <View style={style.container}>
        <View style={style.subContainer}>
          <View style={style.markerContainer} />
        </View>
      </View>
    </Marker>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    borderWidth: 1.2,
    borderColor: '#ddd',
    borderRadius: 24,
    height: 24,
    width: 24,
    bottom: 0,
    margin: 'auto',
  },
  markerContainer: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    backgroundColor: GS.logoBlue,
  },
});

export default memo(ClusterMarkerUser);
