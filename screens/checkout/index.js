// @ts-nocheck
//react
import { useMutation,useLazyQuery,useApolloClient } from '@apollo/client'
import auth from '@react-native-firebase/auth';
//3rd party
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { minus } from 'safe-float';
import {
  CASH,
  CREDIT_CARD,
  K_NET,
  EXCLAMATION,
  BACKGROUND_DOTS,
} from '../../assets/images';
import AddressCardCheckout from '../../components/AddressCardCheckout';
import StoreAddress from '../../components/AddressCardCheckout/StoreAddress';
import AddressDirectionCard from '../../components/AddressDirectionCard';
import { hydrateUserWallet } from '../../components/Redux/Actions/userActions';

import {
  askDefaultPaymentMethod,
  onlinePaymentError,
  onStoreClosed,
  orderConfirmation,
  selectPayment,
} from '../../components/Alerts';
//others
import {
  CHECK_STORE_STATUS,
  CREATE_ORDER,
  GET_OG_URL,
  GET_PAYMENT_METHODS,
  GET_USER_WALLET,
} from '../../components/GraphQL';
import { deepClone, parseError } from '../../components/Helpers';
import { showOrderLanding } from '../../components/Redux/Actions/appActions';
import {
  clearCart,
  setPaymentMethod as setDefaultPaymentMethod,
} from '../../components/Redux/Actions/cartActions';
import { setSelectedService as _setSelectedService } from '../../components/Redux/Actions/userActions';
import method from '../../constants/paymentMethod';
import serviceTypes from '../../constants/serviceTypes';
import {
  cart as cartText,
  onlinePayments as onlinePaymentsText,
  promos as promoText,
} from '../../constants/staticText';
import AddressList from '../../containers/AddressListModal';
import { RText } from '../../GlobeStyle';
import EstimatedTime from './EstimatedTime';
import Footer, { PlaceOrderButton } from './Footer';
import Header from './Header';
import ServicesButtons from './ServicesButton';
import styles from './styles';
import KatchWebView from '../KatchWebView';
import { ImageBackground } from 'react-native';
import { Context as GLoadingContext } from '../../context/gLoading';

const paymentMethods = [
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
  {
    methodId: 0,
    methodName: 'Cash',
    type: 'cash',
    imageSrc: CASH,
  },
];

const orderMethods = [
  {
    methodName: serviceTypes.pickUp,
  },
  {
    methodName: serviceTypes.delivery,
  },
];

const calculateAmount = (totalAmount, walletBalance = 0) => {
  if (typeof totalAmount !== 'number' && typeof walletBalance !== 'number') {
    throw new Error('Total Amount and Wallet Balance should be number');
  }
  if (totalAmount) {
    if (totalAmount <= walletBalance) {
      return {
        total: '0',
        walletDesc: totalAmount,
      };
    } else if (totalAmount > walletBalance) {
      return {
        total: minus(totalAmount.toString(), walletBalance.toString()),
        walletDesc: walletBalance,
      };
    }
  }
};

