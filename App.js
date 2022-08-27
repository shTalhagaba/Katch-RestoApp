/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/react-hooks';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import RNLocation from 'react-native-location';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import {
  GET_BOOKMARKS,
  GET_USER_ADDRESS,
  GET_USER_WALLET,
} from './components/GraphQL';
import { useDidStoreHyderate } from './components/hooks';
import { userLoc as setUserLoc } from './components/Redux/Actions/appActions';
import {
  clearBookmarks,
  clearUserAddresses,
  hydrateUserAddresses,
  hydrateUserWallet,
  setBookmarks,
} from './components/Redux/Actions/userActions';
import UpdateNotification from './containers/UpdateNotification';
//others
import { Provider as FCMessaging } from './context/notification';
import Screens from './screens';
import {Provider as GLoadingProvider} from './context/gLoading';

const App = (props) => {
  const { user, updateUserLoc } = props;
  const state = useDidStoreHyderate();

  //Location
  const getUserLocations = (doSetUserLoc = true) =>
    RNLocation.getLatestLocation().then((location) => {
      if (location && !doSetUserLoc) {
        updateUserLoc({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    });

  const requestPermissionLocation = (doSetUserLoc = true) =>
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    }).then((res) => {
      if (res && !doSetUserLoc) {
        getUserLocations(doSetUserLoc);
      } else {
        updateUserLoc(null);
      }
    });

  const [getBookmarks, { called: bookMarksCalled }] = useLazyQuery(
    GET_BOOKMARKS,
    {
      onCompleted: (data) => {
        props.setBookmarks(data.getBookMarksByUserID);
      },
    },
  );

  const [getUserAddresses, { called: userAddessesCalled }] = useLazyQuery(
    GET_USER_ADDRESS,
    {
      onCompleted: (data) => {
        props.hydrateUserAddresses(data.getUserAddresses);
      },
    },
  );

  // GET USER WALLET
  const [getUserWallet, { called: userWalletCalled }] = useLazyQuery(
    GET_USER_WALLET,
    {
      onCompleted: (data) => {
        props.hyderateUserWallet(data);
      },
      onError: () => {
        props.hyderateUserWallet({ wallet: { walletTotal: '0.000' } });
      },
    },
  );

  // SYNC selected address with userLoc
  // User change the selected Address change the userLoc

  useEffect(() => {
    if (state) {
      if (user.selectedAddress) {
        updateUserLoc({
          longitude: user.selectedAddress.location.coordinates[0],
          latitude: user.selectedAddress.location.coordinates[1],
          longitudeDelta: 0.1,
          latitudeDelta: 0.1,
        });
      }
      // IF user has no selected address checkfor permission and update the userLocation
      RNLocation.checkPermission({
        ios: 'whenInUse',
        android: {
          detail: 'fine',
        },
      }).then((permission) => {
        if (permission) {
          getUserLocations(user.selectedAddress);
        } else {
          requestPermissionLocation(user.selectedAddress);
        }
      });
    }
  }, [user.selectedAddress, state]);

  useEffect(() => {
    const listener = auth().onAuthStateChanged((authUser) => {
      if (authUser && !bookMarksCalled) {
        getBookmarks();
      } else {
        props.clearBookmarks();
      }

      if (authUser && !userAddessesCalled) {
        getUserAddresses();
      } else {
        props.clearUserAddresses();
      }

      if (authUser && !userWalletCalled) {
        getUserWallet();
      }

      if (!authUser) {
        props.hyderateUserWallet([]);
      }
    });

    return () => {
      listener();
    };
  }, []);

  return (
    <GLoadingProvider>
      <SafeAreaProvider>
        <FCMessaging>
          <NavigationContainer>
            <UpdateNotification>
              <Screens />
            </UpdateNotification>
          </NavigationContainer>
        </FCMessaging>
      </SafeAreaProvider>
    </GLoadingProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBookmarks: (bookmarks) => dispatch(setBookmarks(bookmarks)),
    clearBookmarks: () => dispatch(clearBookmarks()),
    hydrateUserAddresses: (addresses) =>
      dispatch(hydrateUserAddresses(addresses)),
    clearUserAddresses: () => dispatch(clearUserAddresses()),
    updateUserLoc: (location) => {
      dispatch(setUserLoc(location));
    },
    hyderateUserWallet: (wallet) => dispatch(hydrateUserWallet(wallet)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
