import {
  ADD_QUANTITY,
  ADD_TO_CART,
  SUB_QUANTITY,
  CLEAR_CART,
  SET_PAYMENT_METHOD,
  SET_STORE_INFO,
} from '../../../constants/actionTypes';

export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    product,
  };
};

export const addQuantity = (cartItemNum) => {
  return {
    type: ADD_QUANTITY,
    cartItemNum,
  };
};

export const subtractQuantity = (cartItemNum) => {
  return {
    type: SUB_QUANTITY,
    cartItemNum,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};

export const setPaymentMethod = (payload) => {
  return {
    type: SET_PAYMENT_METHOD,
    SET_STORE_INFO,
    payload,
  };
};

export const setStoreInfo = (payload) => {
  return {
    type: SET_STORE_INFO,
    payload,
  };
};
