//react
import React from 'react';
import {View} from 'react-native';

//3rd party

//others
import {StarPlain} from '../../assets/svg';
import { BoldText } from '../../GlobeStyle';

const Stars = ({
  rating,
  component,
  containerStyle = {},
  starStyle = {},
  starHeight,
  starWidth,
  textStyle = {},
  withTextRating = false
}) => {
  const Component = component;

  return (
    <View style={containerStyle}>
      {[...Array(5)].map((__, i) => {
        return  rating >= (i + 1)? (
          <Component
            key={i}
            height={starHeight}
            width={starWidth}
            style={starStyle}
          />
        ) : (
          <StarPlain
            key={i}
            height={starHeight}
            width={starWidth}
            style={starStyle}
          />
        );
      })}
      {withTextRating && <BoldText style={textStyle}>{rating}</BoldText>}
    </View>
  );
};

export default Stars;
