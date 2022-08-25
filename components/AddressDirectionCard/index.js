import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import Svg, { Image } from 'react-native-svg';
import MapView, { Marker } from 'react-native-maps';
import { MAP_PIN } from '../../assets/images';
import ClusterMarkerUser from '../../components/ClusterMarker/usercluster';

const AddressDirectionCard = ({ navigation, ...props }) => {
  const { sourceAddress, destinationAddress } = props;

  const mapRef = useRef(null);
  const edgePadding = { top: 50, right: 50, bottom: 10, left: 50 };
  const pinHeight = 35;
  const pinWidth = 35;
  useEffect(() => {
    if (sourceAddress && destinationAddress) {
      mapRef.current.fitToSuppliedMarkers(
        ['source', 'destination'],
        {
          edgePadding,
        },
        false,
      );
    }
  }, [sourceAddress, destinationAddress, edgePadding]);
  return (
    <View style={styles.addressContainer}>
      <MapView
        ref={mapRef}
        style={styles.mapContainer}
        provider={'google'}
        onMapReady={() => {
          mapRef.current.fitToSuppliedMarkers(
            ['source', 'destination'],
            {
              edgePadding,
            },
            true,
          );
        }}
        maxZoomLevel={18}>
        {sourceAddress && sourceAddress.latitude && (
          <Marker coordinate={sourceAddress} identifier="source">
            <Svg width={pinWidth} height={pinHeight}>
              <Image href={MAP_PIN} width={pinWidth} height={pinHeight} />
            </Svg>
          </Marker>
        )}
        {destinationAddress && destinationAddress.latitude && (
          <ClusterMarkerUser
            cluster={false}
            value={destinationAddress}
            identifier="destination"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    height: 220,
  },
  mapContainer: {
    flex: 1,
  },
});
const mapStateToProps = (state) => {
  return {
    user: state.user,
    userLoc: state.app.userLoc,
  };
};

export default connect(mapStateToProps)(AddressDirectionCard);
