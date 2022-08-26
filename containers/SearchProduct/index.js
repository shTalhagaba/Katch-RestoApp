//react
import { Viewport } from '@skele/components';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  StatusBar,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
// import Modal from 'react-native-modal';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PRODUCT_NOT_AVAILABLE, SEARCH_BUTTON } from '../../assets/images';
import { animateLayout } from '../../components/Helpers';
import ProductsItem from '../../components/RestProduct';
import ListHeader from '../../components/RestProduct/listHeader';
//others
import { BoldText, RText } from '../../GlobeStyle';
import style from './styles';
const windowHeight = Dimensions.get('window').height;

const SearchProduct = ({
  showSearchProductModal,
  setShowSearchProductModal,
  productList,
  translateY,
  storeInfo,
  setCartItems,
  navigation,
  route,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredProduct, setFilteredProduct] = useState(null);
  const searchInputRef = useRef(null);

  const searchProduct = () => {
    if (searchText.trim() === '') {
      setFilteredProduct(null);
      return;
    }
    const categoryMap = {}; // Map to keep track of empty category
    const _productList = JSON.parse(JSON.stringify(productList));
    setFilteredProduct(
      _productList
        .filter((element) => {
          if (!element.title) {
            if (element.name.toLowerCase().includes(searchText.toLowerCase())) {
              categoryMap[element.category] = 1;
              return true;
            }
            return false;
          }
          return true;
        })
        .filter((item) => {
          if (item.title) {
            return categoryMap[item.title];
          }
          return true;
        }),
    );
  };

  useEffect(() => {
    if (showSearchProductModal) {
      // issue regarding ref.current.focus() not showing keyboard
      // https://github.com/software-mansion/react-native-screens/issues/472#issuecomment-843122746
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [showSearchProductModal]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    animateLayout()
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const renderRow = ({ item, index }) => {
    return item.hasOwnProperty('title') ? (
      <ListHeader
        index={index}
        route={route}
        navigation={navigation}
        key={`${item.title} ${index}`}
        title={item.title}
        translateY={translateY}
      />
    ) : (
      <ProductsItem
        route={route}
        navigation={navigation}
        key={`${item._id} ${index}`}
        shopName={storeInfo.shopName}
        shopId={storeInfo._id}
        item={item}
        storeInfo={storeInfo}
        setCartItems={setCartItems}
        showDivider={index < filteredProduct.length - 1}
      />
    );
  };

  return (
    <Modal
      onDismiss={() => setShowSearchProductModal(false)}
      visible={showSearchProductModal}
      style={style.modalWrapper}>
      <SafeAreaView
        style={[
          style.container,
          isKeyboardVisible
            ? {
                height: windowHeight - StatusBar.currentHeight - keyboardHeight,
              }
            : {},
        ]}>
        <View style={style.header}>
          <BoldText style={style.headerText}>Search</BoldText>
          <TouchableOpacity
            onPress={() => setShowSearchProductModal(false)}
            style={style.closeButton}>
            <MCIcon name="close" color="#fff" size={18} />
          </TouchableOpacity>
        </View>
        <View style={[style.modalContent]}>
          <View style={style.searchView}>
            <View style={style.textInputView}>
              <TextInput
                style={style.textInput}
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                placeholder={'Search your menu'}
                ref={searchInputRef}
                onSubmitEditing={() => searchProduct()}
              />
            </View>
            <TouchableOpacity onPress={() => searchProduct()}>
              <Image source={SEARCH_BUTTON} style={style.searchButton} />
            </TouchableOpacity>
          </View>
          {filteredProduct && filteredProduct.length !== 0 && (
            <Viewport.Tracker>
              <FlatList
                data={filteredProduct}
                style={style.scrollView}
                keyExtractor={(item) => item.title || item._id}
                renderItem={renderRow}
              />
            </Viewport.Tracker>
          )}

          {filteredProduct && filteredProduct.length === 0 && (
            <View style={style.noProduct}>
              <Image
                source={PRODUCT_NOT_AVAILABLE}
                resizeMode={'cover'}
                style={style.image}
              />
              <RText style={style.noProductText}>
                Sorry, Couldn't find any matching item.
              </RText>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default memo(SearchProduct);

export const SearchProductButton = ({
  showSearchProductModal,
  setShowSearchProductModal,
  goToCartVisible,
}) => {
  return (
    <Animated.View
      style={[
        style.menuButtonContainer,
        { bottom: goToCartVisible ? 55 : 10 },
      ]}>
      <TouchableOpacity onPress={() => setShowSearchProductModal(true)}>
        <View style={style.menuText}>
          <FAIcon color={'#fff'} name="search" size={20} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
