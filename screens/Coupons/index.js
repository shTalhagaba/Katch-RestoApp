/* eslint-disable react-native/no-inline-styles */
//react
import { useLazyQuery } from '@apollo/react-hooks';
import { Viewport } from '@skele/components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import call from 'react-native-phone-call';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import Header from '../../components/AccountHeader';
import CouponCartQuantityPrice from '../../components/CouponCartQuantityPrice';
import { GET_COUPON_DETAIL } from '../../components/GraphQL/Coupon/query';
import { generateCouponImgScr } from '../../components/Helpers';
import {
  addCouponQuantity,
  addCouponToCart,
  clearCouponCart,
  subtractCouponQuantity,
} from '../../components/Redux/Actions/couponcartActions';
import ShareButton from '../../components/ShareButton';
import CouponImagesModal from '../../containers/CouponImagesModal';
import CouponSidler from '../../containers/CouponSidler';
import Loading from '../../containers/SearchResults/loading';
//others
import GS, { BoldText, normalizedFontSize, RText } from '../../GlobeStyle';
import style from '../../screens/RestaurantInfo/style';
import GoToCartButton from '../Restaurant/MainScreen/GoToCart';
import Address from '../RestaurantInfo/Address';
import MapLocation from '../RestaurantInfo/Map';
import styles from './style';

