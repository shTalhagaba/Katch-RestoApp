import {
  SHOW_ORDER_LANDING,
  USER_LOCATION,
  LOCATION_PERMISSION,
  SET_ERROR,
  SET_MARKETING_DATA,
  LOCAL_STORAGE,
} from '../../../constants/actionTypes';

const initState = {
  showOrderLanding: false,
  userLoc: false,
  locationPermission: null,
  marketingData: {},
};

const appReducer = (state = initState, action) => {
  if (action.type === SHOW_ORDER_LANDING) {
    return {
      ...state,
      showOrderLanding: action.payload,
    };
  }

  if (action.type === SET_MARKETING_DATA) {
    return {
      ...state,
      marketingData: action.payload,
    };
  }

  if (action.type === LOCAL_STORAGE) {
    return {
      ...state,
      localStorage: action.payload,
    };
  }

  if (action.type === USER_LOCATION) {
    return {
      ...state,
      userLoc: action.payload,
    };
  }

  if (action.type === LOCATION_PERMISSION) {
    return {
      ...state,
      locationPermission: action.payload,
    };
  }

  if (action.type === SET_ERROR) {
    const error = action.payload;
    return {
      ...state,
      error: { ...error },
    };
  }

  return state;
};

export default appReducer;
