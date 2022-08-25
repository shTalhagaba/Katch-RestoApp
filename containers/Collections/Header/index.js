import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import GS, {
  RText,
  customFont,
  normalizedFontSize,
} from '../../../GlobeStyle';
import Icon from '../../../components/Icon';

export default ({imageSrc, title, containerStyle, imageStyle, textStyle,onViewAllClicked}) => {
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
          ...textStyle,
        }}>
        {title}
      </RText>
      <TouchableOpacity 
      onPress={onViewAllClicked}
      style={{
        marginLeft: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}>
        <RText
          style={{
            fontSize: normalizedFontSize(6.126),
            color: GS.logoRed,
            textAlign:'right'
          }}>
          See all &gt;&gt;
        </RText>
      </TouchableOpacity>
    </View>
  );
};
