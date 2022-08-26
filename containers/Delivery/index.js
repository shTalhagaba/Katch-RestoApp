/* eslint-disable react-native/no-inline-styles */
import React, { memo, useRef } from 'react';
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

const ViewportAware = Viewport.Aware(More);

const Delivery = ({ list, showETA, fetchMoreServicesQuery, collections }) => {
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
      <LocationPermission>
        {list ? (
          <>
            {list.data.map((item) => {
              return (
                <View
                  key={item._id}
                  style={{ marginHorizontal: 10, marginVertical: 5 }}>
                  <RestCard
                    {...item}
                    showETA={showETA}
                    navigation={navigation}
                    deliveryService={'delivery'}
                  />
                </View>
              );
            })}
            {list.data.length === 0 ? (
              <NoData
                title={"Sorry, we don't deliver here. "}
                description={
                  "We're expanding quickly, so please do check back soon!"
                }
              />
            ) : null}
            {list.next && (
              <ViewportAware
                onViewportEnter={onViewportEnter}
                style={style.more}
              />
            )}
          </>
        ) : (
          // @ts-ignore
          <Loading />
        )}
      </LocationPermission>
    </View>
  );
};
export default memo(Delivery);
