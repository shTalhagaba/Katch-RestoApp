import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import {capitalizeFirstLetter} from '../Helpers'
import GS,{RText, customFont} from '../../GlobeStyle';

const Tag = ({name, navigation,...props}) => {
  return (
    <TouchableOpacity
      style={{
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        borderWidth: 1.25,
        borderColor: GS.secondaryColor,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
        minWidth: 100
      }}
      onPress={() => {
        navigation.navigate('Search', {
          searchString: name
        });
      }}>
      <RText
        fontName={Platform.OS === 'ios'? customFont.axiformaBold : customFont.axiformaMedium}
        style={{
          fontSize: 15,
          textAlign: 'center',
          color: GS.secondaryColor,
        }}>
        {capitalizeFirstLetter(name)}
      </RText>
    </TouchableOpacity>
  );
}

export default Tag;
