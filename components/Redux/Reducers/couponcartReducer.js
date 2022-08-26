import currency from 'currency.js';
import {
  ADD_COUPON_QUANTITY,
  ADD_COUPON_TO_CART,
  CLEAR_COUPON_CART,
  SUB_COUPON_QUANTITY,
} from '../../../constants/actionTypes';
import { priceSymbol } from '../../../GlobeStyle';

const initState = {
  coupons: [],
  total: '0',
  defaultPaymentMethod: null,
  lastItemNumber: 0,
};

const couponCartReducer = (state = initState, action) => {
  const total = currency(state.total, {
    precision: 3,
    pattern: `# !`,
    formatWithSymbol: true,
    symbol: priceSymbol,
  });

  if (action.type === ADD_COUPON_TO_CART) {
    const { coupon } = action;
    coupon.total = 1;
    return {
      ...state,
      coupons: [...state.coupons, JSON.parse(JSON.stringify(coupon))],
      total: total.add(coupon.afterPrice || 0),
    };
  }

  if (action.type === ADD_COUPON_QUANTITY) {
    const { couponCartItemNum } = action;
    let added = false;
    const coupons = state.coupons.map((x) => {
      if (x._id === couponCartItemNum._id) {
        if (x.maxPerTrans === null || x.maxPerTrans >= x.total + 1) {
          added = true;
          x.total = x.total + 1;
        }
      }

      return x;
    });
    return {
      ...state,
      coupons: JSON.parse(JSON.stringify(coupons)),
      total: added ? total.add(couponCartItemNum.afterPrice || 0) : total,
    };
  }

  if (action.type === SUB_COUPON_QUANTITY) {
    const { couponCartItemNum } = action;
    const coupons = state.coupons
      .map((x) => {
        if (x._id === couponCartItemNum._id) {
          x.total = x.total - 1;
          if (x.total === 0) {
            return undefined;
          }
        }

        return x;
      })
      .filter((x) => x);
    if (coupons.length === 0) {
      return initState;
    }
    return {
      ...state,
      coupons: JSON.parse(JSON.stringify(coupons)),
      total: total.subtract(couponCartItemNum.afterPrice || 0),
    };
  }

  if (action.type === CLEAR_COUPON_CART) {
    return initState;
  }

  return state;
};
export default couponCartReducer;
