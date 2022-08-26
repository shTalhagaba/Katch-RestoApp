/* eslint-disable react-native/no-inline-styles */
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import auth from '@react-native-firebase/auth';
import { default as Lottie, default as LottieView } from 'lottie-react-native';
import { MFSettings, MFTheme } from 'myfatoorah-reactnative';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal as ModalNative,
  Platform,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  default as ADIcon,
  default as AntIcon,
} from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  default as MIcon,
  default as MIIcon,
} from 'react-native-vector-icons/MaterialIcons';
//3rd party
import SIcon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CASH, CREDIT_CARD, K_NET, PROMO } from '../../assets/images';
//others
import {
  CheckMark,
  DeliveryDrone,
  EmptyCart,
  MealReady,
} from '../../assets/Lottie';
import {
  askDefaultPaymentMethod,
  onlinePaymentError,
  onStoreClosed,
  selectPayment,
} from '../../components/Alerts';
import Card from '../../components/CartItem';
import {
  CHECK_STORE_STATUS,
  CREATE_ORDER,
  GET_APP_CONFIGS,
  GET_PAYMENT_METHODS,
  GET_PROMO_CODES,
  GET_USER_ADDRESS,
  VERIFY_PROMO_CODE,
} from '../../components/GraphQL';
import ProgressLoading from '../../components/Loading/ProgressLoading';
import MFActions from '../../components/MFActions';
import { showOrderLanding } from '../../components/Redux/Actions/appActions';
import {
  clearCart,
  setPaymentMethod,
} from '../../components/Redux/Actions/cartActions';
import { setSelectedService as _setSelectedService } from '../../components/Redux/Actions/userActions';
import method from '../../constants/paymentMethod';
import serviceTypes from '../../constants/serviceTypes';
import {
  onlinePayments as onlinePaymentsText,
  promos as promoText,
} from '../../constants/staticText';
import AddressList from '../../containers/AddressListModal';
import CartPromoModal from '../../containers/CartPromoModal';
//others
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  priceSymbol,
  RText,
  TextBasic,
  ActionButton as CheckOutButton,
  ActionButtonDisabled as CheckOutButtonDisabled,
} from '../../GlobeStyle';
import styles from './styles';
import IOIcon from 'react-native-vector-icons/Ionicons';

const paymentMethods = [
  {
    methodId: 0,
    methodName: 'Cash',
    type: 'cash',
    imageSrc: CASH,
  },
  {
    methodId: 1,
    methodName: 'KNET',
    type: 'knet',
    imageSrc: K_NET,
  },
  {
    methodId: 2,
    methodName: 'Visa / Master',
    type: 'cc',
    imageSrc: CREDIT_CARD,
  },
];

const orderMethods = [
  {
    methodId: 0,
    methodName: serviceTypes.pickUp,
    type: 'cash',
    imageSrc: CASH,
  },
  {
    methodId: 1,
    methodName: serviceTypes.delivery,
    type: 'cash',
    imageSrc: CASH,
  },
];

