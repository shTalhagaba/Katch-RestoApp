import {
  SHOW_ORDER_LANDING,
  USER_LOCATION,
  SET_ERROR,
  SET_MARKETING_DATA,
  LOCAL_STORAGE,
} from '../../../constants/actionTypes';

export const showOrderLanding = (payload) => {
  return {
    type: SHOW_ORDER_LANDING,
    payload,
  };
};

export const setMarketingData = (payload) => {
  return {
    type: SET_MARKETING_DATA,
    payload,
  };
};

export const setLocalStorage = (payload) => {
  return {
    type: LOCAL_STORAGE,
    payload,
  };
};

export const userLoc = (payload) => {
  return {
    type: USER_LOCATION,
    payload,
  };
};

export const setError = (payload) => {
  return {
    type: SET_ERROR,
    payload,
  };
};
