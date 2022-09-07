/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */

import { useMutation,useQuery,useSubscription } from '@apollo/client'
import { BlurView } from '@react-native-community/blur';
//3rd party
import auth from '@react-native-firebase/auth';
import Timer from 'easytimer.js';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import call from 'react-native-phone-call';
import { AirbnbRating } from 'react-native-ratings';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import Svg, { Image } from 'react-native-svg';
import ADIcon from 'react-native-vector-icons/AntDesign';
import EIIcon from 'react-native-vector-icons/EvilIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import IOIcon from 'react-native-vector-icons/Ionicons';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import styled from 'styled-components';
import { MAP_PIN } from '../../assets/images';
import { askToClearCart, reorderAlert } from '../../components/Alerts';
import ClusterMarkerUser from '../../components/ClusterMarker/usercluster';
import {
  CHANGE_ORDER_STATUS,
  GET_USER_ORDER,
  ORDER_STATUS_CHANGE,
  REORDER,
  REVIEW_STORE,
} from '../../components/GraphQL';
import {
  animateLayout,
  generateProductImgScr,
  timeDifference,
  toLocalTime,
} from '../../components/Helpers';
import ProgressLoading from '../../components/Loading/ProgressLoading';
import OrderLottie from '../../components/OrderLottie';
import OrdeSteps from '../../components/OrderSteps';
import {
  addQuantity,
  addToCart,
  clearCart,
  setStoreInfo,
} from '../../components/Redux/Actions/cartActions';
import { status } from '../../constants/orderStatus';
import paymentMethod from '../../constants/paymentMethod';
import serviceTypes from '../../constants/serviceTypes';
import {
  orderDetails as orderDetailsText,
  reOrder as reOrderText,
} from '../../constants/staticText';
import { Context } from '../../context/notification';
//others
import GS, { BoldText, normalizedFontSize, RText } from '../../GlobeStyle';
import MoreDetails from './moredetails';
import Share from 'react-native-share';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const OrderSummary = ({ navigation, route, labs,...props }) => {
  const { orderId } = route.params;
  const [reorder] = useMutation(REORDER);

  const scrollRef = useRef();
  const sheetRef = useRef();
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCallingModal, setShowCallingModal] = useState(false);
  const [webViewError, setWebViewError] = useState(false);
  const [order, setOrder] = useState(null);
  const [isMashkorOrderInProcess, setIsMashkorOrderInProcess] = useState(false);
  const notification = useContext(Context);
  const [showDelayed, setShowDelayed] = useState(false);
  useSubscription(ORDER_STATUS_CHANGE, {
    variables: { customerId: auth().currentUser.uid },
    onSubscriptionData: ({ subscriptionData }) => {
      const data = subscriptionData.data;
      if (data && data.orderStatusChanged._id === order._id) {
        if (data.orderStatusChanged.isDeliveryDelayed) {
          setShowDelayed(true);
        } else if (data.orderStatusChanged.isDeliveryDelayed === false) {
          setShowDelayed(false);
        }
        setOrder((state) => {
          state = {
            ...state,
            ...data.orderStatusChanged,
          };
          setIsMashkorOrderInProcess(checkMashkorOrderStatus(state));
          return state;
        });
      }
    },
  });

  const [cancelOrder] = useMutation(CHANGE_ORDER_STATUS);
  useQuery(GET_USER_ORDER, {
    fetchPolicy: 'no-cache',
    variables: { orderId: orderId },
    onCompleted: (data) => {
      if (data.getUserOrder.isDeliveryDelayed) {
        setShowDelayed(true);
      } else if (data.getUserOrder.isDeliveryDelayed === false) {
        setShowDelayed(false);
      }
      setOrder((state) => {
        state = data.getUserOrder;
        state.location = {
          longitude: 0, // if no longitude set as 0
          latitude: 0, // if no latitude set 0
          ...state.location,
          latitudeDelta: 0.007195200162385618,
          longitudeDelta: 0.014325007796287537,
        };
        setIsMashkorOrderInProcess(checkMashkorOrderStatus(state));
        return state;
      });

      setIsLoading(false);
    },
  });

  const style = {
    color: GS.textColorGreyDark3,
    fontSize: normalizedFontSize(8.5),
    // fontWeight: 'bold',
  };

  const [
    enabledContentGestureInteraction,
    setEnabledContentGestureInteraction,
  ] = useState(true);

  const onBack = () => {
    navigation.goBack();
  };

  let animation = useRef(new Animated.Value(0.5)).current;

  // const mapHeight = Animated.interpolate(animation, {
  //   inputRange: [0, 0.5, 1],
  //   outputRange: [windowHeight, windowHeight / 1.8, windowHeight - 100],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  // const blurViewOpacity = Animated.interpolate(animation, {
  //   inputRange: [0, 0.5],
  //   outputRange: [1, 0],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  // const topButtonY = Animated.interpolate(animation, {
  //   inputRange: [0, 1],
  //   outputRange: [-20, 0],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  // const zIndexBlur = Animated.interpolate(animation, {
  //   inputRange: [0, 0.1],
  //   outputRange: [100, 0],
  //   extrapolate: Animated.Extrapolate.CLAMP,
  // });

  const openMap = () => {
    try {
      const { latitude, longitude } = order.location;
      let scheme = 'http://maps.google.com/maps?q=';
      const latLng = `${latitude},${longitude}`;
      const label = encodeURIComponent(order.storeName);
      let url = `${scheme}${latLng}+(${label})`;
      Linking.openURL(url);
    } catch (error) {}
  };

  const toastOnAdded = () =>
    Toast.show('Added to cart', Toast.SHORT, ['UIAlertController']);

  const _onCartAdd = () => {
    if (props.items.length > 0 && props.items[0].shopId !== order.storeId) {
      askToClearCart({
        title: 'Replace cart ?',
        fromName: props.items[0].shopName,
        toName: order.storeName,
        onConfirm: () => {
          props.clearCart();
          onReorder(order);
        },
        onReject: () => {},
      });
    } else {
      if (props.items.length > 0) {
        props.clearCart();
      }
      onReorder(order);
    }
  };

  const onAddToCart = (items) => {
    items.forEach(({ quantity, ...item }, index) => {
      props.addToCart(item);
      if (quantity > 1) {
        const cartItemNum = index + 1;
        for (let i = 1; i < quantity; i++) {
          props.addQuantity(cartItemNum);
        }
      }
    });

    toastOnAdded();
    setIsLoading(false);
    navigation.navigate('Cart');
  };

  const storeRestarurantInfoInRedux = (store) => {
    const { services, deliveryRadius, shopName, address, location, _id } =
      store;
    // @ts-ignore
    props.setStoreInfo({
      storeLocation: location,
      storeInfo: {
        services,
        deliveryRadius,
        shopName,
        address,
        location,
        _id,
      },
    });
  };

  const onReorder = (item) => {
    setIsLoading(true);
    const productIds = item.items.map(({ _id }) => _id);
    reorder({ variables: { storeId: order.storeId, productIds } })
      .then((res) => {
        if (res.data.reorder === null) {
          reorderAlert({
            title: reOrderText.allOut.title,
            message: reOrderText.allOut.message,
            onConfirmText: 'OK',
            onConfirm: () => setIsLoading(false),
          });
          return;
        }
        const orderedItems = item.items;
        const storeProducts = res.data.reorder.products;
        const storeId = res.data.reorder._id;
        const shopName = res.data.reorder.shopName;

        const itemsToAdd = [];
        const notAvailable = [];

        orderedItems.forEach((product) => {
          const indexOfProduct = storeProducts.findIndex(
            ({ _id }) => product._id === _id,
          );
          if (indexOfProduct === -1) {
            notAvailable.push(product.name);
          } else {
            const cartInfo = {
              id: product._id,
              imageScr: generateProductImgScr(
                res.data.reorder._id,
                storeProducts[indexOfProduct].image,
              ),
              name: product.name,
              price: product.price,
              shopName: shopName,
              shopId: storeId,
              options: product.options,
              quantity: product.quantity,
              category: storeProducts[indexOfProduct].category,
            };
            itemsToAdd.push(cartInfo);
          }
        });

        if (notAvailable.length > 0) {
          reorderAlert({
            title: reOrderText.missingItems.title,
            message: reOrderText.missingItems.message(notAvailable),
            onConfirm: () => {
              storeRestarurantInfoInRedux(res.data.reorder);
              onAddToCart(itemsToAdd);
            },
            onReject: () => setIsLoading(false),
          });
          return;
        }
        storeRestarurantInfoInRedux(res.data.reorder);
        onAddToCart(itemsToAdd);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const toCallOptionChangeState = () => {
    setShowCallingModal(!showCallingModal);
  };

  const callNumber = (number) => {
    call({
      number: number, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
    });
    toCallOptionChangeState();
  };

  // Get delivery text
  const getDeliveryPrice = (price) => {
    if (!price) {
      return false;
    }
    try {
      return parseFloat(price).toFixed(3);
    } catch (e) {
      return false;
    }
  };

  // Modal To call restarunt or driver number
  const CallOptionModal = () => {
    if (order?.deliveryInfo !== null && isMashkorOrderInProcess) {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCallingModal}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#00000000' }}>
              <TouchableOpacity
                style={{ height: '100%' }}
                onPress={toCallOptionChangeState}
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
                    Call To
                  </BoldText>
                </View>

                <TouchableOpacity
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                  }}
                  onPressIn={toCallOptionChangeState}>
                  <ADIcon color="gray" name="close" size={30} />
                </TouchableOpacity>
              </View>
              {/* header */}
              <View
                style={{
                  paddingVertical: 20,
                  backgroundColor: '#fff',
                }}>
                <TouchableOpacity
                  onPress={() => callNumber(order.phone)}
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
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    <MIIcon name="local-phone" size={25} color="silver" />
                    <RText
                      style={{
                        color: '#000',
                        marginRight: 'auto',
                        padding: 10,
                      }}>
                      Restaurant
                    </RText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => callNumber(order.deliveryInfo.driverMobile)}
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
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    <MIIcon name="local-phone" size={25} color="silver" />
                    <RText
                      style={{
                        color: '#000',
                        marginRight: 'auto',
                        padding: 10,
                      }}>
                      {order?.deliveryInfo?.driverName} (Driver)
                    </RText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    } else {
      return null;
    }
  };

  const checkMashkorOrderStatus = (newOrder) => {
    if (
      newOrder?.deliveryInfo !== null &&
      newOrder?.deliveryInfo?.deliveryOrderStatus !== null
    ) {
      const maxStatus = Math.max(
        ...newOrder.deliveryInfo.deliveryOrderStatus.map((item) => item.status),
      );
      // eslint-disable-next-line eqeqeq
      if (maxStatus == 5 || maxStatus == 6) {
        return true;
      }
      return false;
    }
  };

  const onCancelOrder = async () => {
    setIsLoading(true);
    try {
      const variables = {
        OrderStatusInput: {
          orderId: order._id,
          status: status.cancelled,
        },
      };

      const { data } = await cancelOrder({ variables });

      if (data.changeOrderStatus) {
        notification.actions.show({
          message: '',
          description:
            order.paymentMethod === paymentMethod.cash
              ? orderDetailsText.cancelSuccess.cash
              : orderDetailsText.cancelSuccess.online,
        });
      }

      setOrder((state) => {
        state.orderStatus = status.cancelled;
        return state;
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      const errorType = (message) => message.replace(/.+\[(\w+)\s.+/, '$1');
      const errorMessage = errorType(error.message);

      let notify;
      if (errorMessage === 'cancelled' || errorMessage === 'declined') {
        notify = {
          message: '',
          description: orderDetailsText.error.cancelled.message(errorMessage),
          type: 'danger',
        };
      } else {
        notify = {
          message: orderDetailsText.error.cancelled.default.title,
          description: orderDetailsText.error.cancelled.default.message,
          type: 'danger',
        };
      }

      notification.actions.show(notify);
    }
  };

  const handlePopUp = (time) => {
    const valid = [status.pending, status.accepted, status.enRoute];
    if (
      valid.includes(order.orderStatus) &&
      order.orderType === serviceTypes.delivery &&
      order.isDeliveryDelayed === null
    ) {
      if (time === 0) {
        setShowDelayed(true);
      }
    }
  };
  const edgePadding = { top: 50, right: 50, bottom: 10, left: 50 };
  const panToLocation = () => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(
        ['source', 'destination'],
        {
          edgePadding,
        },
        false,
      );
    }
  };

  const mobilePadding = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: GS.primaryColor,
        }}>
        {order !== null ? (
          <View
            style={{
              marginTop: StatusBar.currentHeight,
              flex: 1,
            }}>
            <Animated.View
              style={{
                position: 'absolute',
                top: 30,
                left: 0,
                zIndex: 101,
                // transform: [{ translateY: topButtonY }],
              }}>
              <Touchable onPress={onBack}>
                <IOIcon
                  name="md-arrow-back"
                  size={30}
                  color={GS.secondaryColor}
                />
              </Touchable>
            </Animated.View>
            {order &&
              order.deliveryOrderID &&
              order.deliveryInfo &&
              order.orderTpye === serviceTypes.pickUp && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: 30,
                    right: 0,
                    zIndex: 101,
                    // transform: [{ translateY: topButtonY }],
                  }}>
                  <Touchable onPress={openMap} disabled={!order.location}>
                    <FAIcon name="route" size={30} color="#4285F4" />
                    <BoldText style={{ color: '#4285F4', marginLeft: 10 }}>
                      GET DIRECTIONS
                    </BoldText>
                  </Touchable>
                </Animated.View>
              )}
            <Animated.View
              style={{
                // opacity: blurViewOpacity,
                flex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                // zIndex: zIndexBlur,
              }}>
              <BlurView style={{ flex: 1 }} blurType="dark" blurAmount={100} />
            </Animated.View>

            <Animated.View
              style={{
                backgroundColor: '#fff',
                // height: mapHeight,
                height:'100%'
              }}>
              {order &&
              order?.deliveryInfo?.deliveryTrackingLink &&
              isMashkorOrderInProcess &&
              !webViewError ? (
                <WebView
                  source={{ uri: order.deliveryInfo.deliveryTrackingLink }}
                  style={{ flex: 1, minHeight: 200, marginTop: -50 }}
                  onError={() => setWebViewError(true)}
                  onHttpError={() => setWebViewError(true)}
                  renderError={() => setWebViewError(true)}
                />
              ) : (
                <MapView
                  ref={mapRef}
                  provider="google"
                  loadingEnabled={true}
                  style={{ flex: 1, minHeight: 200 }}
                  region={order.location}>
                  <Marker coordinate={order.location} identifier={'source'}>
                    <Svg width={50} height={40}>
                      <Image href={MAP_PIN} width={50} height={40} />
                    </Svg>
                  </Marker>

                  {order?.userAddress ? (
                    <ClusterMarkerUser
                      cluster={false}
                      value={{
                        longitude: order.userAddress.location.coordinates[0],
                        latitude: order.userAddress.location.coordinates[1],
                      }}
                      identifier="destination"
                    />
                  ) : null}
                </MapView>
              )}
            </Animated.View>

            <BottomSheet
              onOpenStart={() => {
                panToLocation();
              }}
              onCloseStart={() => {
                panToLocation();
              }}
              ref={sheetRef}
              enabledBottomClamp={true}
              initialSnap={1}
              callbackNode={animation}
              snapPoints={['80%', '65%', '35%']}
              overdragResistanceFactor={0}
              enabledInnerScrolling={true}
              enabledContentGestureInteraction={
                enabledContentGestureInteraction
              }
              renderHeader={() => <BottomSheetHeader openMap={openMap} />}
              renderContent={() => (
                <View>
                  <Animated.ScrollView
                    onScroll={(event) => {
                      const ww = Math.floor(windowWidth);
                      const scrollXPosition = Math.floor(
                        event.nativeEvent.contentOffset.x,
                      );
                      if (scrollXPosition === ww) {
                        setEnabledContentGestureInteraction(false);
                      }

                      if (scrollXPosition === 0) {
                        setEnabledContentGestureInteraction(true);
                      }
                    }}
                    scrollEnabled={false}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    ref={scrollRef}
                    contentContainerStyle={{
                      flexGrow: 1,
                      backgroundColor: GS.primaryColor,
                    }}
                    decelerationRate="fast"
                    pagingEnabled={true}
                    horizontal
                    style={{
                      height: '100%',
                    }}>
                    <View
                      style={{
                        width: windowWidth,
                        flex: 1,
                        paddingHorizontal: 20,
                        paddingBottom: 10,
                        backgroundColor: '#fff',
                      }}>
                      <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flexGrow: 1,
                            }}>
                            <View
                              style={{
                                flexGrow: 1,
                                justifyContent: 'center',
                              }}>
                              <BoldText
                                style={{
                                  color: 'silver',
                                  fontSize: normalizedFontSize(7),
                                }}>
                                ORDER FROM
                              </BoldText>
                              <BoldText
                                style={{ fontSize: normalizedFontSize(7) }}>
                                {order.storeName}
                              </BoldText>
                            </View>
                            <PrepTimer
                              timeStampEta={
                                order.orderType === serviceTypes.delivery
                                  ? order.deliveryEta
                                  : order.timeStampEta
                              }
                              vendor={order.vendor}
                              orderStatus={order.orderStatus}
                              orderType={order.orderType}
                              timeRemaining={(time) => {
                                handlePopUp(time);
                              }}
                            />
                            {order.orderStatus === 'Pending' && (
                              <View style={{ flexGrow: 1 }}>
                                <TouchableOpacity
                                  onPress={onCancelOrder}
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 8,
                                    borderWidth: 1.5,
                                    borderColor: GS.errorRed,
                                    borderRadius: 10,
                                    flexGrow: 1,
                                  }}>
                                  <BoldText
                                    style={{
                                      color: GS.errorRed,
                                      fontSize: normalizedFontSize(7),
                                    }}>
                                    Cancel
                                  </BoldText>
                                </TouchableOpacity>
                              </View>
                            )}
                            {![
                              status.ready,
                              status.accepted,
                              status.pending,
                              status.enRoute,
                            ].includes(order.orderStatus) && order.orderCategory !== "Coupons" && (
                              <TouchableOpacity
                                onPress={_onCartAdd}
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginLeft: 'auto',
                                  marginRight: 10,
                                  flexDirection: 'row',
                                }}>
                                <EIIcon name="redo" size={40} color="#00b800" />
                                <RText
                                  style={{
                                    color: 'gray',
                                    fontSize: normalizedFontSize(7),
                                  }}>
                                  Reorder
                                </RText>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        {order.orderRating === 0 &&
                          order.orderStatus === 'Completed' && (
                            <OrderReview order={order} />
                          )}
                        <View style={{ marginTop: 10 }}>
                          <View
                            style={{
                              flexDirection: 'column',
                            }}>
                            <BoldText
                              style={{ fontSize: normalizedFontSize(10) }}>
                              Order No. {order.orderNumber}
                            </BoldText>

                            <BoldText
                              style={{
                                color: GS.logoGreen,
                                fontSize: normalizedFontSize(8),
                              }}>
                              {order?.orderType}
                            </BoldText>
                          </View>
                          <OrderLottie
                            orderStatus={order.orderStatus}
                            orderType={order.orderType}
                          />
                          <OrdeSteps
                            orderStatus={order.orderStatus}
                            orderType={order.orderType}
                            paymentMethod={order.paymentMethod}
                            showDelayed={showDelayed}
                          />
                          <View style={{ marginVertical: 20 }}>
                            <BoldText
                              style={{
                                fontSize: normalizedFontSize(7),
                                color: 'silver',
                              }}>
                              PLACED AT
                            </BoldText>
                            <BoldText
                              style={{ fontSize: normalizedFontSize(7) }}>
                              {toLocalTime(order.timeStamp)}
                            </BoldText>
                          </View>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              sheetRef.current.snapTo(0);
                              scrollRef.current.getNode().scrollTo({
                                x: windowWidth,
                                y: 0,
                                animated: true,
                              });
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexGrow: 1,
                              borderTopWidth: 0.5,
                              borderTopColor: 'silver',
                              padding: 20,
                            }}>
                            <IOIcon name="apps" size={25} color="silver" />
                            <BoldText
                              style={{
                                marginRight: 'auto',
                                marginLeft: 15,
                                color: '#00000090',
                                fontSize: normalizedFontSize(7.5),
                              }}>
                              More Details
                            </BoldText>
                            <MIIcon
                              name="chevron-right"
                              size={30}
                              color="silver"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              order?.deliveryInfo?.driverMobile &&
                              isMashkorOrderInProcess
                                ? setShowCallingModal(true)
                                : call({
                                    number: order.phone, // String value with the number to call
                                    prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
                                  });
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexGrow: 1,
                              borderTopWidth: 0.5,
                              borderTopColor: 'silver',
                              padding: 20,
                            }}>
                            <MIIcon
                              name="local-phone"
                              size={25}
                              color="silver"
                            />
                            <BoldText
                              style={{
                                marginRight: 'auto',
                                marginLeft: 15,
                                color: '#00000090',
                                fontSize: normalizedFontSize(7.5),
                              }}>
                              {order?.deliveryInfo?.driverMobile &&
                              isMashkorOrderInProcess
                                ? 'Call Restaurant / Driver'
                                : 'Call Restaurant'}
                            </BoldText>
                            <MIIcon
                              name="chevron-right"
                              size={30}
                              color="silver"
                            />
                          </TouchableOpacity>
                          <ContactKatchWhatsapp labs={labs} order={order}/>
                        </View>
                      </View>
                    </View>

                    {/* Order items */}
                    <View
                      style={{
                        width: windowWidth,
                        backgroundColor: '#fff',
                        flex: 1,
                        paddingBottom: 10,
                        paddingHorizontal: 20,
                      }}>
                      <View style={{ position: 'absolute', left: 0, top: 0 }}>
                        <TouchableOpacity
                          onPress={() =>
                            scrollRef.current
                              .getNode()
                              .scrollTo({ x: 0, y: 0, animated: true })
                          }>
                          <MIIcon
                            name="chevron-left"
                            size={40}
                            color="silver"
                          />
                        </TouchableOpacity>
                      </View>

                      <BoldText
                        style={{
                          fontSize: 25,
                          marginRight: 'auto',
                          marginLeft: 'auto',
                          marginTop: 10,
                        }}>
                        More Details
                      </BoldText>
                      <MoreDetails order={order} />
                    </View>
                  </Animated.ScrollView>
                </View>
              )}
            />
          </View>
        ) : null}
        <ProgressLoading
          backgroundColor={order ? '#00000020' : '#fff'}
          onBack={order ? null : navigation.goBack}
          visible={isLoading}
        />
        <View
          style={{
            height: mobilePadding.bottom,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: GS.primaryColor,
            zIndex: 100,
            width: '100%',
          }}
        />
      </SafeAreaView>

      <CallOptionModal />
    </>
  );
};

