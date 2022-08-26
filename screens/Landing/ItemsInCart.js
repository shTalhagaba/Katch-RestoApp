import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import GS, { customFont, normalizedFontSize, RText } from '../../GlobeStyle';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { generateImgScr } from '../../components/Helpers';
import { BLACK_TRIANGLE, DEFAULT_REST_IMG } from '../../assets/images';

const ItemsInCart = ({ setIsVisible }) => {
  const store_info = useSelector((state) => state.cart.storeInfo);
  const navigation = useNavigation();
  const onPress = () =>
    navigation.navigate('Rest', {
      screen: 'Menu',
      id: store_info._id,
    });
  const [image, setImage] = useState(
    store_info
      ? generateImgScr(store_info._id, store_info.image)
      : DEFAULT_REST_IMG,
  );

  useEffect(() => {
    setImage(
      store_info
        ? generateImgScr(store_info._id, store_info.image)
        : DEFAULT_REST_IMG,
    );
    if (setIsVisible) {
      setIsVisible(store_info ?? false);
    }
  }, [store_info, setIsVisible]);

  return store_info ? (
    <Animated.View style={style.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={{ width: '100%', height: 60 }}>
          <View style={style.outerBox}>
            <View style={style.restInfoBox}>
              <View style={style.imageWrapper}>
                {!!image.toString() && (
                  <Image
                    onError={() => {
                      setImage(DEFAULT_REST_IMG);
                    }}
                    source={{
                      uri: image.toString(),
                    }}
                    style={style.imageStyle}
                  />
                )}
              </View>
              <View style={{ marginLeft: 10 }}>
                <RText
                  fontName={customFont.axiformaSemiBold}
                  style={{ marginBottom: 3 }}>
                  {store_info.shopName}
                </RText>
                <RText
                  style={{
                    color: GS.lightGrey2,
                    fontSize: normalizedFontSize(6),
                  }}>
                  You have items in your cart
                </RText>
              </View>
            </View>
            <View style={style.view}>
              <RText
                style={{
                  fontSize: normalizedFontSize(5.5),
                }}>
                VIEW
              </RText>
              <Image style={style.arrowStyle} source={BLACK_TRIANGLE} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <></>
  );
};

const style = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 0.2,
    borderColor: 'silver',
    shadowColor: GS.placeHolderColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
  },
  outerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restInfoBox: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageWrapper: {
    borderRadius: 20,
    height: 40,
    width: 40,
    overflow: 'hidden',
  },
  imageStyle: {
    backgroundColor: GS.bgGreenLight,
    height: 40,
    width: 40,
    marginRight: 10,
    resizeMode: 'cover',
  },
  view: { marginRight: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  arrowStyle: {
    width: 9,
    height: 9,
    resizeMode: 'contain',
    marginLeft: 5,
  },
});

export default ItemsInCart;