const CheckOut = ({ navigation, route, ...props }) => {
  const {
    user,
    storeInfo,
    selectedService,
    hydrateUserWallet: updateWallet,
  } = props;
  const { params } = route;
  const cartTotal = params?.total;
  const appliedPromo = params?.appliedPromo;
  const orderNotes = params?.orderNotes;
  const promoValue = params?.promoValue;

  const storeId = props?.items[0]?.shopId;
  const storeName = props?.items[0]?.shopName;
  const gLoading = useContext(GLoadingContext);
  const [serviceSelected, setServiceSelected] = useState(selectedService);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [error, setError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [storePaymentMethods, setStorePaymentMethods] = useState(null);
  const [deliveryDistance, setDeliveryDistance] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(false);
  const [deliveryRadius, setDeliveryRadius] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(-1);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({
    storeId,
    storeName,
    total: props.total,
    orderRating: 0,
    orderNotes,
    paymentMethod: method[paymentMethod.type],
    orderStatus: 'Pending',
  });

  const [getUserWallet, { loading: walletLoading }] = useLazyQuery(
    GET_USER_WALLET,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        updateWallet(data);
      },
      onError: () => {
        updateWallet({ wallet: { walletTotal: '0.000' } });
      },
    },
  );

  // ORDER METHODS
  const [showOrderSelection, setShowOrderSelection] = useState(false);
  //Address States
  const [viewAddressListModal, setViewAddressListModal] = useState(false);
  const apolloClient = useApolloClient();
  const [createOrder] = useMutation(CREATE_ORDER);

  const onBack = () => {
    navigation.navigate('Cart');  
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, []);

  useEffect(() => {
    setCart({
      storeId,
      storeName,
      total: props.total,
      orderRating: 0,
      orderNotes,
      paymentMethod: method[paymentMethod.type],
      orderStatus: 'Pending',
    });
  }, [orderNotes, paymentMethod.type, props.total, storeId, storeName]);

  useEffect(() => {
    const { pickUp, delivery } = serviceTypes;
    if (storeInfo && storeInfo?.services && !storeInfo?.services?.includes(delivery)) {
      setServiceSelected(pickUp);
    } else {
      if ([pickUp, delivery].includes(selectedService)) {
        setServiceSelected(selectedService);
      } else {
        setServiceSelected(serviceTypes.delivery);
      }
    }
  }, [storeInfo, selectedService]);

  useEffect(() => {
    setSelectedAddress(user.selectedAddress);
    if (!user.selectedAddress && serviceSelected === serviceTypes.delivery) {
      setDeliveryCharge(undefined);
      setAddressError('Select the address for delivery');
    } else {
      setAddressError('');
      setDeliveryCharge(0);
    }
  }, [user.selectedAddress, serviceSelected]);

  useEffect(() => {
    setItems(
      props.items.map((item) => {
        return {
          _id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: `${item.price}`,
          options: item.options,
          category: item.category,
        };
      }),
    );
  }, [props.items]);

  useEffect(() => {
    setCart((state) => {
      state.paymentMethod = method[paymentMethod.type];
      return state;
    });
  }, [paymentMethod]);

  const [walletUsed, setWalletUsed] = useState(false);

  const [getStorePaymentMethods,{ loading: paymentMLoading}] = useLazyQuery(GET_PAYMENT_METHODS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setStorePaymentMethods(data.getPaymentMethods);
      const _method = defaultPaymentMethod(data.getPaymentMethods);
      setPaymentMethod(deepClone(_method));
    },
  });
  const [isVisible, setIsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);

      return () => {
        setIsVisible(false);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getUserWallet();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (storeId) {
      getStorePaymentMethods({ variables: { storeId } });
    }
  }, [getStorePaymentMethods, storeId]);

  const checkStoreStatus = async () => {
    try {
      gLoading.actions.toggleGLoading(true);
      const { data } = await apolloClient.query({
        query: CHECK_STORE_STATUS,
        fetchPolicy: 'network-only',
        variables: { id: storeId },
      });

      const isStoreOpen = data.getStore.isOpen && !data.getStore.busyMode;
      if (isStoreOpen) {
        placeOrder();
      } else {
        gLoading.actions.toggleGLoading(false);
        onStoreClosed({
          shopName: storeName,
          onConfirm: () => null,
          isBusy: data.getStore.busyMode,
        });
      }
    } catch {}
  };

  const getMaxStoreDeliveryDistance = () => {
    if (storeInfo && storeInfo?.deliveryRadius) {
      return Math.max(
        ...storeInfo.deliveryRadius.map((x) => parseInt(x.radiusKm, 10)),
      );
    }
  };

  useEffect(() => {
    if (storeInfo && storeInfo?.deliveryRadius && deliveryDistance) {
      getDeliveryCharge(deliveryDistance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryDistance]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDeliveryCharge = useCallback((distance) => {
    const allDistance = storeInfo.deliveryRadius
      .map((x) => parseInt(x.radiusKm, 10))
      .sort((x, y) => x - y); // sort the distance in ascending order
    const payingDistance = allDistance.find((x) => x >= distance);
    const deliveryChargeRadius = storeInfo.deliveryRadius.find(
      // eslint-disable-next-line eqeqeq
      (x) => x.radiusKm == payingDistance,
    );
    setDeliveryRadius(deliveryChargeRadius);
    setDeliveryCharge(deliveryChargeRadius?.customerDeliveryCharge);
  });

  function defaultPaymentMethod(methods) {
    if (methods) {
      // if (props.defaultPaymentMethod) {
      //   if (methods.paymentMethods.includes(props.defaultPaymentMethod.type)) {
      //     return props.defaultPaymentMethod;
      //   } else {
      //     const acceptingMethods = paymentMethods.filter((_method) =>
      //       methods.paymentMethods.includes(_method.type),
      //     );

      //     selectPayment({
      //       title: `We know you prefer ${props.defaultPaymentMethod.methodName} payments`,
      //       message: `\n${storeName} does not accept ${props.defaultPaymentMethod.methodName} payments. \n\nPlease select one of the following payment methods`,
      //       methods: acceptingMethods.map((_method) => {
      //         return {
      //           text: _method.methodName,
      //           onPress: () => {
      //             setPaymentMethod(_method);
      //           },
      //         };
      //       }),
      //     });
      //   }
      // }
      const pMethod = methods.paymentMethods[0];
      return paymentMethods.find(x => x.type === pMethod)
    }
    return paymentMethods[0];
  }

  const [ogUrl, setOgUrl] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const placeOrder = () => {
    if (paymentMethod.methodId === 0) {
      submitOrder();
    } else {
      let total = parseFloat(cartTotal) + parseFloat(deliveryCharge);

      let walletObj = {
        total: '0.000',
        walletDesc: '0.000',
      };
      const totalAmount = parseFloat(cartTotal) + parseFloat(deliveryCharge);
      if (walletUsed) {
        walletObj = calculateAmount(totalAmount, props.walletTotal);
        total = parseFloat(walletObj.total);
      }
      setOgUrl(null);
      setPaymentModal(false);

      apolloClient
        .query({
          query: GET_OG_URL,
          fetchPolicy: 'no-cache',
          variables: {
            paymentChannel: paymentMethod.type,
            price: total.toString(),
            storeId,
            selectedService: serviceSelected,
          },
        })
        .then((x) => {
          const { onlinePayment, minAmount, url, message } =
            x.data.getPaymenturl;
          if (!onlinePayment) {
            setError(message || 'Online payment currently unavailable');
            gLoading.actions.toggleGLoading(false);
            return;
          }

          if (total === 0) {
            // if total is zero no need for onlinepayment
            submitOrder();
            return;
          }

          if (minAmount && parseFloat(total) < parseFloat(minAmount)) {
            setError(
              onlinePaymentsText.error.minAmount.message(
                x.data.getPaymenturl.minAmount,
              ),
            );
            gLoading.actions.toggleGLoading(false);
            return;
          }
          setOgUrl(url);
          setPaymentModal(true);
        })
        .catch((y) => {
          gLoading.actions.toggleGLoading(false);
          setPaymentModal(false);
          setOgUrl(null);
          onlinePaymentError({
            title: onlinePaymentsText.error.default.title,
            message: onlinePaymentsText.error.default.message,
            onConfirm: () => gLoading.actions.toggleGLoading(false),
          });
        });
    }
  };

  const submitOrder = useCallback(
    async (_invoiceId = null) => {
      try {
        //Error is thrown already if cartTotal is null
        let total = (
          parseFloat(cartTotal) + parseFloat(deliveryCharge)
        ).toFixed(3);
        let walletObj = {
          total: '0.000',
          walletDesc: '0.000',
        };
        const totalAmount = parseFloat(cartTotal) + parseFloat(deliveryCharge);
        if (walletUsed) {
          walletObj = calculateAmount(totalAmount, props.walletTotal);
          total = parseFloat(walletObj.total).toFixed(3);
        }
        // createOrder change value here
        const { data } = await createOrder({
          variables: {
            NewOrderInputs: {
              ...cart,
              items: [...items],
              promoCode: appliedPromo ? appliedPromo.code : '',
              promoInfo: {
                value: promoValue ? promoValue : null,
                isCashback: appliedPromo ? appliedPromo.cashback : null,
              },
              total: total,
              invoiceId: _invoiceId,
              orderType: serviceSelected,
              userAddressID: selectedAddress ? selectedAddress._id : '',
              customerDeliveryCharge: deliveryRadius?.customerDeliveryCharge,
              vendorDeliveryCharge: deliveryRadius?.vendorDeliveryCharge,
              walletdec: walletUsed
                ? parseFloat(walletObj.walletDesc).toFixed(3)
                : null,
            },
          },
        });

        if (data.createOrder) {
          getUserWallet();
          props.clearCart();
          props.showOrderLanding(true);
          navigation.setParams({ newOrder: true });
          navigation.navigate('OrderSummary', {
            orderId: data.createOrder._id,
          });
        }
        gLoading.actions.toggleGLoading(false);
      } catch (_error) {
        const unknownErrorMessage =
          parseError(_error) ||
          'Sorry, it looks like we ran into an issue and cant take your order at the moment.';
        setError(errorHandler(_error, appliedPromo, unknownErrorMessage));
        gLoading.actions.toggleGLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      appliedPromo,
      cart,
      cartTotal,
      createOrder,
      deliveryCharge,
      deliveryRadius?.customerDeliveryCharge,
      deliveryRadius?.vendorDeliveryCharge,
      items,
      navigation,
      props,
      selectedAddress,
      serviceSelected,
    ],
  );

  const toggleViewAddressListModal = () =>
    setViewAddressListModal(!viewAddressListModal);

  const addressChange = (address) => {
    setViewAddressListModal(false);
    setSelectedAddress(address);
  };

  const _onCheckout = () => {
    setError('');
    if (
      serviceSelected &&
      serviceSelected === serviceTypes.delivery &&
      !selectedAddress
    ) {
      setAddressError('Select the address for delivery');
      return;
    }
    if (auth().currentUser) {
      orderConfirmation({
        title: cartText.orderConfirmation.title,
        message: cartText.orderConfirmation.message,
        onReject: () => null,
        onConfirm: () => {
          checkStoreStatus();
        },
      });
    } else {
      navigation.navigate('Account', {
        screen: 'Login',
        cameFrom: () => {
          navigation.goBack();
        },
      });
    }
  };

  const togglePaymentSelection = () => {
    setShowPaymentSelection(!showPaymentSelection);
  };

  const toggleOrderSelection = () => {
    setShowOrderSelection(!showOrderSelection);
  };

  const changeOrderMethod = (index) => {
    if (
      !storeInfo.services.includes(serviceTypes.delivery) &&
      orderMethods[index]?.methodName === serviceTypes.delivery
    ) {
      Alert.alert('', 'We do not provide delivery service for this store.');
      return;
    }
    setServiceSelected(orderMethods[index]?.methodName);
    setError('');
  };

  const changeAddress = () => {
    toggleViewAddressListModal();
  };

  const changePaymentMethod = (methodIndex) => {
    setPaymentMethod(paymentMethods[methodIndex]);
  };

  if (!isVisible) {
    return null;
  }

  const checkAddressDeliverable = (valid) => {
    if (!valid && selectedAddress !== null) {
      setAddressError('Cannot be delivered to this address');
    } else if (selectedAddress === null) {
      setAddressError('Please select an address');
    } else {
      setAddressError('');
    }
  };

  if (!storeInfo) {
    navigation.goBack();
    return null;
  }

  const getAvailableOrderMethods = () => {
    if (storeInfo.services.includes(serviceTypes.delivery)) {
      return orderMethods;
    } else {
      return [
        {
          methodName: serviceTypes.pickUp,
        },
      ];
    }
  };

  const ogPaymentSuccess = (url) => {
    setPaymentModal(false);
    setOgUrl(null);
    setPaymentCancelled(false);
    if (url.query.result === 'CAPTURED') {
      const { isysid } = url.query;
      gLoading.actions.toggleGLoading(true);
      submitOrder(isysid);
    } else if (url.query.result === 'CANCELLED') {
      setPaymentCancelled(true);
      setShowPaymentError(true);
    } else {
      setShowPaymentError(true);
    }
  };

  /**** functions ****/
  return (
    storeInfo && (
      <SafeAreaView style={styles.root}>
        <View style={styles.rootWrapper}>
          <Header shopName={storeName} 
          goBack={()=>onBack()}
          // goBack={() => navigation.goBack()}
           />
          <Animated.ScrollView style={styles.scrollView}>
            <ServicesButtons
              orderMethods={getAvailableOrderMethods()}
              selectedOrderType={serviceSelected}
              onOrderTypeChange={changeOrderMethod}
            />
            <EstimatedTime
              serviceType={serviceSelected}
              hasError={addressError}
              restaurantId={storeInfo?._id}
              userLocation={selectedAddress?.location.coordinates}
              restaurantLocation={[
                props?.storeLocation?.longitude,
                props?.storeLocation?.latitude,
              ]}
            />
            <View style={styles.serviceContainer}>
              <RText style={styles.serviceText}>
                {serviceSelected === serviceTypes.delivery
                  ? 'Deliver to'
                  : 'Pickup from'}
              </RText>
            </View>
            {serviceSelected === serviceTypes.delivery ? (
              <AddressCardCheckout
                changeAddress={changeAddress}
                address={selectedAddress}
                distanceLimit={getMaxStoreDeliveryDistance()}
                showDirection={true}
                addressDeliverable={checkAddressDeliverable}
                sourceAddress={{
                  latitude: props?.storeLocation?.latitude,
                  longitude: props?.storeLocation?.longitude,
                }}
                destinationAddress={{
                  longitude: selectedAddress?.location?.coordinates[0],
                  latitude: selectedAddress?.location?.coordinates[1],
                }}
                userDistance={(distance) => setDeliveryDistance(distance)}
              />
            ) : (
              <>
                <AddressDirectionCard
                  sourceAddress={{
                    latitude: props?.storeLocation?.latitude,
                    longitude: props?.storeLocation?.longitude,
                  }}
                />
                <StoreAddress
                  storeName={storeInfo.shopName}
                  storeAddress={storeInfo.address}
                />
              </>
            )}
            <View style={styles.footerWrapper}>
              <Footer
                paymentMLoading={paymentMLoading}
                paymentMethod={paymentMethod}
                realTotal={cartTotal}
                togglePaymentSelection={togglePaymentSelection}
                deliveryCharge={deliveryCharge}
                serviceType={serviceSelected}
                error={error}
                addressError={addressError}
                changeAddress={changeAddress}
                walletTotal={props.walletTotal}
                walletUsed={walletUsed}
                setWalletUsed={setWalletUsed}
                changePaymentMethod={changePaymentMethod}
                storePaymentMethods={storePaymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                paymentMethods={paymentMethods}
              />
            </View>
          </Animated.ScrollView>
          <PlaceOrderButton
            paymentMLoading={paymentMLoading}
            _onCheckout={_onCheckout}
            loading={walletLoading}
            addressError={addressError}
            selectedPaymentMethod={selectedPaymentMethod}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={viewAddressListModal}
            onRequestClose={toggleViewAddressListModal}>
            <AddressList
              toggleModal={toggleViewAddressListModal}
              showModal={setViewAddressListModal}
              selectedAddress={addressChange}
              navigation={navigation}
            />
          </Modal>
        </View>
        <Modal animationType="slide" transparent={true} visible={paymentModal}>
          <View style={styles.root}>
            <KatchWebView
              uri={ogUrl}
              onSuccess={ogPaymentSuccess}
              hideDialog={setPaymentModal}
            />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowPaymentError(false)}
          visible={showPaymentError}>
          <View style={styles.opacity}>
            <View style={styles.errorWrapper}>
              <View style={styles.imageWrapper}>
                <ImageBackground
                  source={BACKGROUND_DOTS}
                  style={styles.dots}
                  resizeMode="cover">
                  <Image source={EXCLAMATION} style={styles.exclamation} />
                </ImageBackground>
              </View>
              <RText style={styles.transactionFailed}>
                {paymentCancelled
                  ? 'Transaction Cancelled!'
                  : 'Transaction Failed!'}
              </RText>
              <RText style={styles.tryText}>Please try again or use cash</RText>
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setShowPaymentError(false)}>
                <RText style={styles.okText}>OK</RText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  );
};

const mapStateToProps = (state) => {
  return {
    items: state.cart.addedItems,
    total: state.cart.total,
    defaultPaymentMethod: state.cart.defaultPaymentMethod,
    user: state.user,
    userLoc: state.app.userLoc,
    storeLocation: state.cart.storeLocation,
    storeInfo: state.cart.storeInfo,
    selectedService: state.user.selectedService,
    walletTotal: state.user?.wallet?.wallet?.walletTotal,
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
      dispatch(setDefaultPaymentMethod(payload));
    },
    setSelectedService: (payload) => {
      dispatch(_setSelectedService(payload));
    },
    hydrateUserWallet: (wallet) => dispatch(hydrateUserWallet(wallet)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);

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
    case 'Unauthorized':
      return promoText.error.Unauthorized;
    case 'restrictedCodes':
      return promoText.error.restrictedCodes;
    case 'restApplicable':
      return promoText.error.restApplicable;
    case 'perUserApply':
      return promoText.error.perUserApply;
    case 'respawnTime':
      return promoText.error.respawnTime(promo.respawnTime);
    case 'minOrder':
      return promoText.error.minOrder(parseFloat(promo.minOrder));
    default:
      return customMessage ? customMessage : promoText.error.default;
  }
};
