import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import Landing from './Landing';
import Search from './Search';
import Cart from './Cart';
import Auth from './Auth';
import Orders from './Orders';
import OrderSummary from './OrderSummary';

import Promos from './Promos';
import Collections from './Collections';
import TabNavigator, { TabScreen } from '../components/Tab/';
import MFWebView from './MFWebView';
import GS from '../GlobeStyle';
import Map from './Map';
import { Restaurant } from '../Navigation';
import CheckOut from './checkout';
import CouponCheckOut from './couponCheckout';
import ErrorBoundary from '../containers/EB';
import CouponsView from './Coupons';
import UserCouponsView from './UserCoupon';
import UserCouponDetail from './UserCouponDetail';
import CartRouter from '../containers/CartRouter';
import ProductList from './ProductList';

const Screens = (props) => {
  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={GS.primaryColor}
          translucent={true}
        />

        <TabNavigator initialRouteName="Home">
          <TabScreen
            name="Map"
            initialParams={{ searchString: '' }}
            options={{ unmountOnBlur: false, tabBarVisible: true }}>
            {(map) => (
              <ErrorBoundary screenName="Map">
                <Map {...map} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen
            name="Search"
            initialParams={{ searchString: '' }}
            options={{ tabBarVisible: true }}>
            {(search) => (
              <ErrorBoundary screenName="Search">
                <Search {...search} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Home">
            {(landing) => (
              <ErrorBoundary screenName="Home">
                <Landing {...landing} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Cart" options={{ tabBarVisible: false }}>
            {(cart) => (
              <ErrorBoundary screenName="Cart">
                <CartRouter {...cart} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Account" options={{ unmountOnBlur: true }}>
            {(auth) => (
              <ErrorBoundary screenName="Account">
                <Auth {...auth} />
              </ErrorBoundary>
            )}
          </TabScreen>

          {/* here on wards, screens are not included in bottom tab */}

          <TabScreen name="Rest" options={{ unmountOnBlur: true, tabBarVisible: false }}>
            {(restaurant) => (
              <ErrorBoundary screenName="Restaurant">
                <Restaurant {...restaurant} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Checkout" options={{ tabBarVisible: false }}>
            {(checkout) => (
              <ErrorBoundary screenName="Checkout">
                <CheckOut {...checkout} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="CouponCheckout" options={{ tabBarVisible: false }}>
            {(checkout) => (
              <ErrorBoundary screenName="CouponCheckout">
                <CouponCheckOut {...checkout} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen
            name="MFWebView"
            options={{
              ...MFWebView.navigationOptions,
              unmountOnBlur: true,
              tabBarVisible: false,
            }}>
            {(mFWebView) => (
              <ErrorBoundary screenName="MFWebView">
                <MFWebView {...mFWebView} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Orders" options={{ unmountOnBlur: true }}>
            {(orders) => (
              <ErrorBoundary screenName="Orders">
                <Orders {...orders} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen
            name="OrderSummary"
            options={{ unmountOnBlur: true, tabBarVisible: false }}>
            {(orderSummary) => (
              <ErrorBoundary screenName="OrderSummary">
                <OrderSummary {...orderSummary} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Promos" options={{ unmountOnBlur: true }}>
            {(promos) => (
              <ErrorBoundary screenName="OrderSummary">
                <Promos {...promos} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="Collections" options={{ unmountOnBlur: true }}>
            {(collections) => (
              <ErrorBoundary screenName="Collections">
                <Collections {...collections} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="CouponDetail" options={{ unmountOnBlur: true, tabBarVisible: false }}>
            {(coupondetails) => (
              <ErrorBoundary screenName="Coupondetails">
                <CouponsView {...coupondetails} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="UserCoupons" options={{ unmountOnBlur: true }}>
            {(coupondetails) => (
              <ErrorBoundary screenName="UserCoupons">
                <UserCouponsView {...coupondetails} />
              </ErrorBoundary>
            )}
          </TabScreen>
          <TabScreen name="UserCouponDetail" options={{ unmountOnBlur: true }}>
            {(coupondetails) => (
              <ErrorBoundary screenName="UserCouponsDetails">
                <UserCouponDetail {...coupondetails} />
              </ErrorBoundary>
            )}
          </TabScreen>

          <TabScreen name="ProductList" options={{ unmountOnBlur: false }}>
            {(productList) => (
              <ErrorBoundary screenName="ProductList">
                <ProductList {...productList} />
              </ErrorBoundary>
            )}
          </TabScreen>
        </TabNavigator>
      </View>
    </>
  );
};

export default Screens;
