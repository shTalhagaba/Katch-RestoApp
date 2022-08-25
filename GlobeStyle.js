/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, Platform } from 'react-native';
import styled from 'styled-components';
import { status } from './constants/orderStatus';

export const normalizedFontSize = (/** @type {number} */ size) => {
  return (size / 9.126) * 18;
};

export default {
  primaryColor: '#f7f7f7',
  secondaryColor: '#00B800',
  greyColor: '#b3b3b3',
  lightGrey: '#4d4d4d',
  lightGrey2: '#808080',
  buttonTextColor: '#fff',
  textColor: '#0a2d4d',
  textColorGreenDark: '#30692D',
  textColorGreen: '#079107',
  textColorGreen1: '#015901',
  textColorBlue: '#16B8FF',
  textColorGrey: '#979897',
  textColorGreyDark: '#7B8091',
  textColorGreyDark2: '#7E8392',
  textColorGreyDark3: '#3D4653',
  textColorGrey1: '#E6E6E6',
  textColorRed: '#F0481C',
  errorRed: '#8f0f27',
  logoRed: '#fb4628',
  logoBlue: '#00acff',
  logoYellow: '#ffbf00',
  logoGreen: '#00cd3d',
  listHeaderTextColor: '#363946',
  menuButtonColor: '#000',
  bgGreen1: '#EBFFEB',
  bgGreen: '#D9F7D9',
  bgGreenLight: '#E9FAE8',
  bgGreenLight2: '#F0FFF2',
  bgGreenDark: '#7EF189',
  bgGreenDark1: '#2AC42A',
  bgGreenButtonDisabled: '#68F075',
  bgGreenButtonEnabled: '#19C419',
  iconBorderColor: '#D3EECA',
  placeHolderColor: '#E1E9EE',
};

const customFont = Platform.select({
  android: {
    axiformaBlackItalic: 'Kastelov - Axiforma Black Italic',
    axiformaBlack: 'Kastelov - Axiforma Black',
    axiformaBoldItalic: 'Kastelov - Axiforma Bold Italic',
    axiformaBold: 'Kastelov - Axiforma Bold',
    axiformaBookItalic: 'Kastelov - Axiforma Book Italic',
    axiformaBook: 'Kastelov - Axiforma Book',
    axiformaExtraBoldItalic: 'Kastelov - Axiforma ExtraBold Italic',
    axiformaExtraBold: 'Kastelov - Axiforma ExtraBold',
    axiformaHeavyItalic: 'Kastelov - Axiforma Heavy Italic',
    axiformaHeavy: 'Kastelov - Axiforma Heavy',
    axiformaItalic: 'Kastelov - Axiforma Italic',
    axiformaLightItalic: 'Kastelov - Axiforma Light Italic',
    axiformaLight: 'Kastelov - Axiforma Light',
    axiformaMediumItalic: 'Kastelov - Axiforma Medium Italic',
    axiformaMedium: 'Kastelov - Axiforma Medium',
    axiformaRegular: 'Kastelov - Axiforma Regular',
    axiformaSemiBoldItalic: 'Kastelov - Axiforma SemiBold Italic',
    axiformaSemiBold: 'Kastelov - Axiforma SemiBold',
    axiformaThinItalic: 'Kastelov - Axiforma Thin Italic',
    axiformaThin: 'Kastelov - Axiforma Thin',
    sketsaRamadhan: 'Sketsaramadhan',
    oldEnglishGothic: 'OldEnglishGothic',
  },
  ios: {
    axiformaBlackItalic: 'Axiforma-BlackItalic',
    axiformaBlack: 'Axiforma-Black',
    axiformaBoldItalic: 'Axiforma-BoldItalic',
    axiformaBold: 'Axiforma-Bold',
    axiformaBookItalic: 'Axiforma-BookItalic',
    axiformaBook: 'Axiforma-Book',
    axiformaExtraBoldItalic: 'Axiforma-ExtraBoldItalic',
    axiformaExtraBold: 'Axiforma-ExtraBold',
    axiformaHeavyItalic: 'Axiforma-HeavyItalic',
    axiformaHeavy: 'Axiforma-Heavy',
    axiformaItalic: 'Axiforma-Italic',
    axiformaLightItalic: 'Axiforma-LightItalic',
    axiformaLight: 'Axiforma-Light',
    axiformaMediumItalic: 'Axiforma-MediumItalic',
    axiformaMedium: 'Axiforma-Medium',
    axiformaRegular: 'Axiforma-Regular',
    axiformaSemiBoldItalic: 'Axiforma-SemiBoldItalic',
    axiformaSemiBold: 'Axiforma-SemiBold',
    axiformaThinItalic: 'Axiforma-ThinItalic',
    axiformaThin: 'Axiforma-Thin',
    sketsaRamadhan: 'SketsaRamadhan',
    oldEnglishGothic: 'OldEnglishGothic',
  },
});

const {
  pending,
  accepted,
  enRoute,
  declined,
  ready,
  completed,
  incomplete,
  cancelled,
  refunded,
} = status;

export const statusColor = {
  [pending]: '#ffc42a',
  [accepted]: '#ff6600',
  [enRoute]: '#3366cc',
  [declined]: '#ff4040',
  [ready]: '#ff6600',
  [completed]: '#00b800',
  [incomplete]: '#2cb4eb',
  [cancelled]: '#ff4040',
  [refunded]: '#2cb4eb',
};

export const priceSymbol = 'KD';
export { customFont };

export const BoldText = (
  /** @type {{ children: any; style?: any; fontName?: String; rest?: any }} */ {
    children,
    style,
    fontName,
    ...rest
  },
) => (
  <Text
    {...rest}
    allowFontScaling={false}
    style={[
      {
        fontFamily: fontName ? fontName : customFont.axiformaBold,
        includeFontPadding: false,
      },
      style,
    ]}>
    {children}
  </Text>
);

export const RText = (
  /** @type {{ children: any; style?: any; fontName?: String; rest?: any }} */ {
    children,
    style,
    fontName,
    ...rest
  },
) => (
  <Text
    {...rest}
    allowFontScaling={false}
    style={[
      {
        fontFamily: fontName ? fontName : customFont.axiformaRegular,
        includeFontPadding: false,
      },
      style,
    ]}>
    {children}
  </Text>
);

export const TextBasic = ({ children, ...rest }) => (
  <Text {...rest} allowFontScaling={false}>
    {children}
  </Text>
);

export const ActionButton = styled.TouchableOpacity`
  height: 45px;
  flex: 1;
  margin: 5px 0px 5px 0px;
  border-radius: 10px;
  background-color: #47bb39;
  align-items: center;
  justify-content: center;
`;

export const ActionButtonDisabled = styled.TouchableOpacity`
  height: 45px;
  flex: 1;
  margin: 5px 0px 5px 0px;
  border-radius: 10px;
  background-color: #b3b3b3;
  align-items: center;
  justify-content: center;
`;