const ContactKatchWhatsapp = ({labs, order}) => {
  
  const [show, setShow] = useState(false);
  const onClick = () => {
    try {
      const user = auth().currentUser;
      const orderTime = toLocalTime(order.timeStamp);
      const message = [`Order No. ${order.orderNumber} - ${order.orderType}`];
      message.push('\n\n');
      message.push(`Ordered on: ${orderTime}`);
      message.push('\n');
      message.push(`From: ${order.storeName}`);
      message.push('\n');
      message.push(`Status: ${order.orderStatus}`);
      message.push('\n\n');
      if (user) {
        message.push('---------Customer Info---------');
        message.push('\n\n');
        if (user.displayName) {
          message.push(`Name: ${user.displayName}`);
          message.push('\n');
        }
        if (user.email) {
          message.push(`Email: ${user.email}`);
          message.push('\n');
        }
        if (user.phoneNumber) {
          message.push(`Phone: ${user.phoneNumber}`);
          message.push('\n');
        }

        message.push('\n\n');
      }
     
      message.push('----------------------------------');


      Linking.openURL(`whatsapp://send?phone=${labs?.orderSupport?.whatsAppContact}&text=${message.join('')}`).catch(
        (_) => {},
      );
    } catch {
      setShow(false);
    }
  };

  useEffect(() => {
    try {
      const check =
        Platform.OS === 'android'
          ? Share.isPackageInstalled('com.whatsapp').then(
              ({ isInstalled }) => isInstalled,
            )
          : Linking.canOpenURL('whatsapp://send');

      check.then((isInstalled) => {
        setShow(isInstalled);
      });
    } catch (e) {}
  }, []);

  return (
    show && labs?.orderSupport?.whatsAppContact && (
      <TouchableOpacity
        onPress={onClick}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          borderTopWidth: 0.5,
          borderTopColor: 'silver',
          padding: 20,
        }}>
        <IOIcon name="md-logo-whatsapp" size={25} color={GS.logoGreen} />
        <BoldText
          style={{
            marginRight: 'auto',
            marginLeft: 15,
            color: '#00000090',
            fontSize: normalizedFontSize(7.5),
          }}>
          Contact Katch
        </BoldText>
        <MIIcon name="chevron-right" size={30} color="silver" />
      </TouchableOpacity>
    )
  );
};

