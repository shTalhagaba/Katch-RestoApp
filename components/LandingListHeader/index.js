import React from 'react';
import {View, Image} from 'react-native';
import GS, {
  RText,
  BoldText,
  customFont,
  normalizedFontSize,
} from '../../GlobeStyle';
import Icon from '../Icon';

export default ({imageSrc, title, containerStyle, imageStyle, textStyle}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        ...containerStyle,
      }}>
      <Icon
        source={imageSrc}
        style={{
          height: 25,
          width: 25,
          resizeMode: 'contain',
          marginBottom: 5,
          ...imageStyle,
        }}
      />
      <RText
        fontName={customFont.axiformaMedium}
        style={{
          fontSize: normalizedFontSize(9.126),
          paddingLeft: 10,
          color: '#363946',
          flexGrow: 1,
          ...textStyle,
        }}>
        {title}
      </RText>
    </View>
  );
};
