/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
//3rd party
import { useLazyQuery } from '@apollo/react-hooks';
import { BlurView } from '@react-native-community/blur';
import { Viewport } from '@skele/components';
import sort from 'fast-sort';
import React, { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BackHandler,
  Dimensions,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RNLocation from 'react-native-location';
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
import Animated, { Easing } from 'react-native-reanimated';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
//others
import { GET_STORE_INFO } from '../../components/GraphQL';
import { userLoc as userLocRedux } from '../../components/Redux/Actions/appActions';
import { Map as MapText } from '../../constants/staticText';
import MapRestaurantList from '../../containers/MapRestaurantList';
import MapHeader from '../../containers/MapHeader';
import Map from '../../containers/SearchMap';
import GS, { BoldText, RText } from '../../GlobeStyle';
import Card from '../../components/BestRestCard';
import { useMapSearchHook } from '../../components/hooks';
import { isInsideBoundingBox } from '../../components/Helpers';
import PanButton from '../../containers/PanButton';

const { Value } = Animated;
const Search = (props) => {
  const { navigation, userLoc, selectedAddress } = props;
  const [locations, setLocation] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef(null);
  const listRef = useRef(null);
  const mapCenterRef = useRef(userLoc);
  const animated = useRef(new Value(1)).current;
  const animatedResearch = useRef(new Value(0)).current;
  const searchResultsAnimation = useRef(new Value(0)).current;
  const refreshLocations = useRef(null);
  const sheetRef = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRestaurantCard, setRestaurantCard] = useState(null);
  const [restaurantList, setRestaurantList] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [storeInfoLoading, setStoreInfoLoading] = useState(false);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    setShowQuickFilters,
    searchResults,
    searchResultsPaginated,
    fetchMorePaginated,
    debounce,
    commenceSearch,
    tags,
    categories,
    services,
  } = useMapSearchHook({
    type: 'both',
    searchString: '',
    cursor: null,
    sort: [],
    filter: [],
    userLoc: userLoc
      ? {
          latitude: userLoc.latitude,
          longitude: userLoc.longitude,
        }
      : null,
  });

  const getLocations = () => {
    if (searchResults) {
      mapRef.current
        .getMapBoundaries()
        .then((boundaries) => {
          const _locations = searchResults.data.map((result) => {
            return {
              _id: result._id,
              shopName: result.shopName,
              longitude: result.location.longitude,
              latitude: result.location.latitude,
              isOpen: result.isOpen,
              storeId: result._id,
              services: result.services,
            };
          });
          return isInsideBoundingBox(userLoc, _locations, boundaries);
        })
        .then((res) => {
          setLocation(res);
        });
    }
  };

  const onSearchTextChange = (text, callBack) => {
    const _searchQuery = { ...searchQuery };
    _searchQuery.searchString = text.trim();
    setSearchQuery(_searchQuery);
    callBack(_searchQuery);
  };

  const [getStoreInfo] = useLazyQuery(GET_STORE_INFO, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (query) => {
      setStoreInfo(query.getStore);
      setStoreInfoLoading(false);
      toggleDrawer(true);
      setShowDrawer(true);
    },
  });

  // Get List Of Restaurant When Component Loads
  useEffect(() => {
    if (userLoc && userLoc.longitude && userLoc.latitude) {
      commenceSearch();
    }
  }, [userLoc]);

  useEffect(() => {
    if (showRestaurantCard) {
      setStoreInfoLoading(true);
      toggleDrawer(true);
      getStoreInfo({
        variables: { id: showRestaurantCard.storeId },
      });
    }
  }, [showRestaurantCard]);

  const fetchMoreOpenStores = (callBack) => {
    fetchMorePaginated(callBack);
  };

  useEffect(() => {
    if (userLoc && refreshLocations.current) {
      refreshLocations.current();
    }
  }, [userLoc, refreshLocations.current]);

  const onBack = () => {
    if (showSearchResults && userLoc) {
      Keyboard.dismiss();
      Animated.timing(searchResultsAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
      }).start(({ finished }) => {
        if (finished) {
          setShowSearchResults(false);
        }
      });
    } else {
      navigation.canGoBack() ? navigation.goBack() : BackHandler.exitApp();
    }

    return true;
  };

  // Toggle The Bottomsheet
  const toggleDrawer = (show) => {
    if (show) {
      sheetRef?.current?.snapTo(1);
    } else {
      sheetRef?.current?.snapTo(2);
    }
  };

  const showRestList = () => {
    setShowSearchResults(!showSearchResults);
    refreshLocations.current();

    return showSearchResults;
  };

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBack,
    );
    if (showSearchResults) {
      sheetRef?.current?.snapTo(1);
    } else {
      sheetRef?.current?.snapTo(2);
    }
    return () => {
      return backhandler.remove();
    };
  }, [showSearchResults]);

  const requestLocation = (callBack = null) => {
    if (Platform.OS === 'android') {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      request(permission)
        .then((result) => {
          if (result !== 'denied') {
            RNLocation.getLatestLocation().then((location) => {
              props.setUserLoc({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              });

              mapCenterRef.current = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              };
            });
          }
          return result;
        })
        .then((res) => {
          if (callBack) {
            callBack(res);
          }
        });
    } else {
      openSettings();
    }
  };

  let animation = useRef(new Animated.Value(0)).current;
  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const windowAndStatusBarHeight = windowHeight + insets.top + 20;

  const open = storeInfo
    ? windowAndStatusBarHeight - 390
    : windowAndStatusBarHeight / 2;
  const halfWay = storeInfo
    ? windowAndStatusBarHeight - 390
    : windowAndStatusBarHeight / 2;
  const closed = windowAndStatusBarHeight;

  // const mapHeight = Animated.interpolate(animation, {
  //   inputRange: [0, 0.5, 1],
  //   outputRange: [open, halfWay, closed],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  // const blurViewOpacity = Animated.interpolate(animation, {
  //   inputRange: [0, 1],
  //   outputRange: [1, 0.8],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  // const zIndexBlur = Animated.interpolate(animation, {
  //   inputRange: [0, 0.3],
  //   outputRange: [100, 0],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  const onFilterClicked = () => {
    setShowSearchFilter((_toggle) => !_toggle);
  };

  const onDocked = () => {
    toggleDrawer(false);
    setShowDrawer(false);
    setRestaurantCard(null);
  };

  // Check If the bottomsheet is Docked
  Animated.useCode(
    () =>
      Animated.onChange(
        animation,
        Animated.block([
          Animated.cond(
            Animated.eq(animation, 1),
            Animated.call([], () => {
              onDocked && onDocked();
            }),
          ),
        ]),
      ),
    [onDocked],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: GS.primaryColor,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <StatusBar translucent backgroundColor={`${GS.primaryColor}10`} />
        {showDrawer && !storeInfo ? (
          <Animated.View
            style={{
              // opacity: blurViewOpacity,
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              // zIndex: zIndexBlur,
            }}>
            <BlurView
              style={{ flex: 1 }}
              blurType="dark"
              blurAmount={100}
              onPress={() => {
                toggleDrawer(false);
                setShowDrawer(false);
              }}
            />
          </Animated.View>
        ) : (
          <View />
        )}

        <Animated.View
          style={{
            backgroundColor: '#fff',
            // height: mapHeight, // : "100%",
            height:'100%',
            minHeight: windowHeight / 2 + 150,
          }}>
          <MapHeader
            navigation={navigation}
            refreshLocations={getLocations}
            onBack={onBack}
            animatedResearch={animatedResearch}
            setLocation={setLocation}
            animated={animated}
            showRestList={showRestList}
            showSearchResults={showSearchResults}
            onFilterClicked={onFilterClicked}
            searchQuery={searchQuery}
            setShowQuickFilters={setShowQuickFilters}
            searchResults={searchResults}
            onTextChange={onSearchTextChange}
            debounce={debounce}
            commenceSearch={commenceSearch}
          />
          <PanButton navigation={navigation} mapRef={mapRef} />

          {userLoc &&
          userLoc.longitude &&
          userLoc.latitude &&
          userLoc.longitudeDelta &&
          userLoc.latitudeDelta ? (
            <Map
              refreshLocations={refreshLocations}
              mapRef={mapRef}
              mapCenterRef={mapCenterRef}
              listRef={listRef}
              userLoc={userLoc}
              animatedResearch={animatedResearch}
              locations={locations}
              navigation={navigation}
              docked={showDrawer}
              clusterPress={onDocked}
              showRestaurantCard={setRestaurantCard}
              showSearchFilter={showSearchFilter}
              onFilterClicked={onFilterClicked}
              searchResults={searchResults}
              commenceSearch={commenceSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              tags={tags}
              categories={categories}
              services={services}
              getLocations={getLocations}
              selectedAddress={selectedAddress}
            />
          ) : userLoc === null ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}>
              <BoldText style={{ color: GS.secondaryColor }}>
                {MapText.error.noLocation.title1}
                <BoldText style={{ color: '#000' }}>
                  {MapText.error.noLocation.title2}
                </BoldText>
              </BoldText>
              <BoldText style={{ textAlign: 'center', marginTop: 10 }}>
                {MapText.error.noLocation.message}
              </BoldText>

              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={requestLocation}>
                <BoldText style={{ color: GS.secondaryColor }}>
                  {Platform.OS === 'android'
                    ? 'Click to give location permissions'
                    : 'Click to go to settings'}
                </BoldText>
              </TouchableOpacity>
            </View>
          ) : null}
        </Animated.View>
        {searchResultsPaginated?.data.length > 0 && !showDrawer && (
          <View
            style={[
              {
                justifyContent: 'flex-end',
                marginBottom: 20,
                zIndex: 1,
                bottom: 0,
                position: 'absolute',
                left: '40%',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                toggleDrawer(true);
                setShowDrawer(true);
                setStoreInfo(null);
              }}
              style={styles.toggleButton}>
              <RText style={{ color: GS.primaryColor }}>View List</RText>
            </TouchableOpacity>
          </View>
        )}
        {
          <BottomSheet
            ref={sheetRef}
            enabledBottomClamp={true}
            initialSnap={1}
            callbackNode={animation}
            snapPoints={
              storeInfo || storeInfoLoading
                ? [380, 380, 0]
                : ['80%', '50%', '0%']
            }
            // change init snappoint on basis of height of card
            overdragResistanceFactor={16}
            enabledInnerScrolling={true}
            enabledContentGestureInteraction={true}
            decelerationRate="fast"
            renderHeader={() => (
              <View style={{ backgroundColor: 'transparent' }}>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      onDocked();
                    }}
                    style={styles.toggleButton}>
                    <RText style={{ color: GS.primaryColor }}>
                      Back To Map
                    </RText>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    paddingVertical: 15,
                    backgroundColor: GS.primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      width: 150,
                      height: 7,
                      backgroundColor: '#e2e2e2',
                      borderRadius: 20,
                    }}
                  />
                </View>
              </View>
            )}
            renderContent={() => (
              <View
                style={{
                  backgroundColor: '#fff',
                }}>
                {(storeInfo && storeInfo._id) || storeInfoLoading ? (
                  <Viewport.Tracker>
                    <ScrollView
                      scrollEnabled={false}
                      style={{ height: '100%' }}>
                      <View
                        style={{
                          padding: 20,
                          flex: 1,
                          minHeight: 280,
                          width: '100%',
                          backgroundColor: '#fff',
                        }}>
                        {!storeInfoLoading ? (
                          <Card
                            {...storeInfo}
                            navigation={navigation}
                            onClick={() => {
                              navigation.navigate('Rest', {
                                screen: 'Overview',
                                id: storeInfo._id,
                              });
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              backgroundColor: GS.placeHolderColor,
                              height: '100%',
                              minWidth: '100%',
                              borderRadius: 8,
                            }}
                          />
                        )}
                      </View>
                    </ScrollView>
                  </Viewport.Tracker>
                ) : (
                  <Viewport.Tracker>
                    <ScrollView
                      contentContainerStyle={{
                        flexGrow: 1,
                        backgroundColor: '#fff',
                      }}
                      style={{
                        height: '100%',
                      }}>
                      <View
                        style={{
                          backgroundColor: '#fff',
                        }}>
                        {searchResultsPaginated &&
                          searchResultsPaginated.data && (
                            <MapRestaurantList
                              fetchMoreOpenStores={fetchMoreOpenStores}
                              openStores={searchResultsPaginated}
                              hideHeader={true}
                            />
                          )}
                      </View>
                    </ScrollView>
                  </Viewport.Tracker>
                )}
              </View>
            )}
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: GS.logoBlue,
  },
});

const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
    selectedAddress: state.user.selectedAddress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserLoc: (location) => {
      dispatch(userLocRedux(location));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
