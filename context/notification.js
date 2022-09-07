/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { StatusBar, View, TouchableOpacity } from 'react-native';

//3rd party
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//others
import { REGISTER_TOKEN } from '../components/GraphQL';
import { useMutation } from '@apollo/client'
import { LogJsError } from '../components/AppReporting';
import GS, { BoldText, normalizedFontSize, RText } from '../GlobeStyle';
import { capitalizeFirstLetter } from '../components/Helpers';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import NotificationPopup from '../components/Notification';

export const Context = React.createContext();

export const Provider = (props) => {
  const [saveFCMToken] = useMutation(REGISTER_TOKEN);

  useEffect(() => {
    const authListener = auth().onAuthStateChanged((authUser) => {
      if (
        authUser &&
        (authUser.providerData.length > 1 || authUser.emailVerified)
      ) {
        requestUserPermission();
      } else {
        messaging().deleteToken();
      }
    });

    const messageListener = messaging().onMessage((payload) => {
      show({
        message: payload.notification.title,
        description: payload.notification.body,
        type: payload.data.type,
        icon: payload.data.icon,
      });
    });

    const tokenListener = messaging().onTokenRefresh(async (fcmToken) => {
      try {
        saveFCMToken({ variables: { fcmToken } });
      } catch (error) {
        LogJsError(
          new Error(
            `[Error saving FCM refresh token]: ${JSON.stringify(
              error,
              null,
              2,
            )}`,
          ),
        );
      }
    });

    return () => {
      messageListener();
      authListener();
      tokenListener();
    };
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
        saveFCMToken({ variables: { fcmToken } });

        //who ever is subscribed to everyone topic will receive a notification from firebase dashboard
        messaging().subscribeToTopic('everyone');
      }
    } catch (error) {
      LogJsError(
        new Error(
          `[FCM permission error || saving token error]: ${JSON.stringify(
            error,
            null,
            2,
          )}`,
        ),
      );
    }
  };

  /**
   *
   * @param {{message: string, type: string, icon: string, description: string}} params
   * "success" (green), "warning" (orange), "danger" (red), "info" (blue) and "default" (gray)
   */

  const show = ({ message, description, type = 'success', icon, ...rest }) => {
    showMessage({
      message,
      description,
      type,
      icon,
      ...rest,
    });
  };

  const value = {
    actions: {
      show,
      hide: hideMessage,
    },
  };

  return (
    <Context.Provider value={value}>
      <View style={{ flex: 1 }}>
        <FlashMessage
          autoHide={true}
          duration={10000}
          hideStatusBar={false}
          position="top"
          hideOnPress={true}
          MessageComponent={(props) => <NotificationPopup {...props} />}
        />
        {props.children}
      </View>
    </Context.Provider>
  );
};

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {(context) => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}

const CustomContent = (props) => {
  const { message, description, type } = props.message;
  const backgroundColor = {
    success: GS.logoGreen,
    warning: GS.logoYellow,
    danger: GS.logoRed,
    info: GS.logoBlue,
    default: '#fff',
  };
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;

  return (
    <View
      style={{
        backgroundColor: backgroundColor[type],
        flex: 1,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        minHeight: 100,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingTop: statusBarHeight,
      }}>
      <TouchableOpacity
        onPress={hideMessage}
        style={{
          flexGrow: 1,
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <BoldText
          style={{
            color: '#fff',
            fontSize: normalizedFontSize(8),
            marginBottom: 10,
          }}>
          {capitalizeFirstLetter(message)}
        </BoldText>
        <RText style={{ color: '#fff', fontSize: normalizedFontSize(7) }}>
          {capitalizeFirstLetter(description)}
        </RText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={hideMessage}
        style={{
          backgroundColor: 'rgba(0,0,0,.20)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <FAIcon name="close" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
