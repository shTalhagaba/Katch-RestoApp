import React from 'react';
import {View} from 'react-native';
import {RText} from '../../GlobeStyle';


const Tag = ({tagContainer,tagText, text}) => {
  return (
    <View style={tagContainer}>
      <RText style={tagText}>{text}</RText>
    </View>
  );
};

export default Tag;
