//react
import React, { useState ,useEffect} from 'react';
import {
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  BackHandler
} from 'react-native';

//3rd party
import { useQuery } from '@apollo/client'

//others
import GS, { RText, BoldText } from '../../GlobeStyle';
import Header from '../../components/AccountHeader';
import { FlatList } from 'react-native-gesture-handler';
import { GET_ALL_PROMO_CODES } from '../../components/GraphQL';
import Loading from '../../containers/SearchResults/loading';
import SignalLoading from '../../components/Loading/More';
import RenderItem from '../../components/BestRestCard';
import { promos as promoText } from '../../constants/staticText';
import { Viewport } from '@skele/components';

const Promos = ({ navigation, route, ...props }) => {
  const {} = props;
  const [promos, setPromos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchMore, setIsFetchMore] = useState(false);

  const onBack = () => {
    navigation.navigate('Home');  
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, []);

  const { refetch, fetchMore } = useQuery(GET_ALL_PROMO_CODES, {
    variables: {
      filter: { limit: 10, cursor: null },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (query) => {
      if (isFetchMore) {
        setIsFetchMore(false);
      } else {
        setPromos(query.getRestaurantsWithPromos);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
  });

  const DATA = promos ? promos.data : [];
  const onFetchMoreStore = () => {
    setIsFetchMore(true);
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      const newData = {
        data: [
          ...promos.data,
          ...fetchMoreResult.getRestaurantsWithPromos.data,
        ],
        nextCursor: fetchMoreResult.getRestaurantsWithPromos.nextCursor,
        next: fetchMoreResult.getRestaurantsWithPromos.next,
      };

      setPromos({ ...newData });

      return {
        ...previousResult,
        sellers: {
          data: [
            ...previousResult.getRestaurantsWithPromos.data,
            ...fetchMoreResult.getRestaurantsWithPromos.data,
          ],
          nextCursor: fetchMoreResult.getRestaurantsWithPromos.nextCursor,
          next: fetchMoreResult.getRestaurantsWithPromos.next,
        },
      };
    };

    fetchMore({
      variables: {
        filter: {
          cursor: promos.nextCursor,
          limit: 10,
        },
      },
      updateQuery,
    });
  };

  const onEndReached = () => {
    if (promos && promos.next) {
      onFetchMoreStore();
    }
  };

  const onRefresh = (callback) => {
    setIsRefreshing(true);
    setPromos(null);
    setIsLoading(true);
    refetch({ filter: route.params.promoFilter });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          backgroundColor: GS.primaryColor,
          flex: 1,
        }}>
        <Header
          // goBack={() => navigation.goBack()}
          goBack={()=> onBack()}
          title={route.params.headerTitle.split('\n').join(' ').toUpperCase()}
        />

        {!isLoading ? (
          DATA.length > 0 ? (
            <Viewport.Tracker>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                contentContainerStyle={{
                  flexGrow: 1,
                  backgroundColor: '#fff',
                  paddingBottom: 30,
                  paddingHorizontal: 10,
                }}
                data={DATA}
                onEndReachedThreshold={0.5}
                keyExtractor={(item, index) => item._id + index}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh(() => setIsRefreshing(false))}
                  />
                }
                ListFooterComponent={
                  promos && promos.next ? (
                    <View
                      style={{
                        marginTop: 15,
                        width: '100%',
                        justifyContent: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}>
                      <SignalLoading
                        style={{
                          borderRadius: 10,
                          paddingVertical: 12,
                        }}
                      />
                    </View>
                  ) : null
                }
                renderItem={({ item }) => {
                  return (
                    <View style={{ marginBottom: 10 }}>
                      <RenderItem {...item} navigation={navigation} />
                    </View>
                  );
                }}
              />
            </Viewport.Tracker>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 50,
              }}>
              <BoldText style={{ color: GS.secondaryColor, fontSize: 30 }}>
                {promoText.screenEmpty.title}
              </BoldText>
              <RText style={{ fontSize: 20, textAlign: 'center' }}>
                {promoText.screenEmpty.message}
              </RText>
            </View>
          )
        ) : (
          <Loading />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Promos;
