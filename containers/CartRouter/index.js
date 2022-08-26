import React from 'react';
import { connect } from 'react-redux';
import Cart from '../../screens/Cart';
import CouponCart from '../CouponCart';
const CartRouter = (props) => {
  const { couponCart } = props;

  if (couponCart && couponCart.coupons.length) {
    return <CouponCart {...props} />;
  }
  return <Cart {...props} />;
};

const mapStateToProp = (state) => {
  return {
    couponCart: state.couponCart,
  };
};

export default connect(mapStateToProp, null)(CartRouter);
