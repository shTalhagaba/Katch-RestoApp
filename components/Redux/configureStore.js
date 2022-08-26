import { createStore, combineReducers, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { reactotron } from '../../config/reactotron';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cartReducer from './Reducers/cartReducer';
import appReducer from './Reducers/appReducer';
import userReducer from './Reducers/userReducer';
import couponCartReducer from './Reducers/couponcartReducer';

const middleWares = [];

if (__DEV__) {
  const reactotronMiddleware = reactotron.createEnhancer();
  middleWares.push(reactotronMiddleware);
}

const rootReducer = combineReducers({
  cart: cartReducer,
  app: appReducer,
  user: userReducer,
  couponCart: couponCartReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default (callback) => {
  let store = createStore(persistedReducer, compose(...middleWares));

  let persistor = persistStore(store, null, callback);

  return { store, persistor };
};
