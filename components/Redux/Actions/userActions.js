import {
  SET_BOOKMARKS,
  REMOVE_BOOKMARK_FROM_STATE,
  ADD_BOOKMARK_TO_STATE,
  CLEAR_BOOKMARKS,
  HYDRATE_USER_ADDRESSES,
  SET_SECLECTED_ADDRESS,
  CLEAR_USER_ADDRESSES,
  SET_SELECTED_SERVICE,
  REST_USER_STATE,
  HYDRATE_USER_WALLET,
} from '../../../constants/actionTypes';

export const setBookmarks = (payload) => {
  return {
    type: SET_BOOKMARKS,
    payload,
  };
};

export const clearBookmarks = () => {
  return {
    type: CLEAR_BOOKMARKS,
  };
};

export const addBookmarkToState = (payload) => {
  return {
    type: ADD_BOOKMARK_TO_STATE,
    payload,
  };
};

export const removeBookmarkFromState = (payload) => {
  return {
    type: REMOVE_BOOKMARK_FROM_STATE,
    payload,
  };
};

export const hydrateUserAddresses = (payload) => {
  return {
    type: HYDRATE_USER_ADDRESSES,
    payload,
  };
};

export const hydrateUserWallet = (payload) => {
  return {
    type: HYDRATE_USER_WALLET,
    payload,
  };
};

export const clearUserAddresses = (payload) => {
  return {
    type: CLEAR_USER_ADDRESSES,
  };
};

export const setSelectedAddress = (payload) => {
  return {
    type: SET_SECLECTED_ADDRESS,
    payload,
  };
};

export const setSelectedService = (payload) => {
  return {
    type: SET_SELECTED_SERVICE,
    payload,
  };
};

export const resetUserState = (payload) => {
  return {
    type: REST_USER_STATE,
    payload,
  };
};
