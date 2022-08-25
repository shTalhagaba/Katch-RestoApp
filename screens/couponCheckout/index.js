// @ts-nocheck
//react
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
} from '@apollo/react-hooks';
import auth from '@react-native-firebase/auth';
//3rd party
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { minus } from 'safe-float';
import {
  BACKGROUND_DOTS,
  CREDIT_CARD,
  EXCLAMATION,
  K_NET,
} from '../../assets/images';
import AddressCardCheckout from '../../components/AddressCardCheckout';
import AddressDirectionCard from '../../components/AddressDirectionCard';
import { onlinePaymentError, selectPayment } from '../../components/Alerts';
//others
import {
  CREATE_ORDER,
  GET_OG_URL,
  GET_PAYMENT_METHODS,
  GET_USER_WALLET,
} from '../../components/GraphQL';
import { CREATE_COUPON_ORDER } from '../../components/GraphQL/Coupon/mutation';
import { parseError } from '../../components/Helpers';
import { showOrderLanding } from '../../components/Redux/Actions/appActions';
import { setPaymentMethod as setDefaultPaymentMethod } from '../../components/Redux/Actions/cartActions';
import { clearCouponCart } from '../../components/Redux/Actions/couponcartActions';
import {
  hydrateUserWallet,
  setSelectedService as _setSelectedService,
} from '../../components/Redux/Actions/userActions';
import method from '../../constants/paymentMethod';
import serviceTypes from '../../constants/serviceTypes';
import {
  onlinePayments as onlinePaymentsText,
  promos as promoText,
} from '../../constants/staticText';
import AddressList from '../../containers/AddressListModal';
import { Context as GLoadingContext } from '../../context/gLoading';
import { RText } from '../../GlobeStyle';
import KatchWebView from '../KatchWebView';
import EstimatedTime from './EstimatedTime';
import Footer, { PlaceOrderButton } from './Footer';
import Header from './Header';
import ServicesButtons from './ServicesButton';
import styles from './styles';

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

