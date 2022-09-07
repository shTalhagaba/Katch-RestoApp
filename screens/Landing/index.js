// @ts-nocheck
import { useMutation,useLazyQuery,useQuery } from '@apollo/client'
import SplashScreen from 'react-native-splash-screen';

import messaging from '@react-native-firebase/messaging';
import React, {
  Component,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  AppState,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
//3rd party
import auth from '@react-native-firebase/auth';
import { logEvent } from '../../components/AppReporting';
import {
  GET_BEST_SELLING_PRODUCTS,
  GET_BEST_SELLING_STORES,
  GET_COLLECTIONS,
  GET_LANDING_CONTENT,
  GET_OPEN_STORES,
  GET_STORES_BY_DISTANCE,
  GET_STORES_BY_DISTANCE_AND_SERVICE,
} from '../../components/GraphQL';
import { capitalizeFirstLetter } from '../../components/Helpers';
import LandingGreeting from '../../components/LandingGreeting';
import { setSelectedService } from '../../components/Redux/Actions/userActions';
import { setMarketingData } from '../../components/Redux/Actions/appActions';
import SearchInput from '../../components/SearchInput';
import serviceTypes from '../../constants/serviceTypes';
import BestSellingDishList from '../../containers/BestSellingDishList';
import BestSellingRestList from '../../containers/BestSellingRestList';
import DeliveryList from '../../containers/Delivery';
import DiscoveryList from '../../containers/Discovery';
import DeepLinkListener from '../../containers/DeepLinkListener';
//others
import LandingOpenRestList from '../../containers/LandingOpenRestList';
import OrderReview from '../../containers/OrderReview';
import LandingBanner from '../../containers/LandingBanner';
import LandingReferralBanner from '../../containers/LandingBanner/referralBanner';
import ViewportNotifier from '../../containers/ViewportNotifier';
import { BoldText } from '../../GlobeStyle';
import Permissions from 'react-native-permissions';
import styles from './styles';
import CouponList from '../../containers/CouponList';
import { GET_COUPON_PAGINATED } from '../../components/GraphQL/Coupon/query';
import { ScrollView } from 'react-native-gesture-handler';
import LandingMessage from '../../components/LandingHeader';
import GiveAwayInfoModal from '../../containers/GiveAwayInfoModal';
import { NEW_ICON } from '../../assets/images';
import WalletGiveAway from '../../containers/WalletGiveAway';
import QuickSearch from '../../components/QuickSearch';
import SpecialHeader from '../../components/SpecialHeader/specialheader';

const init = (initialState) => initialState;

const reducer = (state, action) => {
  switch (action.type) {
    case 'bestSellingStores':
      return {
        ...state,
        bestSellingStores: action.payload,
      };
    case 'bestSellingProducts':
      return {
        ...state,
        bestSellingProducts: action.payload,
      };
    case 'openStores':
      return {
        ...state,
        openStores: action.payload,
      };
    case 'landingContent':
      return {
        ...state,
        landingContent: action.payload,
      };
    case 'discovery':
      return {
        ...state,
        discovery: action.payload,
      };
    case 'delivery':
      return {
        ...state,
        delivery: action.payload,
      };
    case 'coupon':
      return {
        ...state,
        couponList: action.payload,
      };
    case 'collections':
      return {
        ...state,
        collections: action.payload,
      };
    case 'reset':
      return init(action.payload);
    case 'resetServiceType':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const Landing = ({ navigation, ...props }) => {
  // eslint-disable-next-line no-shadow
  const {
    selectedService,
    setSelectedService,
    selectedAddress,
    setMarketingData,
  } = props;
  const userLoc = props.userLoc
    ? {
        latitude: props.userLoc.latitude,
        longitude: props.userLoc.longitude,
      }
    : null;
  const [notification, setNotification] = useState(null);
  const [serviceType, setServiceType] = useState([serviceTypes.pickUp]);
  const [giveAwayModal, setGiveAwayModal] = useState(null);
  const authUser = auth().currentUser;

  //notification on click listener
  useEffect(() => {
    messaging().onNotificationOpenedApp((_notification) => {
      setNotification(_notification);
    });
  }, []);

  useEffect(() => {
    if (
      selectedService &&
      selectedService == serviceTypes.coupon &&
      serviceType !== selectedService
    ) {
      setServiceType([selectedService]);
      onCouponScreen();
    }
  }, [selectedService]);

  const checkRef = useRef(true);
  useEffect(() => {
    const permissionType =
      Platform.OS === 'android'
        ? Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : Permissions.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const listener = (state) => {
      if (!checkRef.current) {
        Permissions.check(permissionType).then((permission) => {
          if (permission === 'granted') {
            checkRef.current = true;
            onDelivery();
          }
        });
      }
    };

    Permissions.check(permissionType).then((x) => {
      if (x === 'denied') {
        checkRef.current = false;
        AppState.addEventListener('change', listener);
      }
    });
    return () => AppState.removeEventListener('change', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refresh the delivery view list
  useEffect(() => {
    if (serviceType.includes(serviceTypes.delivery)) {
      onRefresh(() => {
        setRefreshing(false);
        // @ts-ignore
        scrollToTop();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddress]);

  //if notification is clicked and has a property of navigate,
  //it will navigate to the screen with what ever params you give it from the server
  useEffect(() => {
    if (
      notification &&
      notification.data.hasOwnProperty('navigate') &&
      navigation !== null
    ) {
      const navigate = JSON.parse(notification.data.navigate);
      const screen = navigate.to;
      const params = navigate.params;
      navigation.navigate(screen, params);
      setNotification(null);
    }
  }, [navigation, notification]);

  const [refreshing, setRefreshing] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [showLM, setShowLM] = useState(false);
  const [showETA, setShowETA] = useState(false);
  const scrollRef = useRef();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const initialState = {
    bestSellingStores: null,
    bestSellingProducts: null,
    openStores: null,
    landingContent: null,
    discovery: null,
    collections: null,
    couponList: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);

  const landingContent = useQuery(GET_LANDING_CONTENT, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (query) => {
      if (giveAwayModal === null) {
        setGiveAwayModal(query.getLandingContent?.referrals?.active);
      }
      setMarketingData(query.getLandingContent);
      setRamadan(query.getLandingContent?.ramadan);
      setShowLM(query.getLandingContent?.showLandingMessage);
      setShowETA(query.getLandingContent?.showETA);
      scrollToTop();
      dispatch({
        type: 'landingContent',
        payload: query.getLandingContent,
      });
      SplashScreen.hide();
    },
    onError: (error) => {
      SplashScreen.hide();
    },
  });
  const [getBestSellingStore, bestSellingStoresQuery] = useLazyQuery(
    GET_BEST_SELLING_STORES,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: { cursor: null, limit: 5, serviceTypes: serviceType },
      onCompleted: (query) => {
        dispatch({
          type: 'bestSellingStores',
          payload: query.getBestSellingStoresCursor,
        });
      },
    },
  );

  const [bestSellingProductsQuery] = useMutation(GET_BEST_SELLING_PRODUCTS, {
    notifyOnNetworkStatusChange: true,
    variables: { cursor: null, limit: 5, serviceTypes: serviceType },
    returnPartialData: true,
  });

  const [getOpenStores, openStoresQuery] = useLazyQuery(GET_OPEN_STORES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: { cursor: null, limit: 5, serviceTypes: serviceType },
    onCompleted: (query) => {
      if (!state.openStores) {
        dispatch({
          type: 'openStores',
          payload: query.getOpenStores,
        });
      }
    },
  });

  //Collection Query
  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (query) => {
      if (!state.collections) {
        dispatch({
          type: 'collections',
          payload: query.getAllCollections,
        });
      }
    },
  });

  const fetchMoreOpenStores = (callBack) => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const fetched = {
        totalOpenStores: previousResult.getOpenStores.totalOpenStores,
        data: [
          ...previousResult.getOpenStores.data,
          ...fetchMoreResult.getOpenStores.data,
        ],
        next: fetchMoreResult.getOpenStores.next,
        nextCursor: fetchMoreResult.getOpenStores.nextCursor,
      };

      dispatch({
        type: 'openStores',
        payload: fetched,
      });

      callBack();

      return { getOpenStores: fetched };
    };
    openStoresQuery.fetchMore({
      variables: {
        limit: 5,
        cursor: state.openStores.nextCursor,
        serviceTypes: serviceType,
      },
      updateQuery,
    });
  };

  const fetchMoreBestSellingStore = (nextCursor, callBack) => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const fetched = {
        data: [
          ...previousResult.getBestSellingStoresCursor.data,
          ...fetchMoreResult.getBestSellingStoresCursor.data,
        ],
        next: fetchMoreResult.getBestSellingStoresCursor.next,
        nextCursor: fetchMoreResult.getBestSellingStoresCursor.nextCursor,
      };

      dispatch({
        type: 'bestSellingStores',
        payload: fetched,
      });

      callBack(fetched);
      return { getBestSellingStoresCursor: fetched };
    };

    bestSellingStoresQuery.fetchMore({
      variables: { limit: 5, cursor: nextCursor, serviceTypes: serviceType },
      updateQuery,
    });
  };

  const fetchMoreBestSellingProducts = (callBack) => {
    bestSellingProductsQuery({
      variables: {
        limit: 5,
        cursor: state.bestSellingProducts.nextCursor,
        serviceTypes: serviceType,
      },
    }).then(({ data }) => {
      const fetched = {
        data: [
          ...state.bestSellingProducts.data,
          ...data.getBestSellingProductsCursor.data,
        ],
        next: data.getBestSellingProductsCursor.next,
        nextCursor: data.getBestSellingProductsCursor.nextCursor,
      };

      callBack(data.getBestSellingProductsCursor.data);

      dispatch({
        type: 'bestSellingProducts',
        payload: fetched,
      });
    });
  };

  const [servicesQuery, discoveryQuery] = useLazyQuery(GET_STORES_BY_DISTANCE, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: {
      options: { page: 1, limit: 5 },
      serviceTypes: [],
      location: { longitude: userLoc?.longitude, latitude: userLoc?.latitude },
    },
    onCompleted: (query) => {
      if (!state.discovery) {
        dispatch({
          type: 'discovery',
          payload: {
            data: query.getStoresByUserLocation.data,
            next: query.getStoresByUserLocation.hasNextPage,
            nextCursor: query.getStoresByUserLocation.nextPage,
          },
        });
      }
    },
  });

  const [deliveryQuery, deliveryFetchMore] = useLazyQuery(
    GET_STORES_BY_DISTANCE_AND_SERVICE,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        options: { page: 1, limit: 5 },
        serviceTypes: [serviceTypes.delivery],
        location: {
          longitude: userLoc?.longitude,
          latitude: userLoc?.latitude,
        },
      },
      onCompleted: (query) => {
        if (!state.delivery) {
          dispatch({
            type: 'delivery',
            payload: {
              data: query.getStoresByUserLocation.data,
              next: query.getStoresByUserLocation.hasNextPage,
              nextCursor: query.getStoresByUserLocation.nextPage,
            },
          });
        }
      },
    },
  );

  const fetchMoreServicesQuery = (callBack) => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const { data, ...rest } = fetchMoreResult.getStoresByUserLocation;
      const fetched = {
        data: [...previousResult.getStoresByUserLocation.data, ...data],
        ...rest,
        next: rest.hasNextPage,
        nextCursor: rest.nextPage,
      };

      dispatch({
        type: 'discovery',
        payload: fetched,
      });
      callBack();
      return { getStoresByUserLocation: fetched };
    };

    discoveryQuery.fetchMore({
      variables: {
        options: { page: state.discovery.nextCursor, limit: 5 },
        serviceTypes: serviceType,
        location: { longitude: userLoc.longitude, latitude: userLoc.latitude },
      },
      updateQuery,
    });
  };

  const fetchMoreDeliveryQuery = (callBack) => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const { data, ...rest } = fetchMoreResult.getStoresByUserLocation;
      const fetched = {
        data: [...previousResult.getStoresByUserLocation.data, ...data],
        ...rest,
        next: rest.hasNextPage,
        nextCursor: rest.nextPage,
      };

      dispatch({
        type: 'delivery',
        payload: fetched,
      });

      callBack();
      return { getStoresByUserLocation: fetched };
    };

    deliveryFetchMore.fetchMore({
      variables: {
        options: { page: state.delivery.nextCursor, limit: 5 },
        serviceTypes: [serviceTypes.delivery],
        location: { longitude: userLoc.longitude, latitude: userLoc.latitude },
      },
      updateQuery,
    });
  };
  const onRefresh = (callBack) => {
    dispatch({
      type: 'reset',
      payload: initialState,
    });

    setRefreshing(true);
    landingContent.refetch();
    if (serviceType.includes(serviceTypes.delivery)) {
      deliveryFetchMore.refetch();
    } else if (serviceType.includes(serviceTypes.pickUp)) {
      bestSellingStoresQuery.refetch();
      bestSellingProductsQuery().then(({ data }) => {
        dispatch({
          type: 'bestSellingProducts',
          payload: data.getBestSellingProductsCursor,
        });
      });
      openStoresQuery.refetch();
    } else if (serviceType?.length === 0) {
      getCollections();
      discoveryQuery.refetch();
    } else {
      couponFetchMore.refetch();
    }
    callBack();
  };

  // Set Default View To discovery
  useEffect(() => {
    setServiceType('Delivery');
    onDelivery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDiscovery = () => {
    dispatch({
      type: 'resetServiceType',
      payload: {
        bestSellingStores: null,
        bestSellingProducts: null,
        openStores: null,
        discovery: null,
        delivery: null,
      },
    });
    servicesQuery();
    getCollections();
    setSelectedService(serviceTypes.discovery);
  };

  const onDelivery = () => {
    dispatch({
      type: 'resetServiceType',
      payload: {
        bestSellingStores: null,
        bestSellingProducts: null,
        openStores: null,
        discovery: null,
        delivery: null,
      },
    });
    setSelectedService(serviceTypes.delivery);
    deliveryQuery();
  };
  /**
   * Coupons Segment Here
   */
  const [getCoupons, couponFetchMore] = useLazyQuery(GET_COUPON_PAGINATED, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: {
      couponOptions: {
        page: 1,
        limit: 5,
      },
    },
    onCompleted: (query) => {
      if (!state.couponList) {
        dispatch({
          type: 'coupon',
          payload: {
            data: query.getPaginatedCoupons.data,
            next: query.getPaginatedCoupons.hasNextPage,
            nextCursor: query.getPaginatedCoupons.nextPage,
          },
        });
      }
    },
    onError: (e) => console.log({ e }),
  });

  const fetchMoreCouponQuery = (callBack) => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const { data, ...rest } = fetchMoreResult.getPaginatedCoupons;
      const fetched = {
        data: [...previousResult.getPaginatedCoupons.data, ...data],
        ...rest,
        next: rest.hasNextPage,
        nextCursor: rest.nextPage,
      };

      dispatch({
        type: 'coupon',
        payload: fetched,
      });

      callBack();
      return { getPaginatedCoupons: fetched };
    };

    couponFetchMore.fetchMore({
      variables: {
        couponOptions: { page: state.couponList.nextCursor, limit: 5 },
      },
      updateQuery,
    });
  };

  const onCouponScreen = () => {
    dispatch({
      type: 'resetServiceType',
      payload: {
        bestSellingStores: null,
        bestSellingProducts: null,
        openStores: null,
        discovery: null,
        delivery: null,
        couponList: null,
      },
    });
    setSelectedService(serviceTypes.coupon);
    getCoupons();
  };

  const onPickup = () => {
    dispatch({
      type: 'resetServiceType',
      payload: {
        bestSellingStores: null,
        bestSellingProducts: null,
        openStores: null,
        discovery: null,
        delivery: null,
      },
    });
    setSelectedService(serviceTypes.pickUp);
    getBestSellingStore();
    bestSellingProductsQuery().then(({ data }) => {
      dispatch({
        type: 'bestSellingProducts',
        payload: data.getBestSellingProductsCursor,
      });
    });
    getOpenStores();
  };

  const referralLogin = () => {
    if (authUser) {
      navigation.navigate('Account', {
        accountContent: 'referralCode',
      });
    } else {
      navigation.navigate('Account', {
        screen: 'Login',
        accountContent: 'referralCode',
      });
    }
    setGiveAwayModal(false);
  };

  const translateY = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  const statusBarHeightAnimated =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;

  const color = translateY.interpolate({
    inputRange: [0, 100],
    outputRange: [-statusBarHeightAnimated, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (scrollRef.current) {
      navigation.setParams({
        scrollToTop: scrollToTop,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef]);

  const [ramadan, setRamadan] = useState(false);

  return (
    <>
      <DeepLinkListener navigation={navigation}>
        <View style={[styles.container, { paddingTop: statusBarHeight }]}>
          <Animated.View
            style={[
              styles.animatedView,
              {
                height: statusBarHeightAnimated,
                transform: [{ translateY: color }],
              },
            ]}
          />
          <StatusBar
            translucent={true}
            animated={true}
            backgroundColor={ramadan ? '#ffffff80' : '#ffffff00'}
          />

          <View style={styles.mainContainer}>
            <AnimatedViewport
              scrollRef={scrollRef}
              translateY={translateY}
              style={styles.viewport}
              scrollEventThrottle={16}
              contentContainerStyle={styles.fg1}
              stickyHeaderIndices={[ramadan ? 1 : showLM ? 3 : 2]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() =>
                    onRefresh(() => {
                      setRefreshing(false);
                      scrollToTop();
                    })
                  }
                />
              }>
              {ramadan && (
                <SpecialHeader
                  navigation={navigation}
                  statusBarHeight={statusBarHeight}
                />
              )}
              {!ramadan && <LandingGreeting navigation={navigation} />}
              {!ramadan && showLM && (
                <LandingMessage data={state.landingContent} />
              )}
              <SearchInput
                navigation={navigation}
                containerStyle={styles.padding10}
                inputValue={searchString}
                onChangeText={setSearchString}
                onKeyPress={() => {
                  if (searchString !== '') {
                    logEvent('search', {
                      from: 'Landing Screen',
                      searched: capitalizeFirstLetter(searchString.trim()),
                    });
                    navigation.navigate('Search', {
                      searchString: capitalizeFirstLetter(searchString.trim()),
                    });
                    navigation.setParams({
                      searchString: capitalizeFirstLetter(searchString.trim()),
                    });
                    setSearchString('');
                  }
                }}
              />
              <ServicesButton
                translateY={translateY}
                scrollToTop={scrollToTop}
                serviceType={serviceType}
                setServiceType={setServiceType}
                onDiscovery={onDiscovery}
                onPickup={onPickup}
                onDelivery={onDelivery}
                onCouponScreen={onCouponScreen}
              />
              <View style={styles.contentContainer}>
                {/* ^ Search and landing message */}

                {/***********************/}

                <LandingBanner
                  isLoading={!!state.landingContent?.offersBanner}
                  navigation={navigation}
                />

                <QuickSearch navigation={navigation} />

                {/* ^ short List of categories */}

                {serviceType.includes(serviceTypes.pickUp) && (
                  <>
                    {/***********************/}
                    <BestSellingRestList
                      stores={state.bestSellingStores}
                      fetchMore={fetchMoreBestSellingStore}
                    />
                    {/* ^  */}

                    {/***********************/}
                    <BestSellingDishList
                      products={state.bestSellingProducts}
                      fetchMore={fetchMoreBestSellingProducts}
                    />
                    {/* ^  */}

                    {/***********************/}
                    {/* <TagList
                      navigation={navigation}
                      data={state.landingContent?.quickFilters}
                    /> */}

                    {/* ^ short List of categories */}

                    {/***********************/}
                    <LandingOpenRestList
                      fetchMoreOpenStores={fetchMoreOpenStores}
                      openStores={state.openStores}
                      dispatch={dispatch}
                    />
                  </>
                )}
                {serviceType.length === 0 && (
                  <DiscoveryList
                    list={state.discovery}
                    showETA={showETA}
                    fetchMoreServicesQuery={fetchMoreServicesQuery}
                    collections={state.collections}
                  />
                )}
                {serviceType.includes(serviceTypes.delivery) && (
                  <DeliveryList
                    list={state.delivery}
                    showETA={showETA}
                    fetchMoreServicesQuery={fetchMoreDeliveryQuery}
                    collections={state.collections}
                  />
                )}

                {serviceType.includes(serviceTypes.coupon) && (
                  <CouponList
                    list={state.couponList}
                    fetchMoreServicesQuery={fetchMoreCouponQuery}
                  />
                )}

                {/* ^ open restaurants near by */}
              </View>
            </AnimatedViewport>

            <GiveAwayInfoModal
              isLoggedIn={authUser}
              referralLogin={referralLogin}
              setGiveAwayModal={setGiveAwayModal}
              giveAwayModal={giveAwayModal}
            />
            <OrderReview />
          </View>
        </View>
      </DeepLinkListener>
      <WalletGiveAway />
    </>
  );
};

const ServicesButton = (props) => {
  const {
    setServiceType,
    serviceType,
    onPickup,
    onDiscovery,
    onDelivery,
    onCouponScreen,
    scrollToTop,
    translateY,
  } = props;
  const pickUpClicked = serviceType.includes(serviceTypes.pickUp);
  const deliveryClicked = serviceType.includes(serviceTypes.delivery);
  const couponClicked = serviceType.includes(serviceTypes.coupon);
  const discoverClicked = serviceType.length === 0;
  const borderRadius = translateY.interpolate({
    inputRange: [0, 100],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });

  const services = [
    {
      service: 'Delivery',
      actions: {
        setServiceType: () => setServiceType([serviceTypes.delivery]),
        onAction: () => onDelivery(),
      },
      clickStatus: deliveryClicked,
    },
    {
      service: 'Pickup',
      actions: {
        setServiceType: () => setServiceType([serviceTypes.pickUp]),
        onAction: () => onPickup(),
      },
      clickStatus: pickUpClicked,
    },
    {
      service: 'Combo Deals',
      actions: {
        setServiceType: () => setServiceType([serviceTypes.coupon]),
        onAction: () => onCouponScreen(),
      },
      clickStatus: couponClicked,
    },
    {
      service: 'Discover',
      actions: {
        setServiceType: () => setServiceType([]),
        onAction: () => onDiscovery(),
      },
      clickStatus: discoverClicked,
    },
  ];

  return (
    <Animated.View
      style={[
        styles.serviceButtonContainer,
        {
          borderTopRightRadius: borderRadius,
          borderTopLeftRadius: borderRadius,
        },
      ]}>
      <ScrollView
        horizontal
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {services.map((service, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              scrollToTop();
              service.actions.setServiceType();
              service.actions.onAction();
            }}
            style={styles.wrapper}>
            <View
              style={[
                styles.serviceButton,
                service.clickStatus
                  ? styles.activeServiceButton
                  : styles.inactiveServiceButton,
              ]}>
              <BoldText
                style={
                  service.clickStatus
                    ? styles.activeServiceButton
                    : styles.inactiveServiceButton
                }>
                {service.service}
              </BoldText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
    userData: state.user,
    selectedAddress: state.user.selectedAddress,
    selectedService: state.user.selectedService,
  };
};

class AnimatedScrollView extends Component {
  state = {
    viewportWidth: 0,
    viewportHeight: 0,
    shouldMeasureLayout: true,
  };

  render() {
    const { translateY, children, scrollRef, ...props } = this.props;

    return (
      <Animated.ScrollView
        {...props}
        onLayout={(event) => {
          this.props._onViewportChange({
            viewportWidth: event.nativeEvent.layout.width,
            viewportHeight: event.nativeEvent.layout.height,
            viewportOffsetX: 0,
            viewportOffsetY: 0,
            shouldMeasureLayout: true,
          });

          this.setState({
            viewportWidth: event.nativeEvent.layout.width,
            viewportHeight: event.nativeEvent.layout.height,
            shouldMeasureLayout: true,
          });
        }}
        ref={scrollRef}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: translateY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
            listener: ({ nativeEvent: { contentOffset } }) => {
              this.props._onViewportChange({
                viewportWidth: this.state.viewportWidth,
                viewportHeight: this.state.viewportHeight,
                viewportOffsetX: contentOffset.x,
                viewportOffsetY: contentOffset.y,
                shouldMeasureLayout: this.state.shouldMeasureLayout,
              });
            },
          },
        )}>
        {children}
      </Animated.ScrollView>
    );
  }
}

class AnimatedViewport extends Component {
  render() {
    return (
      <ViewportNotifier>
        <AnimatedScrollView {...this.props} />
      </ViewportNotifier>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedService: (service) => dispatch(setSelectedService(service)),
    setMarketingData: (data) => {
      dispatch(setMarketingData(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
