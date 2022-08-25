import { Viewport } from '@skele/components';
import React, { Component } from 'react';
import { Image, ImageBackground, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  DEFAULT_DISH_IMG,
  DEFAULT_REST_IMG,
  RAMADAN_BANNER,
} from '../../assets/images';
import GS, {
  customFont,
  normalizedFontSize,
  RText,
  TextBasic,
  priceSymbol,
  BoldText,
} from '../../GlobeStyle';
import style from '../CouponCard/style';
//others
import { animateLayout, generateProductImgScr } from '../Helpers';
import { styles } from './style';

const ViewportAware = Viewport.Aware(View);

class ProductCardView extends Component {
  state = {
    onDisplayRow: true,
    imageSrc: {
      uri: generateProductImgScr(this.props.item.shopId, this.props.item.image),
    },
    showImage: false,
    visible: false,
  };

  shouldComponentUpdate(newProps, newState) {
    //when Component is in viewport
    if (newState.visible !== this.state.visible) {
      return true;
    }

    //on change layout
    if (newState.onDisplayRow !== this.state.onDisplayRow) {
      return true;
    }

    //on image error
    if (this.state.showImage !== newState.showImage) {
      return true;
    }

    return false;
  }

  onViewportEnter = () => {
    if (this.state.imageSrc !== null) {
      this.setState({ visible: true });
    }
  };

  onViewportLeave = () => {
    if (this.state.imageSrc !== null) {
      this.setState({ visible: false });
    }
  };

  onPress = () => {
    this.props.navigation.navigate('Rest', {
      screen: 'Menu',
      id: this.props.item.shopId,
      scrollTo: this.props.item._id,
      category: this.props.item.category,
    });
  };

  render() {
    const { item } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress} activeOpacity={1}>
        <View style={styles.container}>
          <View style={[styles.imageContainer]}>
            <TouchableOpacity
              onPress={this.onPress}
              activeOpacity={1}
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: GS.bgGreen,
              }}>
              <ViewportAware
                onViewportEnter={this.onViewportEnter}
                onViewportLeave={this.onViewportLeave}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flex: 1,
                  minHeight: 110,
                  backgroundColor: GS.bgGreen,
                }}>
                {this.state.visible && (
                  <Image
                    style={[styles.image, this.state.style]}
                    source={this.state.imageSrc}
                    onLoad={() => {
                      // animateLayout();
                      this.setState({ showImage: true });
                    }}
                    onError={(e) => {
                      this.setState({
                        imageSrc: DEFAULT_REST_IMG,
                        showImage: true,
                        style: {
                          resizeMode: 'contain',
                          width: 150,
                          minWidth: null,
                        },
                      });
                    }}
                  />
                )}
              </ViewportAware>
            </TouchableOpacity>
          </View>

          <View style={styles.productContainer}>
            <View style={styles.pcontainer}>
              <View style={styles.h100} onPress={this.onPress}>
                <TextBasic
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    fontFamily: customFont.axiformaMedium,
                    fontSize: normalizedFontSize(6.8),
                  }}>
                  {item.name}
                </TextBasic>
              </View>
            </View>
            <View style={styles.tagContainer}>
              <RText style={styles.tagText}>{item.tags.join(', ')}</RText>
            </View>
            <View>
              <BoldText style={styles.shopNametext}>{item.shopName}</BoldText>
            </View>
            <View style={styles.wraps}>
              <View style={styles.wrapperView}>
                <BoldText
                  // fontName={customFont.axiformaMedium}
                  style={styles.price}>
                  {item.price} {priceSymbol}
                </BoldText>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ProductCardView;
