import { useNavigation } from '@react-navigation/native';
import { Viewport } from '@skele/components';
import React, { memo, useRef } from 'react';
import { View } from 'react-native';
import RestCard from '../../components/BestRestCard';
import More from '../../components/Loading/More';
import Collection from '../Collections/index';
import Loading, { style } from './loading';

const ViewportAware = Viewport.Aware(More);

const Discovery = ({ list, showETA, fetchMoreServicesQuery, collections }) => {
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
      <View>
        {collections
          ? collections.map((collection) => {
              return (
                <Collection
                  key={`collection-${collection._id}`}
                  collection={collection}
                />
              );
            })
          : null}
      </View>
      {list ? (
        <>
          {list.data.map((item) => {
            const onClick = () => {
              navigation.navigate('Rest', {
                screen: 'Info',
                id: item._id,
              });
            };
            return (
              <View
                key={item._id}
                style={{ marginHorizontal: 10, marginVertical: 5 }}>
                <RestCard
                  {...item}
                  showETA={showETA}
                  onClick={onClick}
                  navigation={navigation}
                />
              </View>
            );
          })}
          {list.next && (
            <ViewportAware
              onViewportEnter={onViewportEnter}
              style={style.more}
            />
          )}
        </>
      ) : (
        <Loading />
      )}
    </View>
  );
};
export default memo(Discovery);
