import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import GS from '../../GlobeStyle';

const ClusterMarker = (props) => {
  const { coordinate, setVisibleCallout } = props;
  return (
    <Marker
      key={`${coordinate.latitude}_${coordinate.longitude}`}
      coordinate={coordinate}
      tracksViewChanges={false}
      tracksInfoWindowChanges={false}
      onPress={() => {
        setVisibleCallout(coordinate);
      }}
      onSelect={() => {
        setVisibleCallout(coordinate);
      }}>
      <View style={style.container}>
        <View style={style.wrapper}>
          <View
            style={
              coordinate.isOpen
                ? coordinate.services?.includes('Delivery')
                  ? style.deliveryMarker
                  : style.markerContainer
                : style.disabledMarkerContainer
            }
          />
        </View>
      </View>
    </Marker>
  );
};

const style = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wrapper: {
    borderWidth: 1.2,
    borderColor: '#ddd',
    borderRadius: 24,
    height: 24,
    width: 24,
    bottom: 0,
    margin: 'auto',
  },
  disabledMarkerContainer: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    backgroundColor: '#999',
  },
  deliveryMarker: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    backgroundColor: GS.logoBlue,
  },
  markerContainer: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    backgroundColor: '#1fc70a',
  },
});

export default memo(ClusterMarker);