const Cart = ({ navigation, ...props }) => {
  if (props.items.length > 0) {
    const storeId = props.items[0].shopId;
    const storeName = props.items[0].shopName;
    const storeInfo = props.storeInfo;
    const items = props.items.map((item) => {
      return {
        _id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: `${item.price}`,
        options: item.options,
      };
    });

    const paymentActions = useRef(new MFActions()).current;
    const { selectedService, setSelectedService } = props;
    /**** state *****/

    const [isLoading, setIsLoading] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');
    const [showPaymentSelection, setShowPaymentSelection] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
    const [storePaymentMethods, setStorePaymentMethods] = useState(null);
    const [viewPromoCodes, setViewPromoCodes] = useState(false);
    const [promoCodes, setPromoCodes] = useState(null);
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [notifyCodeApplied, setNotifyCodeApplied] = useState(false);
    const [cartTotal, setCartTotal] = useState(props.total);
    const [error, setError] = useState('');
    const [invoiceId, setInvoiceId] = useState(null);
    const [promoValue, setPromoValue] = useState(null);
    const [cart, setCart] = useState({
      storeId,
      storeName,
      total: props.total,
      orderRating: 0,
      items: items,
      orderNotes,
      paymentMethod: method[paymentMethod.type],
      orderStatus: 'Pending',
    });

    // ORDER METHODS
    const [showOrderSelection, setShowOrderSelection] = useState(false);
    const [orderMethod, setOrderMethod] = useState(orderMethods[0]);
    const [addressList, setAddressList] = useState(null);

    //Address States
    const [viewAddressListModal, setViewAddressListModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [discountedAmt, setDiscountedAmt] = useState('');
    const toggleViewAddressListModal = () =>
      setViewAddressListModal(!viewAddressListModal);
    const addressChange = (address) => {
      setViewAddressListModal(false);
      setSelectedAddress(address);
      setOrderMethod(orderMethods[1]);
      toggleOrderSelection();
    };
    /*
      Fetch AddressList
    */
    // Get Loggedin User Address
    const [getAddressList, { loading: addressListLoading }] = useLazyQuery(
      GET_USER_ADDRESS,
      {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
        onCompleted: (query) => {
          setAddressList(query.getUserAddresses);
        },
      },
    );

    // useEffect(() => {
    //   getAddressList();
    // },[])

    /**** state ****/

    /**** graphql ****/

    const [createOrder] = useMutation(CREATE_ORDER);
    const [getToken] = useMutation(GET_APP_CONFIGS);
    const [verifyPromoCode] = useMutation(VERIFY_PROMO_CODE);

    useQuery(GET_PAYMENT_METHODS, {
      fetchPolicy: 'network-only',
      variables: { storeId },
      onCompleted: (data) => {
        setStorePaymentMethods(data.getPaymentMethods);
        const method = defaultPaymentMethod(data.getPaymentMethods);
        setPaymentMethod(method);
      },
    });

    useQuery(GET_PROMO_CODES, {
      variables: { restId: props.items[0].shopId },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      onCompleted: (query) => {
        setPromoCodes(query.getPromoCodes);
      },
    });

    const [getStorStatus] = useLazyQuery(CHECK_STORE_STATUS, {
      variables: { id: storeId },
      fetchPolicy: 'network-only',
      onCompleted: ({ getStore }) => {
        if (getStore.isOpen && !getStore.busyMode) {
          placeOrder();
        } else {
          onStoreClosed({
            shopName: props.items[0].shopName,
            onConfirm: () => setIsLoading(false),
            isBusy: getStore.busyMode,
          });
        }
      },
      onError: () => {
        setIsLoading(false);
      },
    });

    /**** graphql ****/

    /**** useEffect ****/

    useEffect(() => {
      setCart((state) => {
        state.items = items;
        return state;
      });
    }, [props.items]);

    useEffect(() => {
      if (appliedPromo) {
        onCodeApplied(appliedPromo);
      } else {
        setCartTotal(props.total);
      }

      if (appliedPromo) {
        if (appliedPromo.type.minOrder !== null) {
          const minOrder = parseFloat(appliedPromo.type.minOrder);
          const totalOrders = parseFloat(props.total);
          //If minOrder  or totalOrders is NaN, remove promocode
          if (isNaN(minOrder) || isNaN(totalOrders) || totalOrders < minOrder) {
            removePromoCode();
          }
        }
      }
    }, [props.total]);

    useEffect(() => {
      setCart((state) => {
        state.paymentMethod = method[paymentMethod.type];
        return state;
      });
    }, [paymentMethod]);

    useEffect(() => {
      if (invoiceId) {
        submitOrder(invoiceId);
      }
    }, [invoiceId]);

    /**** useEffect ****/

    /**** functions ****/

    const removePromoCode = () => {
      setAppliedPromo(null);
      setCartTotal(props.total);
      setPromoValue(null);
    };

    function defaultPaymentMethod(methods) {
      if (methods) {
        if (props.defaultPaymentMethod) {
          if (
            methods.paymentMethods.includes(props.defaultPaymentMethod.type)
          ) {
            return props.defaultPaymentMethod;
          } else {
            const acceptingMethods = paymentMethods.filter((method) =>
              methods.paymentMethods.includes(method.type),
            );

            selectPayment({
              title: `We know you prefer ${props.defaultPaymentMethod.methodName} payments`,
              message: `\n${storeName} does not accept ${props.defaultPaymentMethod.methodName} payments. \n\nPlease select one of the following payment methods`,
              methods: acceptingMethods.map((method) => {
                return {
                  text: method.methodName,
                  onPress: () => {
                    setPaymentMethod(method);
                  },
                };
              }),
            });
          }
        }
      }
      return props.defaultPaymentMethod
        ? props.defaultPaymentMethod
        : paymentMethods[0];
    }

    const placeOrder = () => {
      if (paymentMethod.methodId === 0) {
        submitOrder();
      } else {
        getToken()
          .then(({ data: { appConfigs } }) => {
            if (appConfigs.paymentKey === null) {
              throw null;
            } else if (
              parseFloat(cartTotal) <
              JSON.parse(appConfigs.paymentKey).minAmount
            ) {
              throw {
                code: 'minAmount',
                amount: JSON.parse(appConfigs.paymentKey).minAmount,
              };
            } else {
              const url = JSON.parse(appConfigs.paymentKey).baseUrl;
              const key = JSON.parse(appConfigs.paymentKey).key;
              let theme = new MFTheme('blue', 'gray', 'Payment', 'Cancel');
              MFSettings.sharedInstance.setTheme(theme);
              MFSettings.sharedInstance.configure(url, key);
            }
          })
          .then(() => {
            const request = paymentActions.executeRequestJson({
              total: cartTotal,
              paymentMethodId: paymentMethod.methodId,
              vendorID: storePaymentMethods.vendorID,
              storeName,
            });

            paymentActions.executePayment({
              request,
              navigation,
              onBeforeRequest: () => {
                setIsLoading(false);
              },
              onError: ({ error }) => {
                setIsLoading(false);
                if (
                  error.includes('Transaction') &&
                  error !== 'Transaction canceled!'
                ) {
                  alert(error);
                } else {
                  alert('An error has occurred with your transaction!');
                }
              },
              onSuccess: (invoiceId) => {
                setInvoiceId(invoiceId);
                setIsLoading(true);
              },
            });
          })
          .catch((error) => {
            if (error.code === 'minAmount') {
              onlinePaymentError({
                title: onlinePaymentsText.error.minAmount.title,
                message: onlinePaymentsText.error.minAmount.message(
                  error.amount.toFixed(3),
                ),
                onConfirm: () => null,
              });
            } else {
              onlinePaymentError({
                title: onlinePaymentsText.error.default.title,
                message: onlinePaymentsText.error.default.message,
                onConfirm: () => null,
              });
            }
            setIsLoading(false);
          });
      }
    };

    const submitOrder = async (invoiceId = null) => {
      try {
        //Error is thrown already if cartTotal is null
        const total = parseFloat(cartTotal).toFixed(3);

        // createOrder change value here
        const { data } = await createOrder({
          variables: {
            NewOrderInputs: {
              ...cart,
              promoCode: appliedPromo ? appliedPromo.code : '',
              total: total,
              invoiceId,
              orderType: orderMethod
                ? orderMethod.methodName
                : serviceTypes.pickUp,
              userAddressID: selectedAddress ? selectedAddress._id : '',
            },
          },
        });

        if (data.createOrder) {
          setIsLoading(false);
          props.clearCart();
          props.showOrderLanding(true);
          navigation.setParams({ newOrder: true });
          navigation.navigate('OrderSummary', {
            orderId: data.createOrder._id,
          });
        }
      } catch (error) {
        const unknownErrorMessage =
          'Sorry, it looks like we ran into an issue and cant take your order at the moment.';
        setError(errorHandler(error, appliedPromo, unknownErrorMessage));
        setIsLoading(false);
      }
    };

    const _onCheckout = () => {
      setError('');
      if (auth().currentUser) {
        navigation.navigate('Checkout', {
          total: cartTotal,
          appliedPromo: appliedPromo,
          orderNotes: orderNotes,
          promoValue: promoValue,
        });
        return;
      } else {
        navigation.navigate('Account', {
          screen: 'Login',
          cameFrom: () => {
            navigation.goBack();
          },
        });
      }
    };

    const _onAddItems = () => {
      navigation.navigate('Rest', {
        screen: 'Menu',
        id: props.items[0].shopId,
      });
    };

    const togglePromoCodeModal = () => {
      setViewPromoCodes(!viewPromoCodes);
    };

    const applyCode = (code, promo) => {
      return verifyPromoCode({ variables: { promoCode: code, sellerId: storeId } })
        .then(({ data }) => {
          if (data.verifyPromoCode) {
            const minOrderAmount = data.verifyPromoCode.type.minOrder;
            const isMinOrderLessThenTotal =
              parseFloat(minOrderAmount) <= parseFloat(props.total);

            if (minOrderAmount === null || isMinOrderLessThenTotal) {
              setNotifyCodeApplied(true);
              const mergeProperties = {
                ...data.verifyPromoCode,
                ...promo,
              };
              setAppliedPromo(mergeProperties);

              togglePromoCodeModal();
              setInterval(() => {
                if (notifyCodeApplied) {
                  setNotifyCodeApplied(false);
                }
              }, 100);
              onCodeApplied(mergeProperties);
            } else {
              throw {
                message: 'minOrder',
                minOrder: minOrderAmount,
              };
            }
          }
        })
        .catch((err) => {
          if (err.message === 'minOrder') {
            throw errorHandler(
              { message: err.message },
              { minOrder: err.minOrder },
            );
          }

          throw errorHandler(err, promo);
        });
    };

    let calculateNewDiscountTotal = (n, promo, returnRemovedAmt = false) => {
      let newTotal;

      const removeAmount = n;

      const maxLimit = isNaN(parseFloat(promo.type.maxLimit))
        ? null
        : parseFloat(promo.type.maxLimit);

      if (returnRemovedAmt) {
        return removeAmount;
      }

      if (maxLimit && maxLimit < removeAmount) {
        newTotal = parseFloat(props.total) - maxLimit;
      } else {
        newTotal = parseFloat(props.total) - removeAmount;
      }

      return `${newTotal.toFixed(3)} ${priceSymbol}`;
    };

    let calculateNewFlatTotal = (promo) => {
      let newTotal = parseFloat(props.total) - parseFloat(promo.type.value);

      return `${newTotal.toFixed(3)} ${priceSymbol}`;
    };

    const onCodeApplied = (promo) => {
      if (promo.type.name === 'Discount') {
        if (!promo.cashback) {
          const discountAmount =
            (parseFloat(promo.type.value) / 100) * parseFloat(props.total);
          setDiscountedAmt(discountAmount);
          setCartTotal(calculateNewDiscountTotal(discountAmount, promo));
        } else {
          const discountAmount =
            (parseFloat(promo.type.value) / 100) * parseFloat(props.total);
          setDiscountedAmt(discountAmount);
          setCartTotal(`${parseFloat(props.total).toFixed(3)} ${priceSymbol}`);
        }
      } else if (promo.type.name === 'Flat') {
        if (!promo.cashback) {
          setCartTotal(calculateNewFlatTotal(promo));
        } else {
          setCartTotal(`${parseFloat(props.total).toFixed(3)} ${priceSymbol}`);
        }
      }
    };

    const togglePaymentSelection = () => {
      setShowPaymentSelection(!showPaymentSelection);
    };

    const toggleOrderSelection = () => {
      setShowOrderSelection(!showOrderSelection);
    };

    const changeOrderMethod = (index) => {
      if (index === 1) {
        getAddressList();
        toggleViewAddressListModal();
      } else {
        setOrderMethod(orderMethods[index]);
        toggleOrderSelection();
      }
    };

    const changePaymentMethod = (methodIndex) => {
      setPaymentMethod(paymentMethods[methodIndex]);
      askDefaultPaymentMethod({
        paymentType: paymentMethods[methodIndex].methodName,
        onConfirm: () => {
          togglePaymentSelection();
          props.setPaymentMethod(paymentMethods[methodIndex]);
        },
        onReject: () => togglePaymentSelection(),
      });
    };

    const [minimumError, setMinimumError] = useState(false);

    /**** functions ****/

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            paddingHorizontal: 20,
            paddingBottom: 3,
            marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 2,
              borderColor: GS.textColorGrey1,
              borderRadius: 7,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingLeft: 0, paddingRight: 15 }}>
              <IOIcon
                name="md-arrow-back"
                size={30}
                color={GS.secondaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={_onAddItems} style={{ flex: 1 }}>
              <TextBasic
                style={{
                  fontSize: normalizedFontSize(9),
                  fontFamily: customFont.axiformaMedium,
                  color: GS.textColorGreyDark3,
                }}>
                {props?.items[0]?.shopName}
              </TextBasic>
            </TouchableOpacity>
            <ADIcon
              onPress={() => props.clearCart()}
              name="delete"
              size={25}
              color={GS.textColorGreyDark2}
            />
          </View>
          <Header
            noteValue={orderNotes}
            setOrderNotes={setOrderNotes}
            goBack={() => navigation.goBack()}
          />
          <FlatList
            data={props.items}
            renderItem={({ item }) => <Card {...item} {...props} />}
            keyExtractor={(item, index) => index + item.id + item.cartItemNum}
          />
          <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
            <Footer
              discountedAmt={discountedAmt}
              error={error}
              promo={appliedPromo}
              paymentMethod={paymentMethod}
              removePromo={removePromoCode}
              setPromoValue={setPromoValue}
              realTotal={props.total}
              total={cartTotal}
              togglePromoCodeModal={togglePromoCodeModal}
              togglePaymentSelection={togglePaymentSelection}
              toggleOrderSelection={toggleOrderSelection}
              orderMethod={orderMethod}
              toggleViewAddressListModal={toggleViewAddressListModal}
              selectedAddress={selectedAddress}
              selectedService={selectedService}
              updateSelectedService={setSelectedService}
              storeInfo={storeInfo}
              setMinimumError={setMinimumError}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AddItemsButton
                onPress={_onAddItems}
                style={{ backgroundColor: GS.textColorGrey1 }}>
                <RText
                  style={{
                    color: GS.textColorGreyDark3,
                    fontSize: normalizedFontSize(8),
                  }}
                  fontName={customFont.axiformaMedium}>
                  Add items
                </RText>
              </AddItemsButton>

              {minimumError ? (
                <CheckOutButtonDisabled>
                  <RText
                    style={{
                      color: 'white',
                      fontSize: normalizedFontSize(8),
                    }}
                    fontName={customFont.axiformaMedium}>
                    Check Out
                  </RText>
                </CheckOutButtonDisabled>
              ) : (
                <CheckOutButton onPress={_onCheckout}>
                  <RText
                    style={{
                      color: 'white',
                      fontSize: normalizedFontSize(8),
                    }}
                    fontName={customFont.axiformaMedium}>
                    Check Out
                  </RText>
                </CheckOutButton>
              )}
            </View>
          </View>

          {/* Promo Codes  Modal*/}
          <ModalNative
            animationType="slide"
            transparent={true}
            visible={viewPromoCodes}
            onRequestClose={togglePromoCodeModal}>
            <CartPromoModal
              appliedPromo={appliedPromo}
              applyCode={applyCode}
              promoCodes={promoCodes}
              toggleModal={togglePromoCodeModal}
            />
          </ModalNative>
          {/* Promo Codes  Modal*/}

          <ModalNative
            animationType="slide"
            transparent={true}
            visible={viewAddressListModal}
            onRequestClose={toggleViewAddressListModal}>
            <AddressList
              toggleModal={toggleViewAddressListModal}
              showModal={setViewAddressListModal}
              addressList={addressList}
              selectedAddress={addressChange}
              getAddressList={getAddressList}
              loading={addressListLoading}
              navigation={navigation}
            />
          </ModalNative>
        </View>
        <ModalNative
          animationType="none"
          transparent={true}
          visible={false}
          onRequestClose={() => setNotifyCodeApplied(false)}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => setNotifyCodeApplied(false)}
              activeOpacity={1}
              style={{
                backgroundColor: '#000000',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                position: 'absolute',
                overflow: 'hidden',
              }}>
              <LottieView
                source={CheckMark}
                autoPlay
                loop={false}
                style={{ height: 200, width: 200, backgroundColor: 'red' }}
              />
              <View style={{ backgroundColor: 'blue', height: 70 }} />
            </View>
          </View>
        </ModalNative>
        {isLoading && <ProgressLoading />}

        <PaymentMethodSelection
          storePaymentMethods={storePaymentMethods}
          togglePaymentSelection={togglePaymentSelection}
          showPaymentSelection={showPaymentSelection}
          changePaymentMethod={changePaymentMethod}
        />
        <OrderMethodSelection
          storePaymentMethods={storePaymentMethods}
          changeOrderMethod={changeOrderMethod}
          toggleOrderSelection={toggleOrderSelection}
          showOrderSelection={showOrderSelection}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <View
        style={{
          flex: Platform.OS === 'android' ? 0.7 : 0.85,
          paddingTop: Platform.OS === 'android' ? 24 : 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 15 }}>
          <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? 24 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LottieView
            source={EmptyCart}
            loop={false}
            autoPlay={true}
            resizeMode="cover"
            style={{
              width: 300,
              height: 300,
            }}
          />
          <BoldText style={{ fontSize: 35, color: GS.secondaryColor }}>
            Your cart is empty
          </BoldText>
        </View>
      </View>
    );
  }
};

