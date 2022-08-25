//react
import React, { useRef, useContext } from 'react';
import { Platform, View, Animated, RefreshControl } from 'react-native';

import { Context } from '../../context/restaurant';
import RestHeader from '../Restaurant/MainScreen/Header';
import OrderPickUp from './OrderPickUp';
import RestaurantHeader from './RestaurantHeader';
import AddOptions from './AddOptions';
import OrderDelivery from './OrderDelivery';
import Address from './Address';
import MapLocation from './Map';
import ReviewHighlights from './ReviewHighlights';
import Details from './Details';
import PromoList from '../../containers/RestPromoList';
//3rd party
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//others
import style from './style';
import SocialMedia from './SocialMedia';
import SimilarStore from '../../components/SimilarStore';
import serviceTypes from '../../constants/serviceTypes';

const RestaurantInfo = (props) => {
  const { navigation } = props;

  const context = useContext(Context);
  const { storeInfo, promoCodes } = context.state;

  const translateY = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  const opacity = translateY.interpolate({
    inputRange: [0, 171],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const opacity2 = translateY.interpolate({
    inputRange: [0, 171],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  let headerSpace = translateY.interpolate({
    inputRange: [171, 342],
    outputRange: [0, statusBarHeight],
    extrapolate: 'clamp',
  });

  const doesHaveProperDeliveryService = () => {
    return storeInfo?.services?.includes(serviceTypes.delivery);
  };

  return (
    <View style={[style.safeAreaStyle]}>
      <Animated.View
        style={[
          style.animatedContainer,
          { opacity: opacity2 },
          { height: statusBarHeight },
        ]}
      />
      <Animated.View
        style={[
          style.animatedContainer2,
          { opacity: opacity },
          { height: statusBarHeight },
        ]}
      />

      <RestHeader
        headerSpace={headerSpace}
        storeInfo={storeInfo}
        opacity={opacity}
        navigation={navigation}
      />

      {storeInfo && (
        <Animated.ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={context.actions.onRefresh}
              refreshing={undefined}
            />
          }
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: translateY } },
              },
            ],
            { useNativeDriver: true },
          )}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.contentContainerStyle}>
          <RestaurantHeader storeInfo={storeInfo} style={style} />
          <OrderPickUp
            onOrderClick={() =>
              navigation.navigate('Menu', { id: storeInfo._id })
            }
          />
          <PromoList
            showNotUseable={false}
            promoCodes={promoCodes}
            showCode={false}
          />
          <AddOptions
            _id={storeInfo._id}
            comingSoon={storeInfo.comingSoon}
            navigation={navigation}
            style={style}
          />
          {doesHaveProperDeliveryService() && (
            <OrderDelivery navigation={navigation} style={style} />
          )}
          <SocialMedia socialMedia={storeInfo.socialMedia} />
          <Address
            address={storeInfo.address}
            style={style}
            location={storeInfo.location}
            storeName={storeInfo.shopName}
          />
          <MapLocation location={storeInfo.location} />
          {storeInfo.userCustomTags.length > 0 && (
            <ReviewHighlights
              style={style}
              tags={storeInfo.userCustomTags}
              storeId={storeInfo._id}
              navigation={navigation}
            />
          )}
          <Details
            style={style}
            categories={storeInfo.category}
            estimatedCost={storeInfo.estimatedCost}
            paymentMethods={storeInfo.paymentMethods}
            tags={storeInfo.tags}
          />
          <SimilarStore storeId={storeInfo._id} />
        </Animated.ScrollView>
      )}
    </View>
  );
};

export default RestaurantInfo;
