import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { default as Lottie } from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import React, { useContext, useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal as ModalNative,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { default as MIIcon } from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import {
  BACKGROUND_DOTS,
  CREDIT_CARD,
  EXCLAMATION,
  K_NET,
} from '../../assets/images';
import { DeliveryDrone, MealReady } from '../../assets/Lottie';
import CouponCartQuantityPrice from '../../components/CouponCartQuantityPrice';
import { CREATE_COUPON_ORDER } from '../../components/GraphQL/Coupon/mutation';
import { generateCouponImgScr } from '../../components/Helpers';
import { clearCouponCart } from '../../components/Redux/Actions/couponcartActions';
import { Context as GLoadingContext } from '../../context/gLoading';
import { priceSymbol, RText, ActionButton as CheckOutButton, customFont, normalizedFontSize } from '../../GlobeStyle';
import { PlaceOrderButton } from '../../screens/checkout/Footer';
import Header from '../../screens/checkout/Header';
import KatchWebView from '../../screens/KatchWebView';
import styles from './styles';

const CouponCart = (props) => {
  const gLoading = useContext(GLoadingContext);
  const [createCouponOrder] = useMutation(CREATE_COUPON_ORDER);
  const { navigation } = props;

  const { couponCart, clearCart } = props;
  const availablePaymentMethod = [
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

  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [couponType, setCouponType] = useState('Pickup');
  const [showDeliveryTypeModal, setShowDeliveryTypeModal] = useState(null);
  const lottieMap = {
    Pickup: MealReady,
    Delivery: DeliveryDrone,
  };

  const [paymentModal, setPaymentModal] = useState(false);
  const [ogUrl, setOgUrl] = useState(null);

  const ogPaymentSuccess = (parsedUrl, err) => {
    setPaymentCancelled(false);
    if (err) {
      setPaymentModal(false);
      // eslint-disable-next-line no-alert
      alert('Something went wrong. Try again later');
      return;
    }
    const { query } = parsedUrl;
    if (query.result === 'CAPTURED') {
      const { isysid } = parsedUrl.query;
      gLoading.actions.toggleGLoading(true);
      submitOrder(isysid);
    } else if (query.result === 'CANCELLED') {
      setPaymentModal(false);
      setPaymentCancelled(true);
      setShowPaymentError(true);
    } else {
      setPaymentModal(false);
      setShowPaymentError(true);
    }
  };

  const submitOrder = async (transactionId) => {
    const couponList = couponCart.coupons.map((coupon) => {
      return {
        couponId: coupon._id,
        amount: `${coupon.afterPrice}`,
        noOfCoupon: `${coupon.total}`,
      };
    });
    setPaymentModal(false);

    try {
      await createCouponOrder({
        variables: {
          coupons: {
            coupons: couponList,
            transId: transactionId,
            total: `${couponCart.total}`,
          },
        },
      });
      clearCart();
      gLoading.actions.toggleGLoading(false);
      navigation.navigate('UserCoupons');
    } catch (e) {
      // console.log(e);
    } finally {
      gLoading.actions.toggleGLoading(false);
    }
  };

  const onCheckout = () => {
    if (auth().currentUser) {
      navigation.navigate('CouponCheckout', {
        total: (1 * couponCart.total).toFixed(3) + ' KD',
        appliedPromo: null,
        orderNotes: null,
        promoValue: null,
        selectedService: couponType,
        storeInfo: {},
        coupons: couponCart.coupons,
      });
      return;
    }else{
      navigation.navigate('Account', {
        screen: 'Login',
        cameFrom: () => {
          navigation.goBack();
        },
      });
      return;
    }

    return;
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.rootWrapper}>
        <Header
          shopName={'Coupon Cart'}
          goBack={() => navigation.goBack()}
          clearCart={clearCart}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {couponCart.coupons.map((coupon, y) => {
            return <CouponCartItem coupon={coupon} key={y} />;
          })}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.paymentTotalWrapper}>
            <RText style={styles.totalText}>Total</RText>
            <RText
              style={
                styles.total
              }>{`${couponCart.total} ${priceSymbol}`}</RText>
          </View>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <CheckOutButton onPress={onCheckout}>
              <RText
                style={{ color: 'white', fontSize: normalizedFontSize(8) }}
                fontName={customFont.axiformaMedium}>
                Check Out
              </RText>
            </CheckOutButton>
          </View>
        </View>
        <ModalNative
          animationType="slide"
          transparent={true}
          visible={paymentModal}
          style={styles.modalContainer}>
          <View style={styles.root}>
            <KatchWebView
              uri={ogUrl}
              onSuccess={ogPaymentSuccess}
              hideDialog={setPaymentModal}
            />
          </View>
        </ModalNative>
        <ModalNative
          animationType="slide"
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
        </ModalNative>
        <Modal
          onDismiss={() => setShowDeliveryTypeModal(false)}
          isVisible={showDeliveryTypeModal}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          backdropOpacity={0.5}
          onBackdropPress={() => setShowDeliveryTypeModal(false)}
          style={styles.modalWrapper}>
          <View style={styles.modalcontainer}>
            {
              <TouchableOpacity
                style={styles.opacityStyle}
                onPress={() => {
                  setCouponType('Pickup');
                  setShowDeliveryTypeModal(false);
                }}>
                <View style={styles.lottieContainer}>
                  <Lottie
                    autoPlay
                    loop={true}
                    source={lottieMap.Pickup}
                    style={styles.lottieStyle}
                  />
                </View>
                <RText style={styles.serviceButton}>{'Pickup'}</RText>
                <MIIcon name="chevron-right" size={20} color="gray" />
              </TouchableOpacity>
            }
            <TouchableOpacity
              style={[styles.opacityStyle]}
              onPress={() => {
                setCouponType('Delivery');
                setShowDeliveryTypeModal(false);
              }}>
              <View style={styles.lottieContainer}>
                <Lottie
                  autoPlay
                  loop={true}
                  source={lottieMap.Delivery}
                  style={styles.lottieStyle}
                />
              </View>
              <RText style={styles.serviceButton}>{'Delivery'}</RText>
              <MIIcon name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const CouponCartItem = ({ coupon }) => {
  return (
    <View style={styles.couponCartItemWrapper}>
      <View style={styles.img}>
        {typeof coupon.mainImage === 'string' && coupon.mainImage !== '' && <Image
          source={{ uri: generateCouponImgScr(coupon._id, coupon.mainImage) }}
          style={styles.smallThumb}
        />}
      </View>
      <View style={styles.desc}>
        <RText style={styles.descText}>{coupon.name}</RText>
      </View>
      <View style={{}}>
        <CouponCartQuantityPrice coupon={coupon} nativeSpinner={true} />
      </View>
    </View>
  );
};
const mapStateToProp = (state) => {
  return {
    couponCart: state.couponCart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(clearCouponCart()),
  };
};
export default connect(mapStateToProp, mapDispatchToProps)(CouponCart);
