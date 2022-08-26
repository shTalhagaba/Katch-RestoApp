import {
  ADD_COUPON_TO_CART,
  SUB_COUPON_QUANTITY,
  ADD_COUPON_QUANTITY,
  CLEAR_COUPON_CART,
} from '../../../constants/actionTypes';

export const addCouponToCart = (coupon) => {
  return {
    type: ADD_COUPON_TO_CART,
    coupon,
  };
};

export const addCouponQuantity = (couponCartItemNum) => {
  return {
    type: ADD_COUPON_QUANTITY,
    couponCartItemNum,
  };
};

export const subtractCouponQuantity = (couponCartItemNum) => {
  return {
    type: SUB_COUPON_QUANTITY,
    couponCartItemNum,
  };
};

export const clearCouponCart = () => {
  return {
    type: CLEAR_COUPON_CART,
  };
};
