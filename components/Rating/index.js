import React, { memo } from 'react';
import { View, Image } from 'react-native';

//others
import { FILLED_STAR, EMPTY_STAR } from '../../assets/images';
import { RText, normalizedFontSize } from '../../GlobeStyle';
import Icon from '../Icon';

const Rating = ({
  rating,
  reviewsCount,
  containerStyle,
  textStyle,
  imageStyle,
  dropRating = null,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        ...containerStyle,
      }}>
      {[1, 2, 3, 4, 5].map((_, index) => {
        return (
          <Icon
            key={index + _}
            source={index + 1 <= rating ? FILLED_STAR : EMPTY_STAR}
            style={{
              height: 15,
              width: 15,
              marginRight: 1.5,
              flexShrink: 1,
              ...imageStyle,
            }}
          />
        );
      })}
      {
        <RText
          style={{
            fontSize: normalizedFontSize(5),
            color: 'gray',
            marginLeft: 2,
            ...textStyle,
          }}>
          {reviewsCount}
        </RText>
      }
    </View>
  );
};

export default memo(Rating);
