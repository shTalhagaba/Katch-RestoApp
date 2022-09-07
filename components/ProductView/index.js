import { useQuery } from '@apollo/client'
import { Viewport } from '@skele/components';
import React, { Component, useState } from 'react';
import { Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  customFont,
  normalizedFontSize,
  RText,
  TextBasic,
  priceSymbol,
} from '../../GlobeStyle';
import { CHECK_STORE_STATUS } from '../GraphQL';
//others
import { animateLayout, generateProductImgScr, getOpensAt } from '../Helpers';
import { styles } from './style';

const ViewportAware = Viewport.Aware(View);

const StoreStatus = ({ storeId, price }) => {
  const [isClosed, setIsClosed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [opening, setOpening] = useState('');

  useQuery(CHECK_STORE_STATUS, {
    onCompleted: ({ getStore }) => {
      setIsClosed(!getStore.isOpen || getStore.busyMode);
      setOpening(getStore.storeHours?.opening);
    },
    onError: () => {
      setIsLoading(false);
    },
    variables: { id: storeId },
    fetchPolicy: 'no-cache',
  });

  return (
    <View style={styles.wraps}>
      <View style={styles.wrapperView}>
        <RText fontName={customFont.axiformaMedium} style={styles.price}>
          {price} {priceSymbol}
        </RText>
      </View>

      {!isLoading && isClosed && (
        <View style={[styles.wrapperView, styles.closedStyle]}>
          <RText
            fontName={customFont.axiformaMedium}
            style={styles.storeClosed}>
            {getOpensAt(opening, !isClosed)}
          </RText>
        </View>
      )}
    </View>
  );
};
class ProductView extends Component {
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
      <View style={styles.container}>
        <View style={styles.productContainer}>
          <View style={styles.pcontainer}>
            <TouchableOpacity style={styles.h100} onPress={this.onPress}>
              <TextBasic
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  fontFamily: customFont.axiformaMedium,
                  fontSize: normalizedFontSize(6.8),
                }}>
                {item.name}
              </TextBasic>
              <RText style={styles.shopName}>{item.shopName}</RText>
              <RText style={styles.category}>{item.shopCategory}</RText>
              <StoreStatus storeId={item.shopId} price={item.price} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={this.onPress}>
          <ViewportAware
            onViewportEnter={this.onViewportEnter}
            onViewportLeave={this.onViewportLeave}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: this.state.showImage ? 110 : 0.5,
              height: this.state.showImage ? 110 : 0.5,
              marginBottom: 20,
            }}>
            {this.state.visible && (
              <Image
                style={styles.image}
                source={this.state.imageSrc}
                onLoad={() => {
                  animateLayout();
                  this.setState({ showImage: true });
                }}
              />
            )}
          </ViewportAware>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ProductView;
