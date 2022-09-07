import React, {useRef, useState, useEffect} from 'react';
import {View, Animated, StatusBar ,ScrollView, SafeAreaView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import { useLazyQuery } from '@apollo/client'
import {Viewport} from '@skele/components';

import {GET_STORES_COLLECTION_ID} from '../../components/GraphQL';

import CollectionHeaderMin from './components/CollectionHeaderMin';
import CollectionHeader from './components/CollectionHeader';
import style from './components/style';

import Loading, {
  style as restListStyle,
} from '../../containers/Discovery/loading';
import RestCard from '../../components/BestRestCard';
import More from '../../components/Loading/More';

const ViewportAware = Viewport.Aware(More);

export default ({route, navigation}) => {
  const fetchingMore = useRef(false);
  const [state, setState] = useState(null);
  const translateY = useRef(new Animated.Value(0)).current;

  const collection = route?.params?.collection;
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  const opacity = translateY.interpolate({
    inputRange: [0, 171],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  let headerSpace = translateY.interpolate({
    inputRange: [171, 342],
    outputRange: [-statusBarHeight, 0],
    extrapolate: 'clamp',
  });

  const [getStoresByCollectionID] = useLazyQuery(GET_STORES_COLLECTION_ID, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (query) => {
      const {getStoresByCollectionID} = query;

      setState((stores) => {
        return {
          next: getStoresByCollectionID.next,
          nextCursor: getStoresByCollectionID.nextCursor,
          data: [
            ...(stores?.data ? [...stores.data] : []),
            ...getStoresByCollectionID.data,
          ],
        };
      });
      fetchingMore.current = false;
    },
  });

  const onViewportEnter = () => {
    if (!fetchingMore.current) {
      fetchingMore.current = true;
      getStoresByCollectionID({
        variables: {
          limit: 5,
          cursor: state.nextCursor,
          collectionID: collection._id,
        },
      });
    }
  };

  useEffect(() => {
    setState({...collection.sellers});
  }, [collection]);

  return (
    <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
      <StatusBar
        translucent={true}
        animated={true}
        backgroundColor={'#fff'}
      />
      <View style={[style.safeAreaStyle]}>
        <CollectionHeaderMin
          headerSpace={headerSpace}
          opacity={opacity}
          collectionInfo={collection}
          navigation={navigation}
        />
       
          <Animated.ScrollView
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {contentOffset: {y: translateY}},
                },
              ],
              {useNativeDriver: true},
            )}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={style.contentContainerStyle}>
            <CollectionHeader collectionInfo={collection} style={style} />
            <Viewport.Tracker>
              <ScrollView>
            {state ? (
              <>
                {state.data.map((item) => {
                  const onClick = () => {
                    navigation.navigate('Rest', {
                      screen: 'Info',
                      id: item._id,
                    });
                  };
                  return (
                    <View
                      key={item._id}
                      style={{marginHorizontal: 10, marginVertical: 5}}>
                      <RestCard
                        {...item}
                        onClick={onClick}
                        navigation={navigation}
                      />
                    </View>
                  );
                })}
                {state && state.next && (
                  <ViewportAware
                    onViewportEnter={onViewportEnter}
                    style={restListStyle.more}
                  />
                )}
              </>
            ) : (
              <Loading />
            )}
            </ScrollView>
               </Viewport.Tracker>
          </Animated.ScrollView>
     
      </View>
    </SafeAreaView>
  );
};
