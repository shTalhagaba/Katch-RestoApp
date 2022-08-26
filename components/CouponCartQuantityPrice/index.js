//react
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { clearCart } from '../../components/Redux/Actions/cartActions';
import {
  addCouponQuantity,
  addCouponToCart,
  subtractCouponQuantity,
} from '../../components/Redux/Actions/couponcartActions';
import SpinnerPriceInput from '../../components/SpinnerPriceInput';
import GS, { customFont, normalizedFontSize, RText } from '../../GlobeStyle';
import { showAlert } from '../Alerts';
import SpinnerInput from '../SpinnerInput';

const CouponQuantityPrice = ({
  navigation,
  route,
  params,
  addCoupon,
  addCouponQuantity: addQuantity,
  subtractCouponQuantity: subQuantity,
  couponCart,
  coupon,
  productCart,
  clearProductCart,
  nativeSpinner = false,
  ...props
}) => {
  const [couponDetail, setCouponDetail] = useState(coupon);
  const [itemInCart, setItemInCart] = useState(false);
  const [cartCoupon, setCartCoupon] = useState(null);

  useEffect(() => {
    if (
      couponDetail &&
      couponCart &&
      couponCart?.coupons?.find((x) => x._id === couponDetail._id)
    ) {
      setCartCoupon(
        couponCart?.coupons?.find((x) => x._id === couponDetail._id),
      );
      setItemInCart(true);
    } else {
      setItemInCart(false);
    }
  }, [couponCart, couponDetail]);

  useEffect(() => {
    setCouponDetail(coupon);
  }, [coupon]);

  const addCouponToCartList = (_coupon) => {
    if (productCart?.addedItems.length !== 0) {
      showAlert({
        title: 'Alert',
        message:
          'There are items in your cart. Are you sure you want to clear the cart and add coupon.',
        onConfirm: () => {
          clearProductCart();
          addCoupon(_coupon);
        },
      });
    } else {
      addCoupon(_coupon);
    }
  };

  return (
    <>
      {!itemInCart && (
        <TouchableOpacity
          style={styles.container}
          onPress={() => addCouponToCartList(couponDetail)}>
          <RText style={styles.label}>+ Add</RText>
        </TouchableOpacity>
      )}
      {itemInCart &&
        (!nativeSpinner ? (
          <SpinnerPriceInput
            onMinus={() => subQuantity(couponDetail)}
            onPlus={() => addQuantity(couponDetail)}
            value={cartCoupon.total}
            price={cartCoupon.total * couponDetail.afterPrice}
          />
        ) : (
          <SpinnerInput
            onMinus={() => subQuantity(couponDetail)}
            onPlus={() => addQuantity(couponDetail)}
            value={cartCoupon.total}
            price={cartCoupon.total * couponDetail.afterPrice}
          />
        ))}
    </>
  );
};
const mapStateToProp = (state) => {
  return {
    couponCart: state.couponCart,
    productCart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCoupon: (coupon) => dispatch(addCouponToCart(coupon)),
    addCouponQuantity: (coupon) => dispatch(addCouponQuantity(coupon)),
    subtractCouponQuantity: (coupon) =>
      dispatch(subtractCouponQuantity(coupon)),
    clearProductCart: () => dispatch(clearCart()),
  };
};

const styles = StyleSheet.create({
  label: {
    fontFamily: customFont.axiformaBold,
    color: '#FFF',
    fontSize: normalizedFontSize(8),
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: GS.logoGreen,
    borderWidth: 0,
    borderRadius: 5,
    borderColor: GS.logoGreen,
    paddingHorizontal: 20,
    maxHeight: 35,
    height: 35,
    paddingVertical: 2,
  },
});

export default connect(mapStateToProp, mapDispatchToProps)(CouponQuantityPrice);
