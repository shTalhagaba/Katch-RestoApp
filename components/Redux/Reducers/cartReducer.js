import {
  ADD_QUANTITY,
  ADD_TO_CART,
  SUB_QUANTITY,
  CLEAR_CART,
  SET_PAYMENT_METHOD,
  SET_STORE_INFO,
} from '../../../constants/actionTypes';
import currency from 'currency.js';
import { priceSymbol } from '../../../GlobeStyle';
import { ActionSheetIOS } from 'react-native';

const initState = {
  addedItems: [],
  total: '0',
  defaultPaymentMethod: null,
  lastItemNumber: 0,
  storeLocation: null,
  storeInfo: null,
};

const clearCart = (state) => ({
  ...state,
  addedItems: [],
  total: '0',
  lastItemNumber: 0,
  storeLocation: null,
  storeInfo: null,
});

const cartReducer = (state = initState, action) => {
  const total = currency(state.total, {
    precision: 3,
    pattern: `# !`,
    formatWithSymbol: true,
    symbol: priceSymbol,
  });

  if (action.type === ADD_TO_CART) {
    let itemToAdd = action.product;

    //looking for item before adding to cart
    let newTotal = total.add(itemToAdd.price);
    const newCartNum = state.lastItemNumber + 1;
    const itemQty = 1;
    itemToAdd.quantity = itemQty;
    itemToAdd.cartItemNum = newCartNum;

    if (itemToAdd.storeLocation) {
      return {
        ...state,
        addedItems: [...state.addedItems, itemToAdd],
        total: newTotal.format(),
        lastItemNumber: newCartNum,
      };
    } else {
      return {
        ...state,
        addedItems: [...state.addedItems, itemToAdd],
        total: newTotal.format(),
        lastItemNumber: newCartNum,
      };
    }
  }

  if (action.type === ADD_QUANTITY) {
    let itemPrice;
    let cartItems = state.addedItems.map((item) => {
      if (item.cartItemNum === action.cartItemNum) {
        itemPrice = item.price;
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    //only change state if item price has a value
    if (itemPrice) {
      const newTotal = total.add(itemPrice).format();

      return {
        ...state,
        addedItems: cartItems,
        total: newTotal,
      };
    }
  }

  if (action.type === SUB_QUANTITY) {
    let indexOfItem = state.addedItems.findIndex(
      (item) => item.cartItemNum === action.cartItemNum,
    );

    let cartItems;
    let newTotal;
    let item;

    if (indexOfItem !== -1) {
      item = state.addedItems[indexOfItem];

      if (item.quantity === 1) {
        cartItems = state.addedItems.filter(
          (item) => item.cartItemNum !== action.cartItemNum,
        );
      } else {
        let addedItemPrice;
        cartItems = state.addedItems.map((item) => {
          if (item.cartItemNum === action.cartItemNum) {
            addedItemPrice = item.price;
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        });
      }

      if (cartItems.length === 0) {
        return clearCart(state);
      }

      if (item.price) {
        newTotal = total.subtract(item.price).format();

        return {
          ...state,
          addedItems: cartItems,
          total: newTotal,
        };
      }
    }
  }
  if (action.type === SET_STORE_INFO) {
    return {
      ...state,
      storeLocation: action.payload.storeLocation,
      storeInfo: action.payload.storeInfo,
    };
  }

  if (action.type === CLEAR_CART) {
    return clearCart(state);
  }

  if (action.type === SET_PAYMENT_METHOD) {
    return {
      ...state,
      defaultPaymentMethod: action.payload,
    };
  }

  return state;
};
export default cartReducer;
