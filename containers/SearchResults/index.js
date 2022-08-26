/* eslint-disable react-native/no-inline-styles */
import { Viewport } from '@skele/components';
import React, { Component, memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
//3rd party
import Animated from 'react-native-reanimated';
import { useStore } from 'react-redux';
import { BSD, RES } from '../../assets/images';
import RestCard from '../../components/BestRestCard';
import { animateLayout } from '../../components/Helpers';
import ListHeader from '../../components/LandingListHeader';
import ProductView from '../../components/ProductView';
import GS, { customFont, RText } from '../../GlobeStyle';
//others
import SearchFilterSortModal from '../SearchFilterModal';
import Loading, { LoadingDish } from './loading';

const SearchResults = (props) => {
  const {
    navigation,
    fetchMore,
    searchResults,
    setSearchResults,
    viewSortFilter,
    toggleSortFilter,
    isLoading,
    categories,
    tags,
    searchQuery,
    setSearchQuery,
    commenceSearch,
    requestLocation,
    onScroll,
    services,
    fetchMoreSearchProducts,
    fetchMoreSearchSellers,
    defaultFilter,
    showETA,
  } = props;

  const [isFetching, setIsFetching] = useState(false);

  const store = useStore();
  const state = store.getState();
  const selectedService = state.user.selectedService;
  
  const fetchMoreProducts = () => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      animateLayout();
      const newData = JSON.parse(JSON.stringify(searchResults));
      newData.products = {
        data: [
          ...newData.products.data,
          ...fetchMoreResult.searchProducts.data,
        ],
        nextCursor: fetchMoreResult.searchProducts.nextCursor,
        next: fetchMoreResult.searchProducts.next,
      };

      setSearchResults({ ...newData });

      setIsFetching(false);

      return {
        ...previousResult,
        products: {
          data: [
            ...previousResult.searchProducts.data,
            ...fetchMoreResult.searchProducts.data,
          ],
          nextCursor: fetchMoreResult.searchProducts.nextCursor,
          next: fetchMoreResult.searchProducts.next,
        },
      };
    };

    const searchInputs = {
      ...searchQuery,
    };

    fetchMoreSearchProducts({
      variables: {
        options: { limit: 10, page: searchResults.products.nextCursor },
        searchInputs,
      },
      updateQuery,
    });
  };

  const fetchMoreStore = () => {
    const updateQuery = (previousResult, { fetchMoreResult }) => {
      animateLayout();

      const newData = JSON.parse(JSON.stringify(searchResults));
      newData.sellers = {
        data: [...newData.sellers.data, ...fetchMoreResult.searchSellers.data],
        nextCursor: fetchMoreResult.searchSellers.nextCursor,
        next: fetchMoreResult.searchSellers.next,
      };
      setSearchResults({ ...newData });

      return {
        ...previousResult,
        sellers: {
          data: [
            ...previousResult.searchSellers.data,
            ...fetchMoreResult.searchSellers.data,
          ],
          nextCursor: fetchMoreResult.searchSellers.nextCursor,
          next: fetchMoreResult.searchSellers.next,
        },
      };
    };

    const searchInputs = {
      ...searchQuery,
    };

    fetchMoreSearchSellers({
      variables: {
        options: { limit: 10, page: searchResults.sellers.nextCursor },
        searchInputs,
      },
      updateQuery,
    });
  };

  const getHeaders = () => {
    const headers = [0];

    if (
      searchResults?.sellers?.data.length > 0 &&
      searchResults?.products?.data.length > 0
    ) {
      headers.push(searchResults?.sellers?.data.length + 1);
    }

    return headers;
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor: GS.primaryColor,
      }}>
      <View
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          overflow: 'hidden',
          backgroundColor: '#fff',
          flexGrow: 1,
        }}>
        {/* body */}
        {!isLoading ? (
          searchResults?.sellers?.data.length > 0 ||
          searchResults?.products?.data.length > 0 ? (
            <Viewport.Tracker>
              <ScrollView
                onScroll={onScroll}
                contentContainerStyle={{ paddingBottom: 120 }}
                stickySectionHeadersEnabled={true}
                stickyHeaderIndices={getHeaders()}
                onEndReachedThreshold={0.2}>
                {searchResults?.sellers?.data.length > 0 && (
                  <ListHeader
                    title="Restaurants"
                    imageSrc={RES}
                    containerStyle={{ paddingVertical: 10 }}
                  />
                )}
                {searchResults?.sellers?.data.map((data, index, arr) => {
                  const dataLength = searchResults?.sellers?.data.length;
                  return (
                    <View
                      key={data._id}
                      style={{
                        paddingHorizontal: 10,
                        marginBottom: 10,
                      }}>
                      <RestCard
                        {...data}
                        deliveryService={selectedService}
                        showETA={showETA}
                        navigation={navigation}
                      />
                      {index === dataLength - 1 &&
                        searchResults?.sellers.next && (
                          <ShowMore
                            fetchMoreStore={fetchMoreStore}
                            nextCursor={searchResults?.sellers.nextCursor}
                          />
                        )}
                    </View>
                  );
                })}

                {searchResults?.products?.data.length > 0 && (
                  <ListHeader
                    title="Dishes"
                    imageSrc={BSD}
                    containerStyle={{ paddingVertical: 10 }}
                  />
                )}
                {searchResults?.products?.data.map((data, index) => {
                  const dataLength = searchResults?.products.data.length;
                  const cardProps = {
                    _id: data._id,
                    shopName: data.storeName,
                    shopId: data.storeId,
                    shopCategory: data.shopCategory,
                    name: data.item.name,
                    price: data.item.price,
                    image: data.item.image,
                    category: data.item.category,
                  };

                  return (
                    <View key={cardProps._id + index}>
                      <DishCard {...cardProps} navigation={navigation} />
                      {index === dataLength - 1 &&
                        searchResults?.products.next && (
                          <LoadingDish
                            fetchMoreProducts={fetchMoreProducts}
                            setIsFetching={setIsFetching}
                            isFetching={isFetching}
                          />
                        )}
                    </View>
                  );
                })}
              </ScrollView>
            </Viewport.Tracker>
          ) : searchResults &&
            searchResults?.products?.data.length <= 0 &&
            searchResults?.sellers?.data.length <= 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
              }}>
              <RText
                style={{
                  fontSize: 20,
                  fontFamily: customFont.axiformaMedium,
                  color: GS.secondaryColor,
                }}>
                Nothing Here
              </RText>
              <RText
                style={{
                  fontSize: 15,
                  fontFamily: customFont.axiformaMedium,
                  color: GS.textColor,
                  marginTop: 20,
                }}>
                we can't find what you're looking for.
              </RText>
            </View>
          ) : null
        ) : (
          <View style={{ paddingTop: 10 }}>
            <Loading />
          </View>
        )}
      </View>
      {/* body */}

      {/* footer */}

      <SearchFilterSortModal
        requestLocation={requestLocation}
        commenceSearch={commenceSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={tags}
        categories={categories}
        viewSortFilter={viewSortFilter}
        toggleSortFilter={toggleSortFilter}
        services={services}
        defaultFilter={defaultFilter}
      />
      {/* footer */}
    </Animated.View>
  );
};

class DishCard extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* <Dish {...this.props} /> */}
        <ProductView item={this.props} navigation={navigation} />
      </View>
    );
  }
}

const ShowMore = ({ fetchMoreStore, nextCursor }) => {
  const [didClick, setDidClick] = useState(false);
  const [currentCursor, setCurrentCursor] = useState(nextCursor);

  useEffect(() => {
    if (currentCursor !== nextCursor) {
      setCurrentCursor(nextCursor);
      setDidClick(false);
    }
  }, [nextCursor]);

  return (
    <View
      style={{
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
      }}>
      <TouchableOpacity
        disabled={didClick}
        onPress={() => {
          fetchMoreStore();
          setDidClick(true);
        }}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: !didClick ? GS.secondaryColor : GS.bgGreenLight,
          alignItems: 'center',
          borderRadius: 10,
        }}>
        {!didClick ? (
          <RText style={{ color: '#fff', fontSize: 20 }}>
            Expand Restaurants
          </RText>
        ) : (
          <ActivityIndicator size="small" color={GS.logoYellow} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(SearchResults);
