import React, {Component} from 'react';
import {View, TouchableOpacity, Platform, Image} from 'react-native';

//3rd party

//others
import {generateProductImgScr} from '../Helpers';
import ProgressiveImage from '../ProgressiveImage';
import {DEFAULT_DISH_IMG, } from '../../assets/images';
import GS, {
  normalizedFontSize,
  RText,
  priceSymbol,
  customFont,
} from '../../GlobeStyle';
import {Viewport} from '@skele/components';

const Placeholder = () =>(
  <View
    style={{ 
      minWidth: 110,
      width: '100%',
      height: '100%',
      backgroundColor: GS.placeHolderColor
    }} />);

const ViewportAwareImage = Viewport.Aware(Viewport.WithPlaceholder(ProgressiveImage, Placeholder));
class DishCard extends Component {
  shadow = {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  };

  onPress = () => {
    this.props.navigation.navigate('Rest', {
      screen: 'Menu',
      id: this.props.shopId,
      scrollTo: this.props._id,
      category: this.props.category,
    });
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {name, price, shopCategory, shopId, image, category} = this.props;

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={{
          flex: 1,
          paddingVertical: 10,
          flexDirection: 'row',
          minHeight: 100,
        }}>
        <View
          style={{
            maxHeight: 110,
          }}>
          <View
            style={{
              borderRadius: 15,
              overflow: 'hidden',
            }}>
            <ViewportAwareImage
              removeOnError={true}
              source={generateProductImgScr(shopId, image)}
              preTriggerRatio={0.5}
              retainOnceInViewport={false}
              fallBackImage={DEFAULT_DISH_IMG}
              containerStyle={[
                {
                  height: '100%',
                  width: '100%',
                  borderRightWidth: 0.5,
                  borderColor: 'silver',
                  overflow: 'hidden',
                  minWidth: '30%',
                }
              ]}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* item info */}
        <View
          style={{
            flex: 2.5,
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
           <RText
            numberOfLines={2}
            ellipsizeMode="tail"
          fontName={customFont.axiformaMedium}
          style={{fontSize: normalizedFontSize(7), marginBottom: 5}}>
          {name}
        </RText>
        <RText
          style={{color: 'gray', fontSize: normalizedFontSize(4.5), marginBottom: 5}}>
          {shopCategory}
        </RText>
        <RText
          style={{color: 'gray', fontSize: normalizedFontSize(4.5), marginBottom: 5}}>
          {category}
        </RText>

        
        
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View
              style={{
                backgroundColor: '#d9f7d9',
                borderRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 6,
                marginRight: 'auto',
              }}>
                <RText
                fontName={customFont.axiformaMedium}
                style={{fontSize: normalizedFontSize(4.5), color: '#079107'}}>
                {price} {priceSymbol}
              </RText>
              
            </View>
            
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default DishCard;
