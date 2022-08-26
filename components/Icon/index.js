import React, {memo} from 'react';
import FastImage from 'react-native-fast-image';

const Icon = ({style, source}) => {
  return (
    <FastImage
      style={style}
      source={source}
      resizeMode={FastImage.resizeMode[style.resizeMode]}
    />
  );
};

export default memo(Icon);