const CouponCheckOut = ({ navigation, route, ...props }) => {
  const { user, hydrateUserWallet: updateWallet, couponCart } = props;
  const { params } = route;
  const cartTotal = params?.total;
  const appliedPromo = params?.appliedPromo;
  const orderNotes = params?.orderNotes;
  const promoValue = params?.promoValue;
  const selectedService = params.selectedService;
  const storeId = props?.items[0]?.shopId;
  const storeName = props?.items[0]?.shopName;
  const coupons = params.coupons;
  const storeInfo = coupons[0].sellerId;
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

  useEffect(() => {
    setServiceSelected(params.selectedService);
  }, [params.selectedService]);

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

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && couponCart.coupons.length === 0) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    const { pickUp, delivery } = serviceTypes;
    if (
      storeInfo &&
      storeInfo?.services &&
      !storeInfo?.services?.includes(delivery)
    ) {
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

  const [getStorePaymentMethods] = useLazyQuery(GET_PAYMENT_METHODS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setStorePaymentMethods(data.getPaymentMethods);
      const _method = defaultPaymentMethod(data.getPaymentMethods);
      setPaymentMethod(_method);
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
      if (
        !couponCart ||
        !couponCart.coupons ||
        couponCart.coupons.length === 0
      ) {
        // navigation.goBack();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (storeId) {
      getStorePaymentMethods({ variables: { storeId } });
    }
  }, [getStorePaymentMethods, storeId]);

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
      if (props.defaultPaymentMethod) {
        if (methods.paymentMethods.includes(props.defaultPaymentMethod.type)) {
          return props.defaultPaymentMethod;
        } else {
          const acceptingMethods = paymentMethods.filter((_method) =>
            methods.paymentMethods.includes(_method.type),
          );

          selectPayment({
            title: `We know you prefer ${props.defaultPaymentMethod.methodName} payments`,
            message: `\n${storeName} does not accept ${props.defaultPaymentMethod.methodName} payments. \n\nPlease select one of the following payment methods`,
            methods: acceptingMethods.map((_method) => {
              return {
                text: _method.methodName,
                onPress: () => {
                  setPaymentMethod(_method);
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

  const [ogUrl, setOgUrl] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [createCouponOrder] = useMutation(CREATE_COUPON_ORDER);

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
            return;
          }
          setOgUrl(url);
          setPaymentModal(true);
        })
        .catch((y) => {
          setPaymentModal(false);
          setOgUrl(null);
          gLoading.actions.toggleGLoading(false);
          onlinePaymentError({
            title: onlinePaymentsText.error.default.title,
            message: onlinePaymentsText.error.default.message,
            onConfirm: () => gLoading.actions.toggleGLoading(false),
          });
        })
        .finally((x) => {
          gLoading.actions.toggleGLoading(false);
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
          gLoading.actions.toggleGLoading(false);
        }
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
      if (serviceSelected === serviceTypes.delivery) {
        const itemsMatch = couponCart.coupons.every((el, index, arr) => {
          return el.sellerId._id === arr[0].sellerId._id;
        });

        if (!itemsMatch) {
          Alert.alert(
            'Sorry',
            'Please select only one restaurant at a time for delivery. Or, you can select pickup!',
          );
          return;
        }
      }

      // if price is zero no payment required
      // create and order
      const price = parseFloat(finalPrice);
      gLoading.actions.toggleGLoading(true);
      if (price === 0) {
        submitCouponOrder();
      } else {
        apolloClient
          .query({
            query: GET_OG_URL,
            fetchPolicy: 'no-cache',
            variables: {
              paymentChannel: paymentMethod.type,
              price: `${price}`,
              storeId: null,
              selectedService: selectedService,
            },
          })
          .then((x) => {
            const { url } = x.data.getPaymenturl;
            setOgUrl(url);
            setPaymentModal(true);
            gLoading.actions.toggleGLoading(false);
          })
          .catch((e) => {
            gLoading.actions.toggleGLoading(false);
          });
      }
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
    setServiceSelected(orderMethods[index]?.methodName);
    setError('');
  };

  const changeAddress = () => {
    toggleViewAddressListModal();
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

  const getAvailableOrderMethods = () => {
    return orderMethods;
  };

  const ogPaymentSuccess = (url, ) => {
    setPaymentModal(false);
    setOgUrl(null);
    setPaymentCancelled(false);
    if (url.query.result === 'CAPTURED') {
      const { isysid } = url.query;
      gLoading.actions.toggleGLoading(true);
      submitCouponOrder(isysid);
    } else if (url.query.result === 'CANCELLED') {
      setPaymentCancelled(true);
      setShowPaymentError(true);
    } else {
      setShowPaymentError(true);
    }
  };

  const submitCouponOrder = async (transactionId = 'WALLET_PAYMENT') => {
    const couponList = couponCart.coupons.map((coupon) => {
      return {
        couponId: coupon._id,
        amount: `${coupon.afterPrice}`,
        noOfCoupon: `${coupon.total}`,
      };
    });
    try {
      let walletObj = {
        total: '0.000',
        walletDesc: '0.000',
      };
      if (walletUsed) {
        walletObj = calculateAmount(
          parseFloat(couponCart.total),
          parseFloat(props.walletTotal),
        );
      }
      let total = (
        parseFloat(couponCart.total) + parseFloat(deliveryCharge)
      ).toFixed(3);
      const payload = {
        paymentMethod: paymentMethod.type,
        transId: transactionId || '',
        coupons: couponList,
        total: total,
        invoiceId: transactionId || '',
        orderType: serviceSelected,
        userAddressID: selectedAddress ? selectedAddress._id : '',
        customerDeliveryCharge: deliveryRadius?.customerDeliveryCharge,
        vendorDeliveryCharge: deliveryRadius?.vendorDeliveryCharge,
        walletdec: walletUsed
          ? parseFloat(walletObj.walletDesc).toFixed(3)
          : null,
      };
      const { data } = await createCouponOrder({
        variables: {
          coupons: payload,
        },
      });
      if (data.createUserCoupons) {
        props.clearCart();
        if (serviceSelected === 'Pickup') {
          navigation.navigate('UserCoupons');
        } else {
          navigation.navigate('OrderSummary', {
            orderId: data.createUserCoupons._id,
          });
        }
      }

      gLoading.actions.toggleGLoading(false);
    } catch (e) {
      Alert.alert(
        'Sorry',
        'Please select only one restaurant at a time for delivery. Or, you can select pickup!',
      );
      gLoading.actions.toggleGLoading(false);
    }
  };

  /**** functions ****/
  return (
    storeInfo && (
      <SafeAreaView style={styles.root}>
        <View style={styles.rootWrapper}>
          <Header
            shopName={'Coupon Checkout'}
            goBack={() => navigation.goBack()}
          />
          <Animated.ScrollView style={styles.scrollView}>
            <View style={styles.footerWrapper}>
              <Footer
                paymentMethod={paymentMethod}
                realTotal={cartTotal}
                togglePaymentSelection={togglePaymentSelection}
                deliveryCharge={deliveryCharge}
                serviceType={serviceSelected}
                error={error}
                changeAddress={changeAddress}
                addressError={addressError}
                walletTotal={props.walletTotal}
                walletUsed={walletUsed}
                setWalletUsed={setWalletUsed}
                finalPrice={setFinalPrice}
                changePaymentMethod={(i) => {
                  setPaymentMethod(paymentMethods[i]);
                }}
                storePaymentMethods={{ paymentMethods: ['cc', 'knet'] }}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                paymentMethods={paymentMethods}
              />
            </View>
          </Animated.ScrollView>
          <PlaceOrderButton
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
              <RText style={styles.tryText}>Please try again</RText>
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
    // storeInfo: state.cart.storeInfo,
    walletTotal: state.user?.wallet?.wallet?.walletTotal,
    couponCart: state.couponCart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => {
      dispatch(clearCouponCart());
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

export default connect(mapStateToProps, mapDispatchToProps)(CouponCheckOut);

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
