import React, {useState, useEffect, memo} from 'react';
import {View} from 'react-native';

//3rd party
import {Marker} from 'react-native-maps';
import Svg, {Image} from 'react-native-svg';

//others
import {RText, BoldText, normalizedFontSize} from '../../GlobeStyle';
import {distance} from '../Helpers';
import {MAP_PIN} from '../../assets/images';
import Icon from '../Icon';

const CustomMaker = (props) => {
  const {listRef, isListPopulated, userLoc, coordinates} = props;

  return coordinates
    ? coordinates.map((coordinate, index) => {
        return (
          <Marker
            key={coordinate._id}
            coordinate={coordinate}
            onPress={() => {
              if (isListPopulated) {
                try {
                  listRef.current.getNode().scrollToIndex({
                    index: index,
                  });
                } catch (error) {}
              }
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  marginLeft: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <RText style={{fontSize: normalizedFontSize(4.5), color: 'gray'}}>
                  {coordinate.shopName}
                </RText>
                <BoldText
                  style={{fontSize: normalizedFontSize(4.5), marginLeft: 6}}>
                  {distance(coordinate, userLoc)} KM
                </BoldText>
              </View>
              <Icon source={MAP_PIN} style={{
                width: 40, height:30,
                resizeMode: 'contain'
              }}
                />
              {/* <Svg width={40} height={30}>
                <Image href={MAP_PIN} width={40} height={30} />
              </Svg> */}
              <Image style={{height: 35, width: 25}} source={MAP_PIN} />
            </View>
          </Marker>
        );
      })
    : null;
};

export default memo(CustomMaker);
