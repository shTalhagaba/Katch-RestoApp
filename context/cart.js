import React, { useRef, useReducer } from 'react';
import { useContext } from 'react';
//3rd party
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { Context as RestaurantContext } from './restaurant';
//others
import {
  addToCart,
  clearCart,
  addQuantity,
  subtractQuantity,
  setStoreInfo,
} from '../components/Redux/Actions/cartActions';
import { askToClearCart } from '../components/Alerts';
import { generateProductImgScr } from '../components/Helpers';

export const Context = React.createContext();

const init = (initialState) => initialState;

const reducer = (state, action) => {
  switch (action.type) {
    case 'dishOptions':
      return {
        ...state,
        dishOptions: action.payload,
      };
    case 'cartItems':
      return {
        ...state,
        cartItems: action.payload,
      };
    case 'scrollTo':
      return {
        ...state,
        scrollTo: action.payload,
      };
    case 'reset':
      return init(action.payload);
    default:
      return state;
  }
};

const initialState = {
  dishOptions: null,
  cartItems: null,
  scrollTo: null,
};

const mapStateToProp = (state) => {
  return {
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch(addToCart(product));
    },
    clearCart: () => {
      dispatch(clearCart());
    },
    addQuantity: (cartItemNum) => {
      dispatch(addQuantity(cartItemNum));
    },
    subtractQuantity: (cartItemNum) => {
      dispatch(subtractQuantity(cartItemNum));
    },
    setStoreInfo: (storeInfo) => {
      dispatch(setStoreInfo(storeInfo));
    },
  };
};

export const Provider = connect(
  mapStateToProp,
  mapDispatchToProps,
)((props) => {
  const { cart, getItem } = props;
  const restaurantContext = useContext(RestaurantContext);
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const list = useRef(null);
  const menuCurrentScrollY = useRef(0);

  const displayDishOptions = (item) => {
    dispatch({
      type: 'dishOptions',
      payload: item,
    });
  };

  const displayCartItems = (item) => {
    dispatch({
      type: 'cartItems',
      payload: item,
    });
  };

  const scrollTo = (section) => {
    dispatch({
      type: 'scrollTo',
      payload: section,
    });
  };

  const itemHasOptions = (item) =>
    item.hasOwnProperty('options') && item.options.length > 0 ? true : false;

  const getCartItem = (item) =>
    cart.addedItems.reduce(
      (acc, cartItem) => {
        if (cartItem.id === item._id && itemHasOptions(item)) {
          acc.quantity = acc.quantity + cartItem.quantity;
          acc.item.push(cartItem);
        } else if (cartItem.id === item._id) {
          acc.quantity = acc.quantity + cartItem.quantity;
          acc.item.push(cartItem);
        }
        return acc;
      },
      {
        quantity: 0,
        item: [],
      },
    );

  const product = (item, shopId, shopName) => ({
    id: item._id,
    imageScr: generateProductImgScr(shopId, item.image),
    name: item.name,
    price: item.price,
    shopId: shopId,
    shopName: shopName,
    options: [],
    category: item.category,
  });

  const storeRestarurantInfoInRedux = (store) => {
    const {
      minDeliveryOrderValue,
      services,
      deliveryRadius,
      mashkorMaxRadius,
      shopName,
      address,
      location,
      image,
      _id,
    } = store;
    // @ts-ignore
    props.setStoreInfo({
      storeLocation: location,
      storeInfo: {
        minDeliveryOrderValue,
        services,
        deliveryRadius,
        mashkorMaxRadius,
        shopName,
        address,
        location,
        image,
        _id,
      },
    });
  };

  const toastOnAdded = () =>
    Toast.show('Added to cart', Toast.SHORT, ['UIAlertController']);
  const addToCart = (item, shopId, shopName) => {
    if (itemHasOptions(item)) {
      const itemWithOption = getItem(item._id);
      displayDishOptions(itemWithOption);
      return false;
    } else {
      if (cart.addedItems.length > 0 && cart.addedItems[0]?.shopId !== shopId) {
        askToClearCart({
          title: 'Replace cart ?',
          fromName: cart.addedItems[0].shopName,
          toName: shopName,
          onConfirm: () => {
            props.clearCart();
            storeRestarurantInfoInRedux(restaurantContext.state.storeInfo);
            props.addToCart(product(item, shopId, shopName));
            toastOnAdded();
            return true;
          },
        });
      } else {
        storeRestarurantInfoInRedux(restaurantContext.state.storeInfo);
        props.addToCart(product(item, shopId, shopName));
        toastOnAdded();
        return true;
      }
    }
    return false;
  };

  const onPlus = (item) => {
    const cartItem = getCartItem(item);
    if (itemHasOptions(item)) {
      if (cartItem.quantity === 0) {
        const itemWithOption = getItem(item._id);
        displayDishOptions(itemWithOption);
        return false;
      } else {
        displayCartItems(cartItem.item);
        return false;
      }
    } else {
      props.addQuantity(cartItem.item[0].cartItemNum);
      return true;
    }
  };

  const onMinus = (item) => {
    const cartItem = getCartItem(item);
    if (itemHasOptions(item)) {
      if (cartItem.quantity === 0) {
        const itemWithOption = getItem(item._id);
        displayDishOptions(itemWithOption);
        return false;
      } else {
        displayCartItems(cartItem.item);
        return false;
      }
    } else {
      props.subtractQuantity(cartItem.item[0].cartItemNum);
      return true;
    }
  };

  const value = {
    state,
    ref: {
      list,
      menuCurrentScrollY,
    },
    actions: {
      addToCart,
      getCartItem,
      onMinus,
      onPlus,
      displayDishOptions,
      displayCartItems,
      scrollTo,
      storeRestarurantInfoInRedux,
    },
    cartItems: cart.addedItems,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
});

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {(context) => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}
