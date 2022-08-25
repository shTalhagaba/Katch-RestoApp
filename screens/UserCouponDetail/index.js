//react
import { useLazyQuery } from '@apollo/react-hooks';
import { Viewport } from '@skele/components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Header from '../../components/AccountHeader';
import { GET_USER_COUPON_DETAIL } from '../../components/GraphQL/Coupon/query';
import Loading from '../../containers/SearchResults/loading';
import { BoldText, RText } from '../../GlobeStyle';
import styles from './style';

const UserCouponDetail = ({ navigation, route, params, ...props }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { _id, userCoupon } = route.params;
  const [couponDetail, setCouponDetail] = useState(userCoupon);
  const [getCouponDetail, { refetch, loading, called }] = useLazyQuery(
    GET_USER_COUPON_DETAIL,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        couponId: _id,
      },
      onCompleted: (query) => {
        setCouponDetail(query.getUsersCouponDetail);
      },
    },
  );

  useEffect(() => {
    if (_id && !userCoupon) {
      getCouponDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    try {
      called ? refetch() : getCouponDetail();
    } catch (error) {}
  };

  const calculatePercent = (a, b) => {
    return Math.floor(((a - b) / a) * 100) + '%';
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.wrapper}>
        <Header
          goBack={() => navigation.goBack()}
          icon={null}
          title={'My Coupons'}
        />
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
                <View style={styles.container}>
                  <View style={styles.twrapper}>
                    <RText style={styles.name}>
                      {couponDetail.coupon.name}
                    </RText>
                  </View>
                  <View style={styles.centerView}>
                    <View style={[styles.topTriangle, styles.triangle]} />
                    <View style={styles.dashLine} />
                    <View style={[styles.bottonTriangle, styles.triangle]} />
                  </View>
                  <View style={styles.textContainer}>
                    <View>
                      <RText style={styles.logoRed}>
                        {calculatePercent(
                          couponDetail.coupon.beforePrice,
                          couponDetail.coupon.afterPrice,
                        )}{' '}
                        OFF
                      </RText>
                      <RText style={styles.desc}>
                        Valid Until{' '}
                        {moment(couponDetail.validUntil || Date.now()).format(
                          'DD MMM, YYYY',
                        )}
                      </RText>
                    </View>
                    <View style={styles.flexRow}>
                      <RText
                        style={[
                          styles.status,
                          couponDetail.status === 'active'
                            ? styles.logoGreenColor
                            : styles.logoRedColor,
                          styles.bullet,
                        ]}>
                        {'\u2B24'}
                      </RText>
                      <RText
                        style={[
                          styles.status,
                          couponDetail.status === 'active'
                            ? styles.logoGreenColor
                            : styles.logoRedColor,
                        ]}>
                        {couponDetail.status}
                      </RText>
                    </View>

                    <View style={styles.padding10}>
                      <BoldText style={styles.ccLabel}>Coupon Code</BoldText>
                      <BoldText style={styles.ccLabel}>
                        {couponDetail.couponCode}
                      </BoldText>
                    </View>
                    <View>
                      {couponDetail && (
                        <QRCode
                          size={220}
                          quietZone={20}
                          // logo={HOME}
                          // logoSize={80}
                          logoBackgroundColor="#fff"
                          value={couponDetail.couponQrCode}
                        />
                      )}
                    </View>
                    <View>
                      <RText style={styles.desc}>
                        Scan this code & redeem your coupon
                      </RText>
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
    </SafeAreaView>
  );
};

export default UserCouponDetail;