const AddItemsButton = styled.TouchableOpacity`
  height: 45px;
  flex: 1;
  margin: 5px 5px 5px 0px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const mapStateToProps = (state) => {
  return {
    items: state.cart.addedItems,
    total: state.cart.total,
    defaultPaymentMethod: state.cart.defaultPaymentMethod,
    selectedService: state.user.selectedService,
    storeInfo: state.cart.storeInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => {
      dispatch(clearCart());
    },
    showOrderLanding: (boolean) => {
      dispatch(showOrderLanding(boolean));
    },
    setPaymentMethod: (payload) => {
      dispatch(setPaymentMethod(payload));
    },
    setSelectedService: (payload) => {
      dispatch(_setSelectedService(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const Header = ({ noteValue, setOrderNotes }) => {
  return (
    <View
      style={{
        marginVertical: 10,
        backgroundColor: GS.textColorGrey1,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 7,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          paddingLeft: 20,
        }}>
        <SIcon name="notebook" size={20} color="gray" />
      </View>
      <TextInput
        allowFontScaling={false}
        value={noteValue}
        onChangeText={(text) => setOrderNotes(text)}
        placeholder="Order Notes"
        placeholderTextColor={GS.textColorGreyDark3}
        style={{
          height: 40,
          flex: 1,
          marginRight: 10,
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: GS.textColorGrey1,
          paddingHorizontal: 10,
          color: GS.textColorGreyDark3,
          fontFamily: customFont.axiformaRegular,
          fontSize: normalizedFontSize(7),
        }}
      />
    </View>
  );
};

const Footer = (props) => {
  const {
    togglePromoCodeModal,
    error,
    total,
    realTotal,
    promo,
    removePromo,
    selectedService,
    updateSelectedService,
    storeInfo,
    setMinimumError,
    discountedAmt,
    setPromoValue,
  } = props;

  const flatOrDiscount = promo?.type.name === 'Flat' ? ` ${priceSymbol}` : '%';
  const maxLimit = promo?.type.maxLimit
    ? `up to ${promo?.type.maxLimit} KD`
    : '';
  const amount = `${promo?.type.value}${flatOrDiscount} ${
    promo?.cashback ? 'Cash Back' : 'OFF'
  } ${maxLimit}`;
  const [showDeliveryTypeModal, setShowDeliveryTypeModal] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [minimumDeliveryError, setMinimumDeliveryError] = useState(false);
  const changeDeliveryType = (type) => {
    updateSelectedService(type);
    setShowDeliveryTypeModal(false);
  };

  useEffect(() => {
    if (selectedService) {
      if (
        (selectedService === serviceTypes.delivery &&
          storeInfo.services.includes(selectedService)) ||
        (selectedService === serviceTypes.discovery &&
          storeInfo.services.includes(serviceTypes.delivery))
      ) {
        setSelectedServiceType(serviceTypes.delivery);
        // check if minimum delivery amount is meet
        if (storeInfo.minDeliveryOrderValue) {
          setMinimumDeliveryError(
            parseFloat(realTotal) <
              (storeInfo.minDeliveryOrderValue
                ? parseFloat(storeInfo.minDeliveryOrderValue)
                : 0),
          );
          setMinimumError(
            parseFloat(realTotal) <
              (storeInfo.minDeliveryOrderValue
                ? parseFloat(storeInfo.minDeliveryOrderValue)
                : 0),
          );
        }
      } else {
        setSelectedServiceType(serviceTypes.pickUp);
        setMinimumDeliveryError(false);
        setMinimumError(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    realTotal,
    selectedService,
    storeInfo.minDeliveryOrderValue,
    storeInfo.services,
  ]);

  const discountAmount = () => {
    let dAmount;
    if (promo.type.name === 'Discount') {
      const discountAmt = parseFloat(discountedAmt);
      const maxLimit = parseFloat(promo.type.maxLimit);
      dAmount =
        maxLimit < discountAmt ? maxLimit.toFixed(3) : discountAmt.toFixed(3);
    } else {
      dAmount = parseFloat(promo.type.value).toFixed(3);
    }

    setPromoValue(dAmount);
    return `${dAmount} ${priceSymbol}`;
  };

  const lottieMap = {
    Pickup: MealReady,
    Delivery: DeliveryDrone,
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          backgroundColor: '#ffcccc',
          marginBottom: 10,
          borderRadius: 7,
          overflow: 'hidden',
        }}>
        {error !== '' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ffcccc',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <MIcon name="error-outline" color={GS.errorRed} size={18} />
            <RText
              style={{
                marginLeft: 10,
                color: GS.errorRed,
                fontSize: normalizedFontSize(7),
                paddingRight: 20,
              }}>
              {error}
            </RText>
          </View>
        )}

        {!promo ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f5f5f5',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 7,
            }}>
            <Image
              source={PROMO}
              style={{
                height: 20,
                width: 20,
              }}
            />
            <RText
              fontName={customFont.axiformaRegular}
              style={{ color: '#7e8392', marginRight: 'auto', marginLeft: 10 }}>
              Select a promo code
            </RText>
            <TouchableOpacity
              onPress={togglePromoCodeModal}
              style={{ padding: 10 }}>
              <RText
                fontName={customFont.axiformaMedium}
                style={{ color: '#19C419' }}>
                View offers
              </RText>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#f7fbfd',
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              paddingVertical: 10,
              flexDirection: 'row',
              borderRadius: 7,
            }}>
            <MCIcon name="check-decagram" color={GS.secondaryColor} size={20} />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <RText
                  fontName={customFont.axiformaMedium}
                  style={{
                    color: '#000',
                    marginRight: 'auto',
                    marginLeft: 10,
                    flex: 1,
                  }}>
                  Code {promo.code} applied!
                </RText>

                <RText
                  fontName={customFont.axiformaMedium}
                  style={{ color: '#2d96ff', marginLeft: 'auto' }}>
                  {promo.cashback ? '' : '-'} {discountAmount()}
                </RText>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 5,
                }}>
                <RText
                  fontName={customFont.axiformaMedium}
                  style={{
                    color: 'gray',
                    marginRight: 'auto',
                    marginLeft: 10,
                    marginTop: 5,
                  }}>
                  {amount}
                </RText>
                <TouchableOpacity
                  onPress={removePromo}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <RText
                    fontName={customFont.axiformaMedium}
                    style={{ color: GS.errorRed, marginLeft: 'auto' }}>
                    Remove
                  </RText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
      {minimumDeliveryError && (
        <View style={styles.deliveryErrorWrapper}>
          <MIcon name="error-outline" color={GS.errorRed} size={18} />
          <RText style={styles.deliveryErrorText}>
            Minimum amount for delivery is {storeInfo.minDeliveryOrderValue} KD
          </RText>
        </View>
      )}
      <View
        style={{
          marginBottom: 0,
          marginRight: 20,
          marginLeft: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 0,
            marginBottom: 0,
          }}>
          <RText
            style={{
              color: GS.textColorGreyDark2,
              fontSize: normalizedFontSize(6.5),
            }}>
            Total
          </RText>
          <RText
            style={{
              color: GS.textColorGreyDark3,
              fontSize: normalizedFontSize(6.5),
            }}>
            {realTotal}
          </RText>
        </View>
        {promo && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <RText style={{ color: '#79bcff' }}>
                {promo.cashback ? 'Cash Back' : `Promo - (${promo.code})`}{' '}
              </RText>
              <RText style={{ color: '#79bcff' }}>
                {promo.cashback ? '' : '-'} {discountAmount()}
              </RText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                marginBottom: 10,
              }}>
              <RText style={{ color: GS.textColorGreyDark2 }}>
                Grand Total
              </RText>
              <RText style={{ color: GS.textColorGreyDark3 }}>{total}</RText>
            </View>
          </>
        )}
      </View>

      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDeliveryTypeModal(true)}>
          <View style={styles.mr15}>
            <RText style={styles.text}>{selectedServiceType}</RText>
          </View>
          <View style={styles.lottieContainerMini}>
            {selectedServiceType !== null && (
              <Lottie
                autoPlay
                loop={true}
                source={lottieMap[selectedServiceType]}
                style={styles.lottieStyle}
              />
            )}
          </View>
          <MIIcon name="chevron-right" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <Modal
        onDismiss={() => setShowDeliveryTypeModal(false)}
        isVisible={showDeliveryTypeModal}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropOpacity={0.5}
        onBackdropPress={() => setShowDeliveryTypeModal(false)}
        style={styles.modalWrapper}>
        <View style={styles.container}>
          {!storeInfo.services.includes(serviceTypes.pickUp) && (
            <TouchableOpacity
              style={styles.opacityStyle}
              onPress={() => changeDeliveryType(serviceTypes.pickUp)}>
              <View style={styles.lottieContainer}>
                <Lottie
                  autoPlay
                  loop={true}
                  source={lottieMap[serviceTypes.pickUp]}
                  style={styles.lottieStyle}
                />
              </View>
              <RText style={styles.serviceButton}>{serviceTypes.pickUp}</RText>
              <MIIcon name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          )}
          {storeInfo.services.map((x, y) => (
            <TouchableOpacity
              style={[styles.opacityStyle]}
              onPress={() => changeDeliveryType(x)}
              key={y}>
              <View style={styles.lottieContainer}>
                <Lottie
                  autoPlay
                  loop={true}
                  source={lottieMap[x]}
                  style={styles.lottieStyle}
                />
              </View>
              <RText style={styles.serviceButton}>{x}</RText>
              <MIIcon name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const OrderMethodSelection = (props) => {
  const { toggleOrderSelection, showOrderSelection, changeOrderMethod } = props;

  const orderMethod = [
    {
      methodId: 0,
      imageSrc: 'CASH',
      methodName: serviceTypes.pickUp,
    },
    {
      methodId: 1,
      imageSrc: 'CASH',
      methodName: serviceTypes.delivery,
    },
  ];
  return (
    orderMethod && (
      <ModalNative
        animationType="slide"
        transparent={true}
        visible={showOrderSelection}
        onRequestClose={toggleOrderSelection}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: '#00000000' }}>
            <TouchableOpacity
              style={{ height: '100%' }}
              onPress={toggleOrderSelection}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
            }}>
            {/* header */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderBottomWidth: 0.3,
                borderBottomColor: 'silver',
                backgroundColor: '#fff',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <View style={{ marginRight: 10, flex: 1 }}>
                <BoldText
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    color: GS.textColor,
                  }}>
                  Select Order Method
                </BoldText>
              </View>

              <TouchableOpacity
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}
                onPress={toggleOrderSelection}>
                <ADIcon color="gray" name="close" size={30} />
              </TouchableOpacity>
            </View>
            {/* header */}
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: '#fff',
              }}>
              {orderMethods.map((method, index) => {
                return true ? (
                  <TouchableOpacity
                    key={method.methodId}
                    onPress={() => changeOrderMethod(index)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 15,
                      marginBottom: 10,
                      alignItems: 'center',
                      paddingVertical: 13,
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}>
                      <Image
                        source={method.imageSrc}
                        style={{
                          height: 30,
                          width: 60,
                          resizeMode: 'contain',
                          overlayColor: '#000',
                        }}
                      />
                    </View>
                    <RText style={{ color: '#000', marginRight: 'auto' }}>
                      {method.methodName}
                    </RText>

                    {method.methodId !== 0 ? (
                      <MIIcon name="chevron-right" size={20} color="gray" />
                    ) : null}
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </View>
        </View>
      </ModalNative>
    )
  );
};

const PaymentMethodSelection = (props) => {
  const {
    togglePaymentSelection,
    showPaymentSelection,
    changePaymentMethod,
    storePaymentMethods,
  } = props;

  return (
    storePaymentMethods && (
      <ModalNative
        animationType="slide"
        transparent={true}
        visible={showPaymentSelection}
        onRequestClose={togglePaymentSelection}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: '#00000000' }}>
            <TouchableOpacity
              style={{ height: '100%' }}
              onPress={togglePaymentSelection}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
            }}>
            {/* header */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderBottomWidth: 0.3,
                borderBottomColor: 'silver',
                backgroundColor: '#fff',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <View style={{ marginRight: 10, flex: 1 }}>
                <BoldText
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                    color: GS.textColor,
                  }}>
                  Select Payment Method
                </BoldText>
              </View>

              <TouchableOpacity
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}
                onPress={togglePaymentSelection}>
                <ADIcon color="gray" name="close" size={30} />
              </TouchableOpacity>
            </View>
            {/* header */}
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: '#fff',
              }}>
              {paymentMethods.map((method, index) => {
                const isMethodUseAble =
                  storePaymentMethods.paymentMethods.includes(method.type);
                return isMethodUseAble ? (
                  <TouchableOpacity
                    key={method.methodId}
                    onPress={() => changePaymentMethod(index)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 15,
                      marginBottom: 10,
                      alignItems: 'center',
                      paddingVertical: 13,
                    }}>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}>
                      <Image
                        source={method.imageSrc}
                        style={{
                          height: 30,
                          width: 60,
                          resizeMode: 'contain',
                          overlayColor: '#000',
                        }}
                      />
                    </View>
                    <RText style={{ color: '#000', marginRight: 'auto' }}>
                      {method.methodName}
                    </RText>

                    <MIIcon name="chevron-right" size={20} color="gray" />
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </View>
        </View>
      </ModalNative>
    )
  );
};

const errorHandler = (error, promo, customMessage) => {
  const errorMessage = error.message;
  const errorType = (message) => message.replace(/.+\[(\w+)\s.+/, '$1');

  switch (errorType(errorMessage)) {
    case 'code':
      return promoText.error.code;
    case 'active':
      return promoText.error.active;
    case 'start':
      return promoText.error.start;
    case 'expiry':
      return promoText.error.expiry;
    case 'GraphQL error: Not authenticated!':
      return promoText.error.Unauthorized;
    case 'restrictedCodes':
      return promoText.error.restrictedCodes;
    case 'restApplicable':
      return promoText.error.restApplicable;
    case 'perUserApply':
      return promoText.error.perUserApply;
    case 'respawnTime':
      return promo
        ? promoText.error.respawnTime(promo.respawnTime)
        : promoText.error.respawnTimeDefault;
    case 'minOrder':
      return promoText.error.minOrder(parseFloat(promo.minOrder));
    default:
      return customMessage ? customMessage : promoText.error.default;
  }
};
