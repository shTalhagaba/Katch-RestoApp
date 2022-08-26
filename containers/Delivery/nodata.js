// @ts-nocheck
import Lottie from 'lottie-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ExpandingLocation } from '../../assets/Lottie';
import { BoldText, TextBasic } from '../../GlobeStyle';

const NoData = (props) => {
  const { title, description } = props;
  return (
    <View>
      <View style={style.container}>
        <Lottie
          resizeMode="cover"
          autoPlay
          loop={true}
          source={ExpandingLocation}
          style={style.lottie}
          speed={0.8}
        />
        <View>
          <BoldText>{title}</BoldText>
        </View>
        <View style={style.descriptionContainer}>
          <TextBasic style={style.description}>{description}</TextBasic>
        </View>
      </View>
      {[...Array(7)].map((l, i) => (
        <View
          key={i}
          style={[{ marginTop: i === 0 ? 10 : 0 }, style.loading]}
        />
      ))}
    </View>
  );
};

export default NoData;

export const style = StyleSheet.create({
  container: {
    transform: [{ translateY: -20 }],
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    flex: 1,
    marginTop: Platform.OS === 'android' ? 20 : 0,
    alignItems: 'center',
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    textAlign: 'center',
  },
  lottie: {
    height: 200,
    width: 200,
  },
});
