import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import GS from '../../GlobeStyle';

class ProgressiveImage extends Component {
  state = {
    imageSource: {
      uri: this.props.source,
    },
    didImageLoad: false,
    removeImage: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.imageSource !== this.state.imageSource) {
      return true;
    }

    if (nextState.didImageLoad !== this.state.didImageLoad) {
      return true;
    }

    if (nextState.removeImage !== this.state.removeImage) {
      return true;
    }

    return false;
  }

  render() {
    const {
      grayscaleAmount = 0,
      source,
      resizeMode,
      fallBackImage,
      borderRadius = 0,
      containerStyle,
      removeOnError = false,
      ...props
    } = this.props;

    const { imageSource, removeImage, didImageLoad } = this.state;

    const imageStyle = {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius,
      position: 'absolute',
      zIndex: 1,
      resizeMode,
    };

    return removeImage !== true ? (
      <View style={containerStyle}>
        <Grayscale style={imageStyle} amount={grayscaleAmount}>
          {imageSource.uri ? (
            <Image
              onError={(err) => {
                this.props.onImageCallBack && this.props.onImageCallBack()
                if (removeOnError) {
                  this.setState({
                    removeImage: true,
                  });
                }

                this.setState({
                  imageSource: fallBackImage,
                });
              }}
              onLoad={() => {
                this.props.onImageCallBack && this.props.onImageCallBack()
                this.setState({
                  didImageLoad: true,
                });
              }}
              source={imageSource}
              style={imageStyle}
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: borderRadius,
                position: 'absolute',
                backgroundColor: '#F7FDF8',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                onLoad={() => {
                  this.setState({
                    didImageLoad: true,
                  });
                }}
                source={fallBackImage}
                style={{ height: 200, width: 200 }}
              />
            </View>
          )}
        </Grayscale>

        {!didImageLoad && (
          <View
            style={{
              backgroundColor: GS.placeHolderColor,
              width: '100%',
              height: '100%',
              borderRadius: borderRadius,
            }}
          />
        )}

        {didImageLoad ? props.children : null}
      </View>
    ) : null;
  }
}

export default ProgressiveImage;