const CouponsView = ({
  navigation,
  route,
  params,
  addCoupon,
  addCouponQuantity: addQuantity,
  subtractCouponQuantity: subQuantity,
  clearCart,
  couponCart,
  ...props
}) => {
  const { _id, coupon } = route.params;
  const [couponDetail, setCouponDetail] = useState(
    coupon || { terms: [], sellerId: {} },
  );
  const [showImagesModal, setShowImagesModal] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const toggleImagesModal = (index) => {
    setShowImagesModal(index);
  };

  const [getCouponDetail, { refetch, loading, called }] = useLazyQuery(
    GET_COUPON_DETAIL,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        couponId: _id,
      },
      onCompleted: (query) => {
        setCouponDetail(query.getCouponDetail);
      },
    },
  );

  useEffect(() => {
    if (_id && !coupon) {
      getCouponDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    try {
      called ? refetch() : getCouponDetail();
    } catch (error) {}
  };
  const calculatePercent = (
    /** @type {number} */ a,
    /** @type {number} */ b,
  ) => {
    return Math.floor(((a - b) / a) * 100) + '%';
  };

  const _showImagesModal = (index) => {
    toggleImagesModal(index);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.wrapper}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
          }}>
          <Header
            goBack={() => navigation.goBack()}
            icon={null}
            title={couponDetail.sellerId.shopName || 'Coupon'}
            sellerData={couponDetail.sellerId}
            clickable={true}
          />
        </View>
        <Viewport.Tracker>
          <ScrollView
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);

                  onRefresh().finally(() => {
                    setRefreshing(false);
                  });
                }}
              />
            }
            contentContainerStyle={styles.contentContainerStyle}>
            {!loading ? (
              <>
                <View style={{ marginBottom: 10, flex: 1 }}>
                  <CouponSidler
                    couponsImages={couponDetail.subImage}
                    couponId={couponDetail._id}
                    showImagesModal={_showImagesModal}
                  />

                  <View style={styles.contentContainer}>
                    <View style={styles.discountLabelWrapper}>
                      <RText style={styles.discountLabel}>
                        {calculatePercent(
                          couponDetail.beforePrice,
                          couponDetail.afterPrice,
                        )}
                      </RText>
                      <RText
                        style={[
                          styles.discountLabel,
                          { fontSize: normalizedFontSize(5) },
                        ]}>
                        OFF
                      </RText>
                    </View>
                    <View>
                      <RText style={styles.name}>{couponDetail.name}</RText>
                    </View>

                    <View
                      style={[
                        styles.flexRow,
                        styles.mh60,
                        styles.justifyCenter,
                        {
                          paddingVertical: 0,
                        },
                      ]}>
                      <View style={styles.twoThird}>
                        <CouponCartQuantityPrice coupon={couponDetail} />
                      </View>
                      <View style={styles.shareButtonWrapper}>
                        <ShareButton
                          link={`https://app.katchkw.com/coupon/${
                            _id || couponDetail._id
                          }`}
                          roundedShare={true}
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.flexRow,
                        styles.mh60,
                        styles.justifyCenter,
                        {
                          paddingVertical: 0,
                        },
                      ]}>
                      <View
                        style={[
                          styles.flexRow,
                          styles.justifyCenter,
                          {
                            paddingVertical: 0,
                          },
                        ]}>
                        <RText style={styles.cpricel}>{'Coupon Price: '}</RText>
                        <BoldText style={styles.strikeprice}>
                          {couponDetail.beforePrice} {'KD'}
                        </BoldText>
                        <View style={{ width: 10 }} />
                        <BoldText style={styles.cprice}>
                          {couponDetail.afterPrice} {'KD'}
                        </BoldText>
                      </View>
                      <View style={styles.contentRight} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={[
                          styles.pv2,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            alignContent: 'center',
                            paddingTop: 0,
                            paddingBottom: 15,
                          },
                        ]}>
                        <RText style={styles.expireLabel}>{'Expires: '}</RText>
                        <RText style={[styles.expireText]}>
                          {moment(couponDetail.endDate).format('DD MMM YYYY')}
                        </RText>
                      </View>
                    </View>
                    <View style={[styles.flexRow, styles.pv2]}>
                      <RText style={styles.description}>
                        {couponDetail.description}
                      </RText>
                    </View>
                    {couponDetail?.sellerId?.location && (
                      <View style={styles.storeAddressContainer}>
                        <Address
                          address={null}
                          style={{
                            ...style,
                            addressContainerOuter: {
                              paddingHorizontal: 0,
                              paddingVertical: 5,
                            },
                          }}
                          location={couponDetail?.sellerId?.location}
                          storeName={null}
                        />
                        <CallSeller phone={couponDetail.sellerId.phone} />
                      </View>
                    )}
                    {couponDetail?.sellerId?.location && (
                      <View style={{ paddingVertical: 15 }}>
                        <MapLocation
                          location={{
                            latitude: couponDetail?.sellerId?.location.latitude,
                            longitude:
                              couponDetail?.sellerId?.location.longitude,
                          }}
                        />
                      </View>
                    )}
                    <View style={styles.pv2}>
                      <RText style={styles.expireLabel}>
                        {'Terms & Conditions: '}
                      </RText>
                      {couponDetail.terms.map((x) => {
                        return (
                          <RText key={x} style={styles.description}>
                            <RText style={styles.bullet}>{'\u2B24'}</RText> {x}
                          </RText>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <Loading />
            )}
          </ScrollView>
        </Viewport.Tracker>
      </View>
      <CouponImagesModal
        couponId={couponDetail._id}
        images={couponDetail.subImage}
        showImagesModal={showImagesModal}
        toggleImagesModal={toggleImagesModal}
      />
      <View style={{ marginBottom: 10 }}>
        <GoToCartButton shopName={''} couponRoute />
      </View>
    </SafeAreaView>
  );
};

const CallSeller = (props) => {
  const { phone } = props;
  const placeCall = () => {
    call({
      number: phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
    });
  };
  return (
    phone && (
      <TouchableOpacity style={styles.callButton} onPress={placeCall}>
        <SLIcon name="phone" color={GS.logoGreen} size={15} />
        <RText style={styles.callButtonText}>CALL</RText>
      </TouchableOpacity>
    )
  );
};

const mapStateToProp = (state) => {
  return {
    productCart: state.cart,
    couponCart: state.couponCart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCoupon: (coupon) => dispatch(addCouponToCart(coupon)),
    addCouponQuantity: (coupon) => dispatch(addCouponQuantity(coupon)),
    subtractCouponQuantity: (coupon) =>
      dispatch(subtractCouponQuantity(coupon)),
    clearCart: () => dispatch(clearCouponCart()),
  };
};

export default connect(mapStateToProp, mapDispatchToProps)(CouponsView);
