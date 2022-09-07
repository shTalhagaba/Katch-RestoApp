import { useLazyQuery,useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
//others
import { GET_PROMO_CODES, GET_STORE } from '../components/GraphQL';
import RestPromoModal from '../containers/RestPromoModal';
import Loading from '../screens/Restaurant/MainScreen/Loading';
import NoStore from '../screens/Restaurant/MainScreen/NoStore';
import ImageBulkLoader from '../native_modules/imageBulkLoader';
import { generateProductImgScr } from '../components/Helpers';

export const Context = React.createContext({
  state: undefined,
  actions: undefined,
});

export const Provider = ({ navigation, route, ...props }) => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [productList, setProductList] = useState([]);
  const [cartItems, setCartItems] = useState(null);
  const [promoCodeInfo, setPromoCodeInfo] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [headersIndex, setHeadersIndex] = useState([]);
  const [menu, setMenu] = useState([]);
  const [noStore, setNoStore] = useState(null);
  const [getStore, { refetch }] = useLazyQuery(GET_STORE, {
    variables: { id: route.params.id },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (query) => {
      if (query.getStore._id === null) {
        setNoStore(true);
        return;
      }
      setStoreInfo(query.getStore);
      setNoStore(false);

      const products = query.getStore.products.reduce((acc, data, index) => {
        acc.push(...[{ title: data._id }, ...data.products]);
        return acc;
      }, []);

      const headerIndex = products.reduce((acc, data, index) => {
        if (data.hasOwnProperty('title')) {
          acc.push(index + 1);
        }
        return acc;
      }, []);

      const menuList = query.getStore.products.map((data, index) => {
        return {
          title: data._id,
          length: data.products.length,
          index: headerIndex[index] - 1,
        };
      }, []);

      setMenu(menuList);

      setHeadersIndex(headerIndex);

      setProductList(products);
    },
  });

  useEffect(() => {
    if (storeInfo !== null) {
      onRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.id]);

  const getPromoCodes = useQuery(GET_PROMO_CODES, {
    variables: { restId: route.params.id },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (query) => {
      setPromoCodes(query.getPromoCodes);
    },
  });

  //gets a single product from the products list by matching ids
  const getSingleProduct = (store, productId) => {
    let match;
    match = null;
    let categories = store.products;
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].products.length; j++) {
        let item = categories[i].products[j];
        if (item._id === productId) return item;
      }
    }
  };

  const getItem = (productId) => {
    return getSingleProduct(storeInfo, productId);
  };

  const onRefresh = (callBack) => {
    setStoreInfo(null);
    refetch({ id: route.params.id });
    getPromoCodes.refetch({ restId: route.params.id });
    refetch({ id: route.params.id });
    callBack && callBack();
  };

  const togglePromoCodeModal = (promoInfo) => {
    if (promoCodeInfo === null) {
      setPromoCodeInfo(promoInfo);
    } else {
      setPromoCodeInfo(null);
    }
  };

  const preloadProductImages = () => {
    try {
      const imageName = storeInfo.products.flatMap((x) =>
        x.products.map((y) =>
          generateProductImgScr(storeInfo._id, y.image),
        ),
      );
      ImageBulkLoader.load(JSON.stringify(imageName))
        .then(console.log)
        .catch(console.log);
    } catch{}
  }

  const value = {
    state: {
      storeInfo,
      productList,
      cartItems,
      promoCodes,
      headersIndex,
      menu,
    },
    actions: {
      togglePromoCodeModal,
      onRefresh,
      getStore,
      getItem,
      setCartItems,
      preloadProductImages,
    },
  };

  return (
    <Context.Provider value={value}>
      {/* {noStore === false ? props.children : null} */}
      {props.children}
      <Modal
        animationType="slide"
        transparent={true}
        visible={promoCodeInfo !== null}
        onRequestClose={togglePromoCodeModal}>
        <RestPromoModal
          promo={promoCodeInfo}
          toggleModal={togglePromoCodeModal}
        />
      </Modal>
      <Loading show={storeInfo && noStore === false} navigation={navigation} />
      <NoStore show={noStore === true} navigation={navigation} />
    </Context.Provider>
  );
};

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {*} Component - A React component.
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
