//react
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from 'react-native';
//3rd party
import { useQuery } from '@apollo/client'

import {Viewport} from '@skele/components';
import {connect} from 'react-redux';

//others
import {GET_USER_STORE_BOOKMARKS} from '../../components/GraphQL';
import Header from '../../components/AccountHeader';
import Card from '../../components/BestRestCard';
import {deepClone} from '../../components/Helpers';
import ShowMore from '../../components/Loading/More';
import Loading from './Loading';
import {bookmarks as bookmarksText} from '../../constants/staticText';
import GS, {normalizedFontSize, RText} from '../../GlobeStyle';

const ViewportAware = Viewport.Aware(ShowMore);

const Bookmarks = ({navigation, route, ...props}) => {
  const [bookmarksList, setBookmarksList] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState({
    doFetchMore: false,
    isFetchingMore: false,
  });

  const {fetchMore, refetch} = useQuery(GET_USER_STORE_BOOKMARKS, {
    variables: {
      filter: {
        cursor: null,
        limit: 4,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setBookmarksList(data.getBookMarkedStoresByUserID);
    },
    onError: (error) => {},
  });

  const onRefresh = async () => {
    try{
     await refetch();
    }catch(error){

    }
  };

  const bookmarksItems = bookmarksList
    ? bookmarksList.data.map((item) => {
        if (!props.user.bookmarks[item._id]) return null;

        return (
          <View
            key={item._id}
            style={{
              marginHorizontal: 10,
              marginBottom: 10,
            }}>
            <Card {...item} navigation={navigation} paddingHorizontal={0} />
          </View>
        );
      })
    : null;

  const fetchMoreBookmarks = () => {
    const updateQuery = (previousResult, {fetchMoreResult}) => {
      const newCursor = fetchMoreResult.getBookMarkedStoresByUserID.nextCursor;
      const newNext = fetchMoreResult.getBookMarkedStoresByUserID.next;
      const newData = fetchMoreResult.getBookMarkedStoresByUserID.data;
      const clonedState = deepClone(bookmarksList);
      const newList = clonedState.data.concat(newData);

      clonedState.data = newList;
      clonedState.nextCursor = newCursor;
      clonedState.next = newNext;
      setBookmarksList(clonedState);

      setState({
        doFetchMore: false,
        isFetchingMore: false,
      });

      return {
        getBookMarkedStoresByUserID: {
          data: previousResult.getBookMarkedStoresByUserID.data.concat(newData),
          nextCursor: newNext,
          next: newNext,
        },
      };
    };

    const filter = {
      cursor: bookmarksList.nextCursor,
      limit: 4,
    };

    fetchMore({variables: {filter}, updateQuery});
  };

  useEffect(() => {
    if (
      state.doFetchMore &&
      state.isFetchingMore === false &&
      bookmarksList &&
      bookmarksList.next
    ) {
      setState({
        ...state,
        isFetchingMore: true,
      });
      fetchMoreBookmarks();
    }
  }, [state]);
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
      }}>
      <Header goBack={() => navigation.goBack()} title="Bookmarks" />
      <Viewport.Tracker>
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                if(bookmarksList){
                  setRefreshing(true);
                  onRefresh()
                  .finally(() => {
                    setRefreshing(false);
                  });
                }
               
              }}></RefreshControl>
          }>
          {bookmarksItems}
          {bookmarksList && bookmarksList.next && (
            <ViewportAware
              onViewportEnter={() => {
                if (state.isFetchingMore === false) {
                  setState({
                    ...state,
                    doFetchMore: true,
                  });
                }
              }}
              style={{
                justifyContent: 'center',
                marginHorizontal: 20,
                marginBottom: 20,
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <View
                style={{
                  height: 80,
                  width: '100%',
                  backgroundColor: 'red',
                }}
              />
            </ViewportAware>
          )}
          {!bookmarksList && <Loading/>}
          {bookmarksList && Object.keys(props.user.bookmarks).length <= 0 && <Empty/>}

        </ScrollView>
      </Viewport.Tracker>
    </SafeAreaView>
  );
};

const Empty = () => {
  return(<View style={{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <RText>{bookmarksText.empty.title}</RText>
    <RText>{bookmarksText.empty.message}</RText>
  </View>)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(Bookmarks);
