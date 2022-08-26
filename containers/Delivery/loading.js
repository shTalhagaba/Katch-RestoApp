import React from 'react';
import {View, StyleSheet} from 'react-native';
import GS from '../../GlobeStyle';

const Loading = () =>
  [...Array(7)].map((l, i) => <View key={i} style={[{ marginTop: i === 0 ? 10 : 0}, style.loading]} />);

export default Loading;

export const style = StyleSheet.create({
  more: {
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  loading: {
    backgroundColor: GS.placeHolderColor,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  less: {
    
  }
});
