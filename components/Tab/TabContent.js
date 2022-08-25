import React, { useState } from 'react';
import { Text, SafeAreaView, Image, View } from 'react-native';
import Icon from '../../components/Icon';
import { connect } from 'react-redux';
import GS from '../../GlobeStyle';
import IconBadge from 'react-native-icon-badge';

import { TabBar, TabTouchable } from './style';
import LandingOrder from '../../containers/LandingOrder';

import {
  HOME,
  PROFILE,
  PROFILE_SELECTED,
  CART,
  CART_SELECTED,
  SEARCH_TAB,
  SEARCH_SELECTED,
  LOCATION,
  LOCATION_SELECTED,
} from '../../assets/images';
import { TextBasic } from '../../GlobeStyle';

const TabPng = [LOCATION, SEARCH_TAB, HOME, CART, PROFILE];
const TabPngSelected = [
  LOCATION_SELECTED,
  SEARCH_SELECTED,
  HOME,
  CART_SELECTED,
  PROFILE_SELECTED,
];

const TabContent = (props) => {
  const {
    state,
    descriptors,
    navigation,
    items,
    selectedService,
    couponsItems,
  } = props;
  const [isHomeFocused, setIsHomeFocused] = useState(true);

  const [Map, Search, Home, Cart, Account] = state.routes;

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const content = [Map, Search, Home, Cart, Account].map((route, index) => {
    const { options } = descriptors[route.key];

    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;
    const ImageSrc = isFocused ? TabPngSelected[index] : TabPng[index];

    if (index === 2 && isFocused !== isHomeFocused) {
      setIsHomeFocused(isFocused);
    }
    const isCenter = label === 'Home';

    const onPress = () => {
      // setGlobalError(undefined); //Remove any errors currently shown
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }

      if (isFocused && isCenter) {
        if (Home.params.scrollToTop) {
          Home.params.scrollToTop();
        }
      }
    };

    const iconStyle = isCenter
      ? {
          position: 'absolute',
          top: -5,
          backgroundColor: GS.primaryColor,
          padding: 8,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: isFocused ? GS.secondaryColor : '#D9F7D9',
        }
      : {};

    return (
      <TabTouchable
        key={`${route.name}${index}`}
        disabled={isFocused && !isCenter}
        onPress={onPress}>
        {!isCenter && (
          <View
            style={{
              height: 3,
              width: '100%',
              backgroundColor: isFocused ? '#fb4629' : '#ffffff00',
              marginBottom: 15,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
            }}
          />
        )}
        <View style={[iconStyle, {}]}>
          <IconBadge
            MainElement={
              <Icon
                source={ImageSrc}
                style={{
                  height: isCenter ? 45 : label === 'Cart' ? 34 : 30,
                  width: isCenter ? 45 : label === 'Cart' ? 34 : 30,
                  resizeMode: 'contain',
                  top: isCenter ? 3 : -5,
                  // backgroundColor: 'red'
                }}
              />
            }
            BadgeElement={
              <TextBasic
                style={{
                  color: '#fff',
                  fontSize: 10,
                }}>
                {items.length || couponsItems.length}
              </TextBasic>
            }
            IconBadgeStyle={{
              minWidth: 20,
              minHeight: 20,
              backgroundColor: '#00acff',
              color: '#fff',
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: -8,
              right: -7,
            }}
            Hidden={
              label !== 'Cart' ||
              (items.length <= 0 && couponsItems.length == 0)
            }
          />
        </View>
      </TabTouchable>
    );
  });

  return (
    <>
      {selectedService ? (
        <LandingOrder navigation={navigation} isHomeFocused={isHomeFocused} />
      ) : null}
      <TabBar>{content}</TabBar>
      <SafeAreaView style={{ backgroundColor: GS.primaryColor }} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    items: state.cart.addedItems,
    couponsItems: state.couponCart.coupons,
    selectedService: state.user.selectedService,
  };
};

export default connect(mapStateToProps)(TabContent);
