import React from 'react';
import {View} from 'react-native';
import GS from '../../GlobeStyle';

const Loading = () => {
  return <View style={{
    backgroundColor: GS.placeHolderColor,
    width: '100%',
    height: 80,
    marginTop: 10,
    borderRadius: 10,
    }}/>
};

export default Loading;
