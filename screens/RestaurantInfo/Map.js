import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import Svg, { Image } from 'react-native-svg';
import { MAP_PIN_ADDRESS } from '../../assets/images';

const MapLocation = ({ location }) => {
  if (location) {
    const region = { latitudeDelta: 0.1, longitudeDelta: 0.1, ...location };

    return (
      <MapView
        provider="google"
        loadingEnabled={true}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1, minHeight: 200 }}
        region={region}>
        <Marker coordinate={location}>
          <Svg width={50} height={40}>
            <Image href={MAP_PIN_ADDRESS} width={50} height={40} />
          </Svg>
        </Marker>
      </MapView>
    );
  } else {
    return null;
  }
};

export default MapLocation;
