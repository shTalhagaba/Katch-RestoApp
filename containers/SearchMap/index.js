import React, { memo, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
//3rd party
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import Animated, { Easing } from 'react-native-reanimated';
import Svg, { Image } from 'react-native-svg';
import { MAP_PIN_ADDRESS, USER_MAP_PIN } from '../../assets/images';
import ClusterMarker from '../../components/ClusterMarker';
import ClusterMarkerUser from '../../components/ClusterMarker/usercluster';
import { customFont, normalizedFontSize, RText } from '../../GlobeStyle';
import { MAP_STYLE } from '../../screens/Map/mapstyle';
import SearchFilterSortModal from '../SearchFilterModal';
import RNLocation from 'react-native-location';
import { distance } from '../../components/Helpers';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Map = (props) => {
  const {
    mapRef,
    mapCenterRef,
    userLoc,
    animatedResearch,
    refreshLocations,
    navigation,
    showRestaurantCard,
    clusterPress,
    requestLocation,
    showSearchFilter,
    onFilterClicked,
    searchResults,
    commenceSearch,
    searchQuery,
    setSearchQuery,
    tags,
    categories,
    services,
    getLocations,
    locations,
    selectedAddress,
  } = props;
  let [show, setShow] = useState(false);
  let [mapReady, setMapReady] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const effectiveDistance = 0.1; //In KM i.e. 100M

  useEffect(() => {
    if (userPosition) {
      if (selectedAddress) {
        try {
          const _distance = parseFloat(
            distance(selectedAddress.location.coordinates, userPosition),
          );
          setShowMarker(_distance > effectiveDistance);
        } catch (e) {
          setShowMarker(false);
        }
      } else {
        setShowMarker(false);
      }
    } else {
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
                setUserPosition({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                });
                if (selectedAddress) {
                  try {
                    const _distance = parseFloat(
                      distance(selectedAddress.location.coordinates, {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }),
                    );
                    setShowMarker(_distance > effectiveDistance);
                  } catch (e) {
                    setShowMarker(false);
                  }
                } else {
                  setShowMarker(false);
                }
              }
            });
          }
        })
        .catch((error) => {});
    }
  }, [selectedAddress]);

  useEffect(() => {
    getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, searchResults, userLoc]);

  useEffect(() => {
    if (mapReady) {
      mapRef.current.animateToRegion(userLoc);
      getLocations();
    }
  }, [mapReady, userLoc, mapRef]);

  // Render Cluster marker
  const renderCluster = (cluster) => {
    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={`cluster-${id}`}
        tracksViewChanges={false}
        tracksInfoWindowChanges={false}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}>
        <View style={styles.markerContainer}>
          <View style={styles.markerTextContainer}>
            <RText
              fontName={customFont.axiformaMedium}
              style={styles.markerText}>
              {points}
            </RText>
          </View>
        </View>
      </Marker>
    );
  };

  //If the mapCenterRef is null set userLoc as current location

  if (!mapCenterRef.current) {
    mapCenterRef.current = userLoc;
  }
  return (
    <>
      <MapView
        followsUserLocation={false}
        minZoomLevel={5}
        maxZoomLevel={20}
        zoomControlEnabled={false}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        showsTraffic={false}
        showsBuildings={false}
        showsScale={false}
        showsPointsOfInterest={false}
        showsMyLocationButton={false}
        showsCompass={false}
        loadingEnabled={true}
        style={{ flex: 1, height: windowHeight, width: windowWidth }}
        showsUserLocation={false}
        ref={mapRef}
        mapType="standard"
        clustering={true}
        clusterColor={'#1fc70a'}
        minPoints={2}
        // function to render cluster. Marker can be customized to change cluster
        renderCluster={renderCluster}
        onLayout={() => {
          setMapReady(true);
        }}
        animationEnabled={false}
        customMapStyle={MAP_STYLE}
        initialRegion={mapCenterRef.current}
        onRegionChange={(region) => (mapCenterRef.current = region)}
        // Padding for search bar and restaurant cards in map
        // if no padding defined markers may hide below the searchbar and restaurant cards
        // @ts-ignore
        mapPadding={{
          left: 0,
          right: 0,
          top: 100,
        }}
        onClusterPress={() => clusterPress()}
        toolbarEnabled={false}
        onRegionChangeComplete={(region) => {
          mapCenterRef.current = region;

          if (show) {
            Animated.timing(animatedResearch, {
              toValue: 1,
              duration: 300,
              easing: Easing.linear,
            }).start();
          }
          if (!show) {
            setShow(true);
          }
        }}>
        {mapReady && locations
          ? locations.map((coordinate, index) => (
              <ClusterMarker
                coordinate={coordinate}
                key={`${index}-${coordinate.latitude}-${coordinate.longitude}`}
                navigation={navigation}
                setVisibleCallout={showRestaurantCard}
              />
            ))
          : null}
        {mapReady && userLoc && showMarker && (
          <Marker coordinate={userLoc} cluster={false}>
            <Svg width={50} height={40}>
              <Image href={MAP_PIN_ADDRESS} width={50} height={40} />
            </Svg>
          </Marker>
          // <ClusterMarkerUser value={userLoc} cluster={false} />
        )}
        {userPosition && mapReady && (
          <Marker coordinate={userPosition} cluster={false}>
            <Svg width={50} height={40}>
              <Image href={USER_MAP_PIN} width={50} height={40} />
            </Svg>
          </Marker>
        )}
      </MapView>
      <SearchFilterSortModal
        requestLocation={requestLocation}
        commenceSearch={commenceSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={tags}
        categories={categories}
        viewSortFilter={showSearchFilter}
        toggleSortFilter={onFilterClicked}
        services={services}
      />
    </>
  );
};

export default memo(Map);

const styles = StyleSheet.create({
  markerContainer: {
    padding: 8,
    backgroundColor: '#1fc70a',
    borderRadius: 50,
    height: 38,
    width: 38,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerTextContainer: {
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#fff',
    padding: 4,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: normalizedFontSize(4.5),
    color: '#fff',
  },
});
