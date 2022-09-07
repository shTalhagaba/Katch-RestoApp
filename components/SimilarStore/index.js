/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native';
import { Viewport } from '@skele/components';
import React, { memo, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RES } from '../../assets/images';
import Card from '../../components/BestRestCard';
import Header from '../../components/LandingListHeader';
import { GET_SIMILAR_STORE } from '../GraphQL';
import Loading, { SignalLoading } from './loading';
import style from './style';

const ViewportLoading = Viewport.Aware(SignalLoading);

const SimilarStore = ({ storeId }) => {
  const [stores, setStores] = useState();
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [state, setState] = useState(null);
  const limit = 10;
  const [getSimilarSellers, similarSellerQuery] = useLazyQuery(
    GET_SIMILAR_STORE,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      variables: {
        storeId: storeId,
        useTags: true,
        useCategory: true,
        options: { limit, page: 1 },
      },
      onCompleted: (query) => {
        setStores(query.getSimilarStores);
      },
    },
  );

  const fetchMore = (nextPage, callBack) => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const fetched = {
        data: [
          ...previousResult.getSimilarStores.data,
          ...fetchMoreResult.getSimilarStores.data,
        ],
        hasNextPage: fetchMoreResult.getSimilarStores.hasNextPage,
        nextPage: fetchMoreResult.getSimilarStores.nextPage,
      };
      callBack(fetched);
      return { getSimilarStores: fetched };
    };

    similarSellerQuery.fetchMore({
      variables: {
        storeId: storeId,
        useTags: false,
        useCategory: true,
        options: { limit, page: nextPage },
      },
      updateQuery,
    });
  };

  useEffect(() => {
    getSimilarSellers();
  }, []);

  useEffect(() => {
    if (!state || stores !== state) {
      setState(stores);
    }
  }, [stores]);

  useEffect(() => {
    if (isFetchingMore) {
      fetchMore(state.nextPage, (newData) => {
        setIsFetchingMore(false);
        setState(newData);
      });
    }
  }, [isFetchingMore]);

  const navigation = useNavigation();

  return state?.data?.length > 0 ? (
    <View style={style.wrapper}>
      <Header
        title="Similar Restaurants"
        imageSrc={RES}
        containerStyle
        imageStyle
        textStyle
      />
      {state ? (
        <Viewport.Tracker>
          <ScrollView
            scrollEventThrottle={16}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={style.mt10}>
            {state.data.map((item, index) => {
              return (
                <View
                  key={`${item._id}-${index}`}
                  style={[style.container, index < 1 ? style.pl10 : style.pl0]}>
                  <Card
                    {...item}
                    index={index}
                    navigation={navigation}
                    paddingHorizontal={0}
                    navigationScreen={'Info'}
                  />
                </View>
              );
            })}
            {state.hasNextPage && (
              <ViewportLoading
                onViewportEnter={() => {
                  if (!isFetchingMore) {
                    setIsFetchingMore(true);
                  }
                }}
              />
            )}
          </ScrollView>
        </Viewport.Tracker>
      ) : (
        <Loading />
      )}
    </View>
  ) : null;
};

export default memo(SimilarStore);
