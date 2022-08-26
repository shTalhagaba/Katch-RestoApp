import React from 'react';
import {
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Platform,
  Text,
} from 'react-native';

//others
import {
  RText,
  customFont,
  normalizedFontSize,
  TextBasic,
} from '../../GlobeStyle';
import {
  generateImgScr,
  generateProductImgScr,
  distance,
} from '../../components/Helpers';
import ProgressiveImage from '../../components/ProgressiveImage';
import {
  DEFAULT_REST_IMG,
  LOCATION_PIN_GREEN_OUTLINE,
} from '../../assets/images';
import Rating from '../Rating';

const windowWidth = Dimensions.get('window').width;

const Card = (props) => {
  const { item, navigation, userLoc } = props;
  const { shopName, category, rating, reviewsCount, location } = item;
  let imageSrc;
  const bestSellingProducts = item.products.filter(
    (product) =>
      product.tags.includes('Best Selling') ||
      product.tags.includes('best selling'),
  );
  if (bestSellingProducts.length >= 1) {
    const randomPhoto = Math.floor(Math.random() * bestSellingProducts.length);

    imageSrc = generateProductImgScr(
      item._id,
      bestSellingProducts[randomPhoto].image,
    );
  } else {
    imageSrc = generateImgScr(item._id, item.image, Dimensions.get('window').width);
  }
  const onPress = () => {
    navigation.navigate('Rest', {
      id: item._id,
    });
  };

  return (
    <View
      style={[
        {
          justifyContent: 'center',
          minWidth: windowWidth / 1.2,
          minHeight: 95,
          paddingRight: 15,
        },
      ]}>
      <View
        style={[
          {
            backgroundColor: '#fff',
            marginVertical: 10,
            borderRadius: 10,
            minHeight: 95,
            overflow: 'hidden',
          },
        ]}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
          <View style={{ flex: 1.5, minWidth: 70 }}>
            <ProgressiveImage
              grayscaleAmount={0}
              source={imageSrc}
              resizeMode={'cover'}
              fallBackImage={DEFAULT_REST_IMG}
              blurRadius={0}
              borderRadius={0}
              containerStyle={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 10,
              }}
            />
          </View>
          <View style={{ padding: 10, flex: 1, flexGrow: 1 }}>
            <TextBasic
              style={{
                fontSize: normalizedFontSize(7.5),
                fontFamily: customFont.axiformaRegular,
              }}>
              {shopName}
            </TextBasic>
            <Rating
              containerStyle={{
                marginVertical: 10,
              }}
              textStyle={{
                fontSize: normalizedFontSize(5),
              }}
              rating={rating}
              reviewsCount={`(${reviewsCount} Ratings)`}
            />
            <TextBasic
              style={{
                color: 'gray',
                fontSize: normalizedFontSize(5.5),
                marginLeft: 3,
                fontFamily: customFont.axiformaMedium,
              }}>
              {category}
            </TextBasic>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 8,
              }}>
              <Image
                source={LOCATION_PIN_GREEN_OUTLINE}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: 'contain',
                }}
              />
              <TextBasic
                style={{
                  color: 'gray',
                  fontSize: normalizedFontSize(5),
                  marginLeft: 3,
                  fontFamily: customFont.axiformaMedium,
                }}>
                {distance(userLoc, location)} KM away
              </TextBasic>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