const mapStateToProps = (state) => {
  return {
    items: state.cart.addedItems,
    labs: state.app.marketingData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch(addToCart(product));
    },
    addQuantity: (cartItemNum) => {
      dispatch(addQuantity(cartItemNum));
    },
    clearCart: () => {
      dispatch(clearCart());
    },
    setStoreInfo: (storeInfo) => {
      dispatch(setStoreInfo(storeInfo));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);

const PrepTimer = ({
  timeStampEta,
  orderStatus,
  orderType,
  vendor,
  onCartAdd,
  isDeliveryDelayed = null,
  timeRemaining,
}) => {
  const showByType = {
    [serviceTypes.delivery]: [status.accepted, status.enRoute, status.ready],
    [serviceTypes.pickUp]: [status.accepted],
  };

  if (showByType[orderType].includes(orderStatus)) {
    const timer = useRef(new Timer()).current;
    const minTillReady = timeDifference(timeStampEta);
    const [timeTillReady, setTimeTillReady] = useState(minTillReady);
    if (minTillReady) {
      timer.start({
        countdown: true,
        startValues: { minutes: minTillReady + 1 },
      });
    }

    useEffect(() => {
      const timerEvent = (e) => {
        const min = e.detail.timer.getTotalTimeValues().minutes;
        setTimeTillReady(min);
        timeRemaining(min);
      };
      timer.addEventListener('minutesUpdated', timerEvent);
      return () => timer.removeEventListener('minutesUpdated', timerEvent);
    });

    const mashkorStatusCheck = [status.enRoute];

    if (
      mashkorStatusCheck.includes(orderStatus) &&
      orderType === serviceTypes.delivery &&
      vendor === 'mashkor'
    ) {
      return null;
    }

    return (
      <View
        style={{
          justifyContent: 'center',
        }}>
        <BoldText style={{ color: 'silver', fontSize: normalizedFontSize(7) }}>
          EST. TIME LEFT
        </BoldText>
        <BoldText
          style={{ marginLeft: 'auto', fontSize: normalizedFontSize(7) }}>
          {orderType === serviceTypes.delivery
            ? (timeTillReady <= 5 ? '< 5' : timeTillReady) + ' MIN'
            : null}
          {orderType === serviceTypes.pickUp
            ? (timeTillReady <= 1 ? '< 1' : timeTillReady) + ' MIN'
            : null}
        </BoldText>
      </View>
    );
  }

  return null;
};

const BottomSheetHeader = ({ openMap }) => (
  <>
    <View
      style={{
        paddingVertical: 15,
        backgroundColor: GS.primaryColor,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 150,
          height: 7,
          backgroundColor: '#e2e2e2',
          borderRadius: 20,
        }}
      />
    </View>
  </>
);

const OrderReview = (props) => {
  const { order } = props;

  const [showAppreciation, setShowAppreciation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [rating, setRating] = useState(0);

  const [reviewStore] = useMutation(REVIEW_STORE);

  const onConfirm = () => {
    animateLayout();
    reviewStore({
      variables: {
        review: {
          storeId: order.storeId,
          orderId: order._id,
          rating: rating,
        },
      },
    });

    setShowAppreciation(true);
    setTimeout(() => {
      animateLayout();
      setSubmitted(true);
    }, 1500);
  };

  return !submitted ? (
    <View style={{ paddingVertical: 15 }}>
      <View
        style={{
          justifyContent: 'center',
          height: showAppreciation ? 0 : 'auto',
          overflow: showAppreciation ? 'hidden' : 'visible',
        }}>
        <BoldText style={{ marginBottom: 10, fontSize: normalizedFontSize(7) }}>
          How was your experience ?
        </BoldText>
        <View style={{ flexDirection: 'row' }}>
          <AirbnbRating
            count={5}
            showRating={false}
            defaultRating={rating}
            size={30}
            onFinishRating={(value) => {
              if (rating === 0) {
                animateLayout();
              }
              setRating(value);
            }}
          />
          {rating > 0 && (
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: GS.secondaryColor,
                flexGrow: 1,
                marginHorizontal: 10,
                borderRadius: 10,
              }}>
              <RText style={{ color: '#fff', fontSize: normalizedFontSize(7) }}>
                Confirm
              </RText>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/*  */}
      {showAppreciation && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <BoldText style={{ fontSize: 25 }}>Thank you</BoldText>
        </View>
      )}
    </View>
  ) : null;
};

const Touchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 8px 10px;
  margin: 10px;
  z-index: 1000;
  border-radius: 100px;
  background-color: ${GS.primaryColor};
  flex-direction: row;
  align-items: center;
`;
