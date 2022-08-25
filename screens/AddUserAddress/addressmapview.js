import React, { createRef, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import RNLocation from 'react-native-location';
import MapView from 'react-native-maps';
import { MAP_PIN_ADDRESS } from '../../assets/images';
import { RText } from '../../GlobeStyle';
import styles from './styles';

const AddressMapView = (props) => {
  const {
    location,
    mapChange,
    initialMarker,
    isLocInArea,
    expandDock,
    navigation,
    showUserLoc,
  } = props;
  const [state, setState] = useState(initialMarker || location);
  const [userLoc, setUserLoc] = useState(null);
  const mapRef = createRef();
  const onRegionChange = (region) => {
    mapChange([region.longitude, region.latitude]);
    setState(region);
  };

  const userLocation = () => {
    if (userLoc) {
      mapRef.current.animateToRegion(userLoc, 1000);
      return;
    }
  };

  // GET THE LOCATION OF USER
  useEffect(() => {
    RNLocation.getLatestLocation().then((_loc) => {
      if (_loc) {
        const _userLoc = {
          latitude: _loc.latitude,
          longitude: _loc.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        setUserLoc(_userLoc);
        mapRef.current.animateToRegion(_userLoc, 1000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showUserLoc) {
      userLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUserLoc]);

  return (
    <View style={styles.mapContainer}>
      <MapView
        loadingEnabled={false}
        style={styles.mapView}
        ref={mapRef}
        provider={'google'}
        onRegionChangeComplete={onRegionChange}
        region={state}
      />
      <View style={styles.markerFixed}>
        <Grayscale amount={!isLocInArea ? 1 : 0}>
          <Image style={styles.marker} source={MAP_PIN_ADDRESS} />
        </Grayscale>
      </View>
      <View style={styles.mapFooter}>
        {!isLocInArea && (
          <View style={styles.mapWraningContainer}>
            <RText style={styles.mapWraningText}>
              We do not deliver to this area.
            </RText>
          </View>
        )}
        <View style={styles.mapButtonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <RText style={styles.cancelButtonText}>Cancel</RText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => expandDock()}
            disabled={!isLocInArea}
            style={isLocInArea ? styles.saveButton : styles.disabledSaveButton}>
            <RText style={styles.saveButtonText}>Confirm</RText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddressMapView;
