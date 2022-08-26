//react
import React, { useEffect } from 'react';
//3rd party
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//others
import Home from '../../screens/Restaurant';
import RestaurantReviews from '../../screens/RestaurantReviews';
import UpdateReview from '../../screens/RestaurantReviews/ReviewFormUpdate';
import RestaurantInfo from '../../screens/RestaurantInfo';
import RestaurantGallery from '../../screens/RestaurantGallery';
import CreateReview from '../../screens/RestaurantReviews/ReviewFormCreate';
import TabContent from './CustomTabs';
import withContext, {
  Provider as RestaurantProvider,
} from '../../context/restaurant';
import DeliveryView from '../../screens/DeliveryView';

const { Navigator, Screen } = createBottomTabNavigator();

const RestaurantNav = withContext((props) => {
  const { navigation: parentTabNavigation } = props;
  const { getStore } = props.context.actions;
  const parentTabRouteParams = props.route.params;

  useEffect(() => {
    getStore({
      variables: { id: parentTabRouteParams.id },
    });
  }, []);

  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabContent {...props} />}
      initialRouteName="Menu">
      <Screen
        name="Info"
        options={{
          tabBarLabel: 'Overview',
        }}
        initialParams={{ ...parentTabRouteParams }}
        component={RestaurantInfo}
      />

      <Screen
        name="Menu"
        options={{
          tabBarLabel: 'Menu',
        }}
        initialParams={{ ...parentTabRouteParams }}
        component={Home}
      />

      <Screen
        initialParams={{ ...parentTabRouteParams }}
        name="Gallery"
        options={{
          tabBarLabel: 'Photos',
        }}
        component={RestaurantGallery}
      />

      <Screen
        initialParams={{ ...parentTabRouteParams }}
        name="AllReviews"
        options={{
          tabBarLabel: 'Reviews',
        }}>
        {(props) => (
          <RestaurantReviews
            {...props}
            parentTabNavigation={parentTabNavigation}
          />
        )}
      </Screen>

      <Screen
        initialParams={{ ...parentTabRouteParams }}
        name="Add Review"
        options={{ unmountOnBlur: true }}
        component={CreateReview}
      />
      <Screen
        initialParams={{ ...parentTabRouteParams }}
        name="Update Review"
        options={{ unmountOnBlur: true }}
        component={UpdateReview}
      />
      <Screen
        initialParams={{ ...parentTabRouteParams }}
        name="Order Food Delivery"
        component={DeliveryView}
      />
    </Navigator>
  );
});

export const Restaurant = (props) => {
  return (
    <RestaurantProvider {...props}>
      <RestaurantNav {...props} />
    </RestaurantProvider>
  );
};
