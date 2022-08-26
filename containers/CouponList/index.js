/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useRef } from 'react';
import { View } from 'react-native';

//3rd party
import { useNavigation } from '@react-navigation/native';

//others
import RestCard from '../../components/BestRestCard';
import Loading, { style } from './loading';
import { Viewport } from '@skele/components';
import More from '../../components/Loading/More';
import NoData from './nodata';
import { LocationPermission } from '../../components/Permissions';
import { RText } from '../../GlobeStyle';
import CouponCard from '../../components/CouponCard';

const ViewportAware = Viewport.Aware(More);

const CouponList = ({ list, fetchMoreServicesQuery }) => {
  const navigation = useNavigation();
  const fetchingMore = useRef(false);
  const onViewportEnter = () => {
    if (!fetchingMore.current) {
      fetchingMore.current = true;
      fetchMoreServicesQuery(() => {
        fetchingMore.current = false;
      });
    }
  };
  //just renders restaurants cards
  return (
    <View style={{ marginTop: 10 }}>
      {list ? (
        <View style={{ paddingHorizontal: 15 }}>
          {list.data.map((x, y) => (
            <CouponCard coupon={x} key={y} navigation={navigation} />
          ))}
          {list.data.length === 0 ? (
            <NoData
              title={'Coupons are coming'}
              description={'Delicious deals on the way, Stay Tuned'}
            />
          ) : null}
          {list.next && (
            <ViewportAware
              onViewportEnter={onViewportEnter}
              style={style.more}
            />
          )}
        </View>
      ) : (
        // @ts-ignore
        <Loading />
      )}
    </View>
  );
};
export default memo(CouponList);
