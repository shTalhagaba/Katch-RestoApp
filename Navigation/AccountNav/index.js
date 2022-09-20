//react
import React from 'react';

//3rd party
import { createStackNavigator } from '@react-navigation/stack';

//others
import Home from '../../screens/Account';
import BookMarks from '../../screens/BookMarks';
import UserReviews from '../../screens/UserReviews';
import UpdateReview from '../../screens/RestaurantReviews/ReviewFormUpdate';
import UserAddress from '../../screens/UserAddress';
import AddUserAddress from '../../screens/AddUserAddress';
import Wallet from '../../screens/Wallet';
import ErrorBoundary from '../../containers/EB';
import CouponsView from '../../screens/Coupons';
import UserCouponsView from '../../screens/UserCoupon';

const { Navigator, Screen } = createStackNavigator();

export const Account = (props) => {
  const tabProps = props;
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Screen name="Home">
        {(props) => (
          <ErrorBoundary screenName="Account_Home">
            <Home {...props} tabProps={tabProps} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen
        name="Bookmarks"
        options={{
          unmountOnBlur: true,
        }}>
        {(props) => (
          <ErrorBoundary screenName="Account_Bookmarks">
            <BookMarks {...props} tabProps={tabProps} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen
        name="UserReviews"
        options={{
          unmountOnBlur: true,
        }}>
        {(props) => (
          <ErrorBoundary screenName="Account_UserReview">
            <UserReviews {...props} tabProps={tabProps} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen name="UpdateReview">
        {(props) => (
          <ErrorBoundary screenName="Account_UpdateReview">
            <UpdateReview {...props} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen name="UserAddress">
        {(props) => (
          <ErrorBoundary screenName="Account_UserAddress">
            <UserAddress {...props} tabProps={tabProps} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen name="AddUserAddress">
        {(props) => (
          <ErrorBoundary screenName="Account_AddUserAddress">
            <AddUserAddress {...props} tabProps={tabProps} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen name="Wallet">
        {(props) => (
          <ErrorBoundary screenName="Account_Wallet">
            <Wallet {...props} />
          </ErrorBoundary>
        )}
      </Screen>
      <Screen name="UserCoupons" options={{headerShown: false }}>
            {(coupondetails) => (
              <ErrorBoundary screenName="UserCoupons">
                <UserCouponsView {...coupondetails} />
              </ErrorBoundary>
            )}
      </Screen>
    </Navigator>
  );
};
