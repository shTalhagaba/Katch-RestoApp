import React from 'react';
import {View, Dimensions} from 'react-native';
import GS from '../../GlobeStyle';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Loading = () => {
  return (
    <View style={{width: windowWidth,padding:25}}>
      {[...Array(Math.ceil((windowHeight / 2) / 50))].map(
        (l, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              backgroundColor: GS.placeHolderColor,
              height: 60,
             
              marginTop: 8,
              borderRadius: 10,
            }}
          />
        ),
      )}
    </View>
  );
};

export default Loading;
