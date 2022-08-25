import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { WHITE_TRIANGLE } from '../../../assets/images';
import {
  ActionButton,
  customFont,
  normalizedFontSize,
  priceSymbol,
  RText,
} from '../../../GlobeStyle';

const pluralize = (val, word, plural = word + 's') => {
  const _pluralize = (num, word, plural = word + 's') =>
    [1, -1].includes(Number(num)) ? word : plural;
  if (typeof val === 'object') return (num, word) => _pluralize(num, word, val[word]);
  return _pluralize(val, word, plural);
};

const GoToCartButton = ({
  shopName,
  setGoToCartVisible = undefined,
  couponRoute = false,
}) => {
  // Product cart
  const total = useSelector((state) => state.cart.total);
  const item_count = useSelector((state) => state.cart.addedItems.length);
  const store_info = useSelector((state) => state.cart.storeInfo);

  // Coupon cart
  const coupon_total = useSelector((state) => state.couponCart.total.value);
  // const coupon_count = useSelector((state) => state.couponCart.coupons.length);
  const coupons = useSelector((state) => state.couponCart.coupons);

  const navigation = useNavigation();
  const coupon_count = coupons.reduce((accum, item) => accum + item.total, 0);

  useEffect(() => {
    if (setGoToCartVisible) {
      if (item_count > 0 && shopName === store_info.shopName) {
        setGoToCartVisible(true);
      } else {
        setGoToCartVisible(false);
      }
    }
  });

  return (item_count > 0 && shopName === store_info.shopName) ||
    (couponRoute && coupon_count > 0) ? (
    <Animated.View style={styles.actionButtonWrapper}>
      <ActionButton onPress={() => navigation.navigate('Cart')}>
        <View style={styles.contentWrapper}>
          <View style={styles.col}>
            <RText
              style={styles.cartInfoText}
              fontName={customFont.axiformaMedium}>
              {couponRoute
                ? `${coupon_count} ${pluralize(
                    coupon_count,
                    'item',
                  ).toUpperCase()}`
                : `${item_count} ${pluralize(
                    item_count,
                    'item',
                  ).toUpperCase()}`}
            </RText>
            <RText
              style={[styles.cartInfoText, styles.boldText]}
              fontName={customFont.axiformaBold}>
              {couponRoute
                ? `${parseFloat(coupon_total).toFixed(3)} ${priceSymbol}`
                : total}
            </RText>
          </View>
          <View style={styles.rightSide}>
            <RText
              style={styles.actionText}
              fontName={customFont.axiformaMedium}>
              Go to Cart
            </RText>
            <Image style={styles.whiteArrow} source={WHITE_TRIANGLE} />
          </View>
        </View>
      </ActionButton>
    </Animated.View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  actionButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginHorizontal: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  actionText: { color: 'white', fontSize: normalizedFontSize(6) },
  cartInfoText: {
    color: 'white',
    marginVertical: 2,
    fontSize: normalizedFontSize(5.5),
  },
  boldText: {
    fontSize: normalizedFontSize(6),
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    flex: 1,
  },
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  whiteArrow: {
    width: 9,
    height: 9,
    resizeMode: 'contain',
    marginLeft: 5,
  },
});
export default GoToCartButton;
