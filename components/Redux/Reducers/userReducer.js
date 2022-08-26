import {
  SET_BOOKMARKS,
  REMOVE_BOOKMARK_FROM_STATE,
  ADD_BOOKMARK_TO_STATE,
  CLEAR_BOOKMARKS,
  HYDRATE_USER_ADDRESSES,
  SET_SECLECTED_ADDRESS,
  SET_SELECTED_SERVICE,
  REST_USER_STATE,
  HYDRATE_USER_WALLET,
} from '../../../constants/actionTypes';

const initState = {
  bookmarks: {},
  addresses: null,
  selectedAddress: null,
  selectedService: null,
  wallet: {
    wallet: {
      walletTotal: 0,
    },
  },
};

const userReducer = (state = initState, action) => {
  if (action.type === SET_BOOKMARKS) {
    const bookmarks = JSON.parse(action.payload);
    return {
      ...state,
      bookmarks,
    };
  }

  if (action.type === REMOVE_BOOKMARK_FROM_STATE) {
    const storeId = action.payload;
    const newBookmarks = state.bookmarks;

    delete newBookmarks[storeId];

    return {
      ...state,
      bookmarks: newBookmarks,
    };
  }

  if (action.type === ADD_BOOKMARK_TO_STATE) {
    const storeId = action.payload;
    const newBookmarks = Object.assign(state.bookmarks, {
      [storeId]: true,
    });

    return {
      ...state,
      bookmarks: newBookmarks,
    };
  }

  if (action.type === HYDRATE_USER_ADDRESSES) {
    return {
      ...state,
      addresses: action.payload,
    };
  }

  if (action.type === HYDRATE_USER_WALLET) {
    return {
      ...state,
      wallet: action.payload,
    };
  }

  if (action.type === SET_SECLECTED_ADDRESS) {
    return {
      ...state,
      selectedAddress: action.payload,
    };
  }

  if (action.type === SET_SELECTED_SERVICE) {
    return {
      ...state,
      selectedService: action.payload,
    };
  }

  if (action.type === CLEAR_BOOKMARKS) {
    return {
      ...state,
      bookmarks: {},
    };
  }

  if (action.type === REST_USER_STATE) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
};

export default userReducer;
