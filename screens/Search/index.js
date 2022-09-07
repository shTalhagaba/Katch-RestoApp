import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StatusBar,
  BackHandler,
  Keyboard,
  TouchableOpacity,
  Platform,
} from 'react-native';
//3rd party
import { useQuery,useLazyQuery } from '@apollo/client'
import Animated, { Easing } from 'react-native-reanimated';
import loDebounce from 'lodash.debounce';
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';
import RNLocation from 'react-native-location';
import ADIcon from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';

//others
import {
  GET_TAGS,
  GET_CATEGORIES,
  GET_SERVICES,
  SEARCH_SELLERS,
  SEARCH_PRODUCTS,
  GET_SHOW_ETA,
} from '../../components/GraphQL';
import GS, { normalizedFontSize, RText } from '../../GlobeStyle';
import { animateLayout, capitalizeFirstLetter } from '../../components/Helpers';
import SearchHeader from '../../containers/SearchHeader';
import SearchResults from '../../containers/SearchResults';
import { connect } from 'react-redux';
import { userLoc as userLocRedux } from '../../components/Redux/Actions/appActions';
import { logEvent } from '../../components/AppReporting';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Value } = Animated;

const Search = (props) => {
  const { navigation, route, userLoc } = props;
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewSortFilter, setViewSortFilter] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [defaultFilter, setDefaultFilter] = useState('Sort BY');
  const mapCenterRef = useRef(userLoc);
  const animated = useRef(new Value(0)).current;
  const searchResultsAnimation = useRef(new Value(0)).current;
  const [showETA, setShowETA] = useState(false);

  const searchInputs = {
    type: 'both',
    searchString: route.params.searchString,
    cursor: null,
    limit: 6,
    sort: [],
    filter: [],
    userLoc: userLoc
      ? {
          latitude: userLoc.latitude,
          longitude: userLoc.longitude,
        }
      : null,
  };

  const [searchQuery, setSearchQuery] = useState(searchInputs);

  const [combinedList, setCombinedList] = useState(null);

  const [getSellerSearch, { fetchMore: fetchMoreSellers }] = useLazyQuery(
    SEARCH_SELLERS,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data.searchSellers) {
          setCombinedList({ ...combinedList, sellers: data.searchSellers });
          setIsLoading(false);
        }
      },
    },
  );

  useEffect(() => {
    if (combinedList) {
      setSearchResults(combinedList);
      setIsLoading(false);
    }
  }, [combinedList]);

  const [getProductsSearch, { fetchMore: fetchMoreProducts }] = useLazyQuery(
    SEARCH_PRODUCTS,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data.searchProducts) {
          setCombinedList({ ...combinedList, products: data.searchProducts });
          setIsLoading(false);
        }
      },
    },
  );

  useFocusEffect(
    useCallback(() => {
      if (
        (searchResults?.sellers.data.length < 1 &&
          searchResults?.products.data.length < 1) ||
        !searchResults
      ) {
        setShowQuickFilters(true);
      }
    }, [navigation]),
  );

  useQuery(GET_TAGS, {
    onCompleted: (data) => {
      setTags(data.getTags);
    },
    variables: { makeSort: true },
    fetchPolicy: 'no-cache',
  });

  useQuery(GET_SHOW_ETA, {
    onCompleted: (data) => {
      setShowETA(data.getLandingContent.showETA);
    },
    variables: { makeSort: true },
    fetchPolicy: 'no-cache',
  });

  useQuery(GET_CATEGORIES, {
    onCompleted: (data) => {
      setCategories(data.getCategories);
    },
    variables: { makeSort: true },
    fetchPolicy: 'no-cache',
  });

  useQuery(GET_SERVICES, {
    onCompleted: (data) => {
      setServices(data.getServices);
    },
    variables: { makeSort: true },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (
      (route.params.hasOwnProperty('filter') &&
        route.params.filter.length > 0) ||
      (route.params.hasOwnProperty('sort') && route.params.sort.length > 0) ||
      (route.params.hasOwnProperty('searchString') &&
        route.params.searchString !== '')
    ) {
      setSearchQuery((state) => {
        delete route.params.toggleSortFilter;
        state = {
          ...state,
          ...route.params,
        };
        commenceSearch(state);
        return state;
      });

      setShowSearchResults(true);
    }

    return () => {
      navigation.setParams({
        searchString: '',
        sort: [],
        filter: [],
        toggleSortFilter: false,
      });
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (
        searchQuery.searchString !== route.params.searchString &&
        route.params.searchString !== ''
      ) {
        setSearchQuery((state) => {
          state.searchString = route.params.searchString;
          commenceSearch(state);
          return state;
        });
      }

      if (route.params.toggleSortFilter) {
        toggleSortFilter(true);
      }

      return () => {
        navigation.setParams({
          toggleSortFilter: null,
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params.searchString, route.params.toggleSortFilter]),
  );

  useEffect(() => {
    if (route.params.searchCategory) {
      if (route.params.searchCategory === 'See More') {
        setSearchQuery((state) => {
          delete state.searchCategory;
          toggleSortFilter(true);
          setDefaultFilter('Category');
          return state;
        });

        return;
      }
      setSearchQuery((state) => {
        state.filter = [
          {
            type: 'category',
            values: Array.isArray(route.params.searchCategory)
              ? route.params.searchCategory
              : [route.params.searchCategory],
          },
        ];
        delete state.searchCategory;
        // @ts-ignore
        commenceSearch(state);
        return state;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.searchCategory, route.params.updated]);

  // animate search in
  useEffect(() => {
    if (showSearchResults) {
      Animated.timing(searchResultsAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
      }).start();
    }
  }, [showSearchResults]);

  const onTextChange = (text, callBack) => {
    const state = searchQuery;
    state.searchString = text;
    setSearchQuery({ ...state });
    callBack(state);
  };

  const onBack = () => {
    navigation.canGoBack() ? navigation.goBack() : BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBack);
  }, [showSearchResults]);

  const debounce = useCallback(() => {
    const search = loDebounce((searchInputs) => {
      logEvent('search', {
        from: 'Search Screen',
        searched: searchInputs.searchString,
      });

      animateLayout();

      if (searchInputs.searchString !== '') {
        searchInputs.searchString = searchInputs.searchString.trim();
        setShowQuickFilters(false);
      }
      setIsLoading(true);
      getProductsSearch({
        variables: { options: { limit: 10, page: 1 }, searchInputs },
      });
      getSellerSearch({ variables: { options: { limit: 10 }, searchInputs } });
    }, 1500);

    return {
      search,
      cancel: search.cancel,
    };
  }, []);

  const commenceSearch = (newQuery = false) => {
    const query = newQuery ? newQuery : searchQuery;
    logEvent('search', {
      from: 'Search Screen',
      searched: query.searchString,
    });
    Keyboard.dismiss();

    if (query.searchString !== '') {
      query.searchString = query.searchString.trim();
      setShowQuickFilters(false);
    }
    setIsLoading(true);
    getProductsSearch({
      variables: { options: { limit: 10, page: 1 }, searchInputs: query },
    });
    getSellerSearch({
      variables: { options: { limit: 10, page: 1 }, searchInputs: query },
    });
  };

  const toggleSortFilter = (value = null) => {
    setDefaultFilter('Sort By');
    if (value === null) {
      setViewSortFilter(!viewSortFilter);
      setShowSearchResults(true);
    } else {
      setViewSortFilter(value);
    }
  };

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

  const insets = useSafeAreaInsets();

  const statusBarHeight =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;

  const onScroll = () => {
    if (showQuickFilters) {
      setShowQuickFilters(false);
    }
  };
  return (
    <>
      <View style={{ flex: 1, overflow: 'hidden', backgroundColor: '#fff' }}>
        <SearchHeader
          route={route}
          showQuickFilters={showQuickFilters}
          setShowQuickFilters={setShowQuickFilters}
          toggleSortFilter={toggleSortFilter}
          searchResultsAnimation={searchResultsAnimation}
          commenceSearch={commenceSearch}
          debounce={debounce}
          onTextChange={onTextChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowSearchResults={setShowSearchResults}
          onBack={onBack}
          animated={animated}
          navigation={navigation}
          searchResults={searchResults}
        />
        {/* selected filters */}
        {(searchQuery.filter.length > 0 || searchQuery.sort.length > 0) && (
          <View
            style={{
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              marginBottom: 5,
              paddingVertical: 5,
              paddingHorizontal: 15,
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              top: statusBarHeight,
              backgroundColor: '#fff',
            }}>
            {searchQuery.sort.map((sort) => {
              const name = {
                distance: 'Closest to me',
                ttp: 'Time To Prepare',
                totalCompletedOrders: 'Best selling',
              };

              const onPress = () => {
                setSearchQuery((state) => {
                  state.sort = [];
                  commenceSearch(state);
                  return state;
                });
              };

              return sort !== 'asc' ? (
                <TouchableOpacity
                  onPress={onPress}
                  key={sort}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#b0e9ff',
                    borderWidth: 0.5,
                    borderColor: '#2cb4eb',
                    borderRadius: 20,
                    marginHorizontal: 5,
                    marginVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <RText
                    style={{
                      fontSize: normalizedFontSize(6),
                      marginRight: 5,
                      color: '#363946',
                    }}>
                    {capitalizeFirstLetter(name[sort])}
                  </RText>
                  <ADIcon color="#363946" name="close" size={17} />
                </TouchableOpacity>
              ) : null;
            })}
            {searchQuery.filter.map(({ type, values }, index) => (
              <View key={index}>
                <RText
                  style={{
                    fontSize: normalizedFontSize(6),
                    marginRight: 5,
                    color: '#363946',
                    paddingVertical: 5,
                    textTransform: 'capitalize',
                    width: '100%',
                  }}>
                  {type}:
                </RText>
                {values.map((value, valueIndex) => {
                  const name = {
                    5: 'Rating: 5+',
                    4.5: 'Rating: 4.5+',
                    4: 'Rating: 4+',
                    3.5: 'Rating: 3.5+',
                    3: 'Rating: 3+',
                    2.5: 'Rating: 2.5+',
                    2: 'Rating: 2+',
                    1.5: 'Rating: 1.5+',
                    1: 'Rating: 1+',
                    0.5: 'Rating: 0.5+',
                    0: 'Any Rating',
                  };

                  const onPress = () => {
                    setSearchQuery((state) => {
                      state.filter[index].values.splice(valueIndex, 1);
                      if (state.filter[index].values.length < 1) {
                        state.filter.splice(index, 1);
                      }
                      commenceSearch(state);
                      return state;
                    });
                  };

                  return (
                    <TouchableOpacity
                      onPress={onPress}
                      key={value + index}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: '#b0e9ff',
                        borderWidth: 0.5,
                        borderColor: '#2cb4eb',
                        borderRadius: 20,
                        marginHorizontal: 5,
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <RText
                        style={{
                          fontSize: normalizedFontSize(6),
                          marginRight: 5,
                          color: '#363946',
                        }}>
                        {capitalizeFirstLetter(
                          name[value] ? name[value] : value,
                        )}
                      </RText>
                      <ADIcon color="#363946" name="close" size={17} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {/* selected filters */}

        <View
          style={{
            top: statusBarHeight,
            flex: 1,
            width: '100%',
          }}>
          <SearchResults
            onScroll={onScroll}
            commenceSearch={commenceSearch}
            requestLocation={requestLocation}
            tags={tags}
            categories={categories}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSearchResults={setSearchResults}
            fetchMoreSearchSellers={fetchMoreSellers}
            fetchMoreSearchProducts={fetchMoreProducts}
            toggleSortFilter={toggleSortFilter}
            viewSortFilter={viewSortFilter}
            searchResults={searchResults}
            navigation={navigation}
            searchResultsAnimation={searchResultsAnimation}
            services={services}
            defaultFilter={defaultFilter}
            showETA={showETA}
          />
        </View>
      </View>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
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
