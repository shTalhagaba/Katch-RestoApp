import React from 'react';
import {
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { hideMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { LOGOGREEN, LOGOTIMER } from '../../assets/images';
import GS, { RText } from '../../GlobeStyle';
import { capitalizeFirstLetter } from '../Helpers';
import style from './style';

const NotificationPopup = (props) => {
  const { description, icon, type = 'success' } = props.message;
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;
  const backgroundColor = {
    success: GS.logoGreen,
    warning: GS.logoYellow,
    danger: GS.logoRed,
    info: GS.logoBlue,
    default: '#fff',
  };
  const iconColor = backgroundColor[type];
  const bgColor = '#fff';
  return (
    <View
      style={[
        style.mainContainer,
        {
          paddingTop: statusBarHeight,
        },
      ]}>
      <View
        style={[
          style.container,
          {
            backgroundColor: bgColor,
            marginTop: statusBarHeight,
          },
        ]}>
        <View style={[style.logoContainer, { backgroundColor: iconColor }]}>
          <Image source={icon ? LOGOTIMER : LOGOGREEN} style={style.logo} />
        </View>
        <View style={style.message}>
          <RText style={style.description}>
            {capitalizeFirstLetter(description)}
          </RText>
        </View>
        <TouchableOpacity onPress={hideMessage} style={style.close}>
          <View style={style.closeIconContainer}>
            <FAIcon name="close" size={10} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default NotificationPopup;
