//react
import { useLazyQuery } from '@apollo/client'
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { COUPON_THUMB } from '../../assets/images';
import Header from '../../components/AccountHeader';
import { GET_USER_COUPONS } from '../../components/GraphQL/Coupon/query';
import Loading from '../../containers/SearchResults/loading';
//others
import { BoldText, RText } from '../../GlobeStyle';
import styles from './style';
const UserCouponsView = ({ navigation, route, params, ...props }) => {
  const [userCoupon, setUserCoupons] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [getUsersCoupons, { refetch, loading, called }] = useLazyQuery(
    GET_USER_COUPONS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (query) => {
        setUserCoupons(query.getUsersCoupons);
      },
    },
  );

  useEffect(() => {
    getUsersCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    try {
      called ? refetch() : getUsersCoupons();
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.wrapper}>
        <Header
          goBack={() => navigation.goBack()}
          icon={null}
          title={'My Coupons'}
        />

        {!loading ? (
          userCoupon && (
            <FlatList
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
              contentContainerStyle={styles.contentContainerStyle}
              data={userCoupon}
              keyExtractor={(x, y) => y}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.noCouponsWrapper}>
                    <RText style={styles.noCoupons}>Sorry No Coupons !!</RText>
                  </View>
                );
              }}
              renderItem={({ item }) => {
                return (
                  item &&
                  item.coupon && (
                    <UserCouponCard userCoupon={item} navigation={navigation} />
                  )
                );
              }}
            />
          )
        ) : (
          <Loading />
        )}
      </View>
    </SafeAreaView>
  );
};

const UserCouponCard = memo((props) => {
  // @ts-ignore
  const { userCoupon, navigation } = props;
  const goToUserCouponDetail = () =>
    navigation.navigate('UserCouponDetail', {
      userCoupon,
      _id: userCoupon._id,
    });
  const calculatePercent = (a, b) => {
    return Math.floor(((a - b) / a) * 100) + '%';
  };
  return (
    <TouchableOpacity onPress={goToUserCouponDetail}>
      <View style={styles.usercardcontainer}>
        <View style={styles.justifyC}>
          <Image
            source={COUPON_THUMB}
            resizeMode="contain"
            style={styles.couponIcon}
          />
        </View>
        <View>
          <View style={[styles.topTriangle, styles.triangle]} />
          <View style={styles.dashLine} />
          <View style={[styles.bottonTriangle, styles.triangle]} />
        </View>

        <View style={styles.couponWrap}>
          <BoldText style={styles.name}>{userCoupon.coupon.name}</BoldText>
          <RText style={styles.logoRed}>
            {calculatePercent(
              userCoupon.coupon.beforePrice,
              userCoupon.coupon.afterPrice,
            )}{' '}
            OFF
          </RText>
          <RText style={styles.desc}>
            valid Until{' '}
            {moment(userCoupon.validUntil || Date.now()).format('DD MMM, YYYY')}
          </RText>
          <View style={styles.flexRow}>
            <RText
              style={[
                styles.status,
                userCoupon.status === 'active'
                  ? styles.logoGreenColor
                  : styles.logoRedColor,
                styles.bullet,
              ]}>
              {'\u2B24'}
            </RText>
            <RText
              style={[
                styles.status,
                userCoupon.status === 'active'
                  ? styles.logoGreenColor
                  : styles.logoRedColor,
              ]}>
              {userCoupon.status}
            </RText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default UserCouponsView;
