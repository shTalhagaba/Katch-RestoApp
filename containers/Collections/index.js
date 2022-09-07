import React, { memo, useState, useEffect } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import Card from '../../components/BestRestCard';
import { RES } from '../../assets/images';
import Loading, { SignalLoading } from './loading';
import { Viewport } from '@skele/components';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client'
import { GET_STORES_COLLECTION_ID } from '../../components/GraphQL';
import Header from './Header';

const ViewportLoading = Viewport.Aware(SignalLoading);

const CollectionList = ({ collection }) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [state, setState] = useState(null);
  const { sellers: stores, name, _id: collectionID } = collection;
  useEffect(() => {
    if (!state || stores !== state) {
      setState(stores);
    }
  }, [stores]);

  const [getStoresByCollectionID] = useLazyQuery(GET_STORES_COLLECTION_ID, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (query) => {
      const { getStoresByCollectionID } = query;
      setState((stores) => {
        return {
          next: getStoresByCollectionID.next,
          nextCursor: getStoresByCollectionID.nextCursor,
          data: [...stores.data, ...getStoresByCollectionID.data],
        };
      });
      setIsFetchingMore(false);
    },
  });

  const fetchMore = () => {
    setIsFetchingMore(true);
    getStoresByCollectionID({
      variables: {
        limit: 5,
        cursor: state.nextCursor,
        collectionID: collectionID,
      },
    });
  };

  const navigation = useNavigation();

  const onViewAllClicked = () => {
    navigation.navigate('Collections', {
      collection: collection,
    });
  };

  return (
    <View style={{ backgroundColor: '#fff', paddingBottom: 20 }}>
      <Header title={name} imageSrc={RES} onViewAllClicked={onViewAllClicked} />
      {state ? (
        <Viewport.Tracker>
          <ScrollView
            scrollEventThrottle={16}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}>
            {state && state.data
              ? state.data.map((item, index) => {
                  return (
                    <View
                      key={`${item._id}-${index}`}
                      style={{
                        width: Dimensions.get('window').width - 30,
                        paddingRight: 10,
                        paddingLeft: index < 1 ? 10 : 0,
                      }}>
                      <Card
                        {...item}
                        index={index}
                        navigation={navigation}
                        paddingHorizontal={0}
                        navigationScreen={'Info'}
                      />
                    </View>
                  );
                })
              : null}
            {state.next && (
              <ViewportLoading
                onViewportEnter={() => {
                  if (!isFetchingMore) {
                    fetchMore();
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
  );
};

export default memo(CollectionList);
