import React from 'react';
import {View} from 'react-native';
import {
  customFont,
  normalizedFontSize,
  TextBasic
} from '../../GlobeStyle';

const Tag = ({name, color}) => {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 3,
        paddingHorizontal: 5,
        marginRight: 2,
        minWidth: 30,
        alignItems: 'center',
        justifyContent: 'center',
        height: 13,
      }}>
    <TextBasic
      style={{
        color: 'white',
        fontSize: normalizedFontSize(4.5),
        fontFamily: customFont.axiformaMedium,
      }}>
      {name.toUpperCase()}
    </TextBasic>
    </View>

  );
};

const colorSet = ['#F0481C','#54BF45','#66CCD4','#FBCD4B'];
const Tags = ({tags}) => {
  if (tags)
    return (
      <View style={{display:'flex', flexWrap: 'wrap', height: 13, overflow: 'hidden', flexDirection:'row', marginTop: 5}}>
        {tags.slice(0,4).map((tag,index) => {
          return <Tag name={tag} key={tag} color={colorSet[index%4]}/>;
        })}
      </View>
    );
  else return null;
};

export default Tags;
