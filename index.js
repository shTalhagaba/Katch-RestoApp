import { onError } from '@apollo/client/link/error';
// import { ApolloProvider } from '@apollo/react-hooks';
import NetInfo from '@react-native-community/netinfo';
//3rd party
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
// import {  split } from 'apollo-boost';
// import { InMemoryCache } from 'apollo-cache-inmemory';
import { split,ApolloLink,HttpLink ,ApolloProvider,ApolloClient,InMemoryCache,} from '@apollo/client';
// import {  InMemoryCache } from '@apollo/client/cache';
// import { ApolloClient } from '@apollo/client/core';
// import { setContext } from 'apollo-link-context';
// import { setContext } from '@apollo/link-context';
import { setContext } from "@apollo/client/link/context";
// import { HttpLink } from 'apollo-link-http';
// import { WebSocketLink } from 'apollo-link-ws';
import { WebSocketLink } from '@apollo/link-ws';
// import { WebSocketLink} from '@apollo/client/link/ws'
// import { getMainDefinition } from 'apollo-utilities';
import { getMainDefinition } from '@apollo/client/utilities';
//react
import React, { useEffect, useState } from 'react';
import { AppRegistry, Platform, UIManager } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import {
  BASE_URL_LOCAL,
  WS_URL_LOCAL,
  BASE_URL,
  WS_URL,
} from 'react-native-dotenv';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import RNLocation from 'react-native-location';
//others
import Orientation from 'react-native-orientation';
import VersionCheck from 'react-native-version-check';
import { Provider, useStore } from 'react-redux';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import App from './App';
import { name as appName } from './app.json';
import { LogError, LogJsError } from './components/AppReporting';
import StoreConfig from './components/Redux/configureStore';
import NoNetwork from './containers/NoNetwork';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

if (!__DEV__) {
  const jsExceptionHandler = async (error, isFatal) => {
    await LogJsError(new Error(JSON.stringify({ isFatal, error })));
  };

  setJSExceptionHandler(jsExceptionHandler, true);

  const nativeExceptionHandler = async (exceptionString) => {
    await LogError(exceptionString);
  };

  setNativeExceptionHandler(nativeExceptionHandler);
} else {
  import('./config/reactotron').then(() =>
    // eslint-disable-next-line no-console
    console.log('Reactotron Configured'),
  );
}

const getURL = (dev = __DEV__) => {
  switch (dev) {
    case true:
      // eslint-disable-next-line no-console
      console.log('STARTING LOCAL ENV PARAMS FOR DEVELOPMENT ', {
        httpUrl: BASE_URL_LOCAL,
        wsUrl: WS_URL_LOCAL,
      });
      return {
        httpUrl: BASE_URL_LOCAL,
        wsUrl: WS_URL_LOCAL,
      };
    default:
      return {
        httpUrl: BASE_URL,
        wsUrl: WS_URL,
      };
  }
};
const AppHOC = () => {
  const [connected, setConnected] = useState(true);
  const store = useStore();

  const { httpUrl, wsUrl } = getURL();

  const subscriptionClient = new SubscriptionClient(wsUrl, {
    lazy: false,
    reconnect: true,
    connectionParams: async () => {
      const token = (await auth()?.currentUser?.getIdToken()) || null; //
      return {
        authorization: token,
      };
    },
  });
  const getSubscriptionLink = () => {
    return new WebSocketLink(subscriptionClient);
  };

  const httpLink = new HttpLink({ uri: httpUrl, credentials: 'same-origin' });
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      const errors = graphQLErrors.map(({ message, locations, path }) => {
        return `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations,
        )}, Path: ${path}`;
      });

      if (!__DEV__) {
        const err = new Error(
          JSON.stringify({ isFatal: false, error: errors }),
        );
        LogJsError(err);
      } else {
        // eslint-disable-next-line no-console
        console.log('errorLink -> graphQLErrors', errors);
      }
    }

    if (networkError && !__DEV__) {
      const err = new Error(
        JSON.stringify({
          isFatal: false,
          error: `[Network error]: ${networkError}`,
        }),
      );
      LogJsError(err);
    } else if (networkError) {
      // eslint-disable-next-line no-console
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const getUserLocFromProps = () => {
    let location = null;
    const _props = getLocationAndServiceFromProps();
    if (_props.selectedLocation) {
      location = [
        _props.selectedLocation.coordinates[0],
        _props.selectedLocation.coordinates[1],
      ];
    } else if (_props.userLoc) {
      location = [_props.userLoc.longitude, _props.userLoc.latitude];
    }
    return JSON.stringify(location);
  };

  const createSplitLink = () => {
    return split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      getSubscriptionLink(),
      // @ts-ignore
      ApolloLink.from([errorLink, httpLink]),
    );
  };

  const getLocationAndServiceFromProps = () => {
    const state = store.getState();
    const selectedAddress = state.user.selectedAddress?.location;
    const selectedService = state.user.selectedService;
    return {
      userLoc: state.app.userLoc,
      selectedLocation: selectedAddress,
      selectedService: selectedService,
    };
  };

  const requestMiddleware = () => {
    return setContext(async (_, { headers }) => {
      const appVersion = VersionCheck.getCurrentVersion();
      const token = auth().currentUser
        ? await auth().currentUser.getIdToken()
        : null;

      const deviceId = deviceInfoModule.getUniqueId();
      const customHeader = {
        headers: {
          ...headers,
          'X-DEVICE-ID': deviceId,
          'X-APP-VERSION': appVersion,
          'X-USER-LOC': getUserLocFromProps(),
          'X-SELECTED-SERVICE':
            getLocationAndServiceFromProps().selectedService,
          authorization: token,
        },
      };
      return customHeader;
    });
  };

  useEffect(() => {
    const listner = auth().onAuthStateChanged((authUser) => {
      if (!authUser) {
        subscriptionClient.close();
      }
    });
    return () => {
      listner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createApolloClient = () => {
    const middleware = requestMiddleware();
    const splitLink = createSplitLink();
    return new ApolloClient({
      link: middleware.concat(splitLink),
      cache: new InMemoryCache({ addTypename: false }),
    });
  };

  useEffect(() => {
    RNLocation.configure({
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
      interval: 1000,
      maxWaitTime: 1000,
    });

    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    const unsubscribeConnectivity = NetInfo.addEventListener(
      ({ isConnected }) => {
        if (isConnected !== connected) {
          setConnected(isConnected);
        }
      },
    );
    return () => {
      if (unsubscribeConnectivity) {
        unsubscribeConnectivity();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (connected) {
    return (
      <ApolloProvider
        // @ts-ignore
        client={createApolloClient()}>
        <App />
      </ApolloProvider>
    );
  } else {
    return <NoNetwork />;
  }
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

AppRegistry.registerComponent(appName, () =>
  gestureHandlerRootHOC(() => (
    <Provider store={StoreConfig().store}>
      <AppHOC />
    </Provider>
  )),
);
