//react
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View,BackHandler, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Menu, { MenuButton } from '../../../containers/Menu';
import ProductsList from '../../../containers/RestProductList';
import SearchProduct, {
  SearchProductButton,
} from '../../../containers/SearchProduct';
//others
import RestHeader from './Header';
import style from './stylesheet';

const Rest = (props) => {
  const {
    setCartItems,
    storeInfo,
    refresh,
    productList,
    headersIndex,
    navigation,
    route,
    menu,
    promoCodes,
    goToCartVisible,
  } = props;

  const translateY = useRef(new Animated.Value(0)).current;

  const [showMenu, setShowMenu] = useState(false);
  const [showSearchProductModal, setShowSearchProductModal] = useState(false);

  const onBack = () => {
    navigation.navigate('Search');  
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, []);


  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  let headerTransition = translateY.interpolate({
    inputRange: [171, 342],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  let menuTransformY = translateY.interpolate({
    inputRange: [171, 342],
    outputRange: [0, 0],
    extrapolate: 'clamp',
  });

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
    outputRange: [-statusBarHeight, statusBarHeight],
    extrapolate: 'clamp',
  });
  // let headerTransition = translateY.interpolate({
  //   inputRange: [110, 172],
  //   outputRange: [2 , 2],
  //   extrapolate: 'clamp',

  //   // inputRange: [100, 371],
  //   // outputRange: [statusBarHeight, 1],
  //   // extrapolate: 'clamp',
  // });

  // let menuTransformY = translateY.interpolate({
  //   inputRange:  [100, 172],
  //   outputRange: [2,  1],
  //   extrapolate: 'clamp',
  // });

  // const opacity = translateY.interpolate({
  //   inputRange: [0, 171],
  //   outputRange: [0, 1],
  //   extrapolate: 'clamp',
  // });

  // const opacity2 = translateY.interpolate({
  //   inputRange: [0, 171],
  //   outputRange: [1, 0],
  //   extrapolate: 'clamp',
  // });

  // let headerSpace = translateY.interpolate({
  // inputRange:  [0, 72],
  //   outputRange: [statusBarHeight - 23, statusBarHeight - 8],
  //   extrapolate: 'clamp',

  //   // inputRange:  [0, 72],
  //   // outputRange: [statusBarHeight -3, statusBarHeight - 25],
  //   // extrapolate: 'clamp',
  // });

  return (
    <View style={style.menuContainer}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: statusBarHeight,
          backgroundColor: '#ffffff80',
          zIndex: 10,
          opacity: opacity2,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: statusBarHeight,
          backgroundColor: '#ffffff',
          zIndex: 10,
          opacity: opacity,
        }}
      />

      {/*
          this is not the actually header, this header is the animation
          header when user scrolls down or up, the other header with rest info and image is in containers folder called RestHeader
         */}
          {/* <RestHeader
          storeInfo={storeInfo}
          headerSpace={headerSpace}
          opacity={opacity}
          navigation={navigation}
        /> */}
        {storeInfo ? (
      <RestHeader
        headerSpace={headerSpace}
        opacity={headerTransition}
        navigation={navigation}
        storeInfo={storeInfo}
      />)
      : null }
      <ProductsList
        promoCodes={promoCodes}
        navigation={navigation}
        route={route}
        headersIndex={headersIndex}
        refresh={refresh}
        productList={productList}
        storeInfo={storeInfo} 
        translateY={translateY}
        setCartItems={setCartItems}
      />

      {!storeInfo.comingSoon && (
        <MenuButton
          menuTransformY={menuTransformY}
          setShowMenu={setShowMenu}
          showMenu={showMenu}
          goToCartVisible={goToCartVisible}
        />
      )}

      {showMenu && (
        <Menu
          menuTransformY={menuTransformY}
          menu={menu}
          setShowMenu={setShowMenu}
          showMenu={showMenu}
        />
      )}
      <SearchProductButton
        showSearchProductModal={showSearchProductModal}
        setShowSearchProductModal={setShowSearchProductModal}
        goToCartVisible={goToCartVisible}
      />
      <SearchProduct
        showSearchProductModal={showSearchProductModal}
        setShowSearchProductModal={setShowSearchProductModal}
        productList={productList}
        translateY={translateY}
        storeInfo={storeInfo}
        setCartItems={setCartItems}
        navigation={navigation}
        route={route}
      />
    </View>
  );
};

export default Rest;
