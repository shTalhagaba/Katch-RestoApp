import React, {useState, memo} from 'react';
import {StyleSheet, View} from 'react-native';

//others
import GS, {
  BoldText,
  RText,
  normalizedFontSize,
  customFont,
  TextBasic,

} from '../../../GlobeStyle';

import {RestInfoContainer} from './style';


const CollectionInfo = ({info}) => {
  return (
    <>
      <RestInfoContainer >
        <TextBasic
          style={{
            fontFamily: customFont.axiformaMedium,
            fontSize: normalizedFontSize(11),
          }}>
          {info.name}
        </TextBasic>
        <View
          style={{
            marginTop: 10,
          }}>
          <RText style={style.storeAddress}>{info.description}</RText>
        </View>
      </RestInfoContainer>
    </>
  );
};

export default memo(CollectionInfo);


const style = StyleSheet.create({
  storeAddress: {
    marginBottom: 5,
    color: 'gray',
    fontSize: normalizedFontSize(7.126),
  },
});
