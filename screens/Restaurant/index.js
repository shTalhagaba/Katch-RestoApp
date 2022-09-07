//react
import React, {useState, useContext} from 'react';
import {StatusBar} from 'react-native';
//3rd party
import { useQuery } from '@apollo/client'

//others
import MainScreen from './MainScreen';
import DishOptions from '../../containers/DishOptions';
import {GET_STORE, GET_PROMO_CODES} from '../../components/GraphQL';
import CartCustomization from '../../containers/CartCustomization';
import {Context} from '../../context/restaurant';
import {Provider as CartProvider} from '../../context/cart';

import GoToCartButton from './MainScreen/GoToCart';

const Restaurant = ({navigation, route, ...props}) => {
  const context = useContext(Context);
  const {
    storeInfo,
    productList,
    cartItems,
    promoCodes,
    headersIndex,
    menu
  } = context.state;

  const {
    getItem,
    onRefresh,
    setCartItems
  } = context.actions;

  const [goToCartVisible, setGoToCartVisible] = useState(false);
  return (
    <>
      <StatusBar
        translucent={true}
        showHideTransition="slide"
        backgroundColor="#00000000"
      />
      {storeInfo ? (
        <>
          <CartProvider getItem={getItem}>
            <MainScreen
              {...props}
              menu={menu}
              promoCodes={promoCodes}
              headersIndex={headersIndex}
              productList={productList}
              navigation={navigation}
              route={route}
              storeInfo={storeInfo}
              refresh={onRefresh}
              setCartItems={setCartItems}
              goToCartVisible={goToCartVisible}
            />

            <DishOptions
              navigation={navigation}
              shopName={storeInfo.shopName}
              shopId={storeInfo._id}
              storeInfo={storeInfo}
            />

            <CartCustomization
              navigation={navigation}
              cartItems={cartItems}
              getItem={getItem}
            />
          </CartProvider>
          <GoToCartButton
            shopName={storeInfo.shopName}
            setGoToCartVisible={setGoToCartVisible}
          />
        </>
      ) : null}
    </>
  );
};

export default Restaurant;
