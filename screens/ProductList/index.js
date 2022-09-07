import { useQuery } from '@apollo/client'
import { Viewport } from '@skele/components';
import React, { useState } from 'react';
import { ImageBackground, RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IFTAR_BACKGROUND, IFTAR_MENU } from '../../assets/images';
import Header from '../../components/AccountHeader';
import { GET_PRODUCTLIST_BY_CATEGORY } from '../../components/GraphQL/queries';
import ProductCardView from '../../components/ProductCardView';
import { productListText } from '../../constants/staticText';
import Loading from '../../containers/SearchResults/loading';
import GS, { BoldText, normalizedFontSize, RText } from '../../GlobeStyle';

const ProductList = ({ route, navigation, props }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [products, setProducts] = useState(null);

  const { refetch, loading } = useQuery(GET_PRODUCTLIST_BY_CATEGORY, {
    variables: {
      category: route.params.category,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setProducts(data);
      setIsRefreshing(false);
    },
  });

  const onRefresh = async (callback) => {
    setIsRefreshing(true);
    refetch({ category: route.params.category });
  };

  return (
    <ImageBackground
      source={IFTAR_BACKGROUND}
      style={{ width: '100%', height: '100%' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Header
            goBack={() => navigation.goBack()}
            icon={IFTAR_MENU}
            title={' '}
            style={{ backgroundColor: 'transparent' }}
            hideTitle={true}
            iconStyle={{ width: '100%' }}
            backIconName={'chevron-back'}
            backIconColor={'#fff'}
          />
          {!loading && products != null ? (
            <Viewport.Tracker>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => onRefresh(() => setIsRefreshing(false))}
                  />
                }>
                {products?.getItemCollection?.length > 0 ? (
                  products?.getItemCollection?.map((category) =>
                    category.items.map((item) => {
                      // <RText>{item.products.name}</RText>
                      const itemData = {
                        shopName: item.shopName,
                        shopId: item._id,
                        ...item.products,
                        ...item,
                        _id: item.products._id,
                      };
                      return (
                        <View
                          style={{
                            width: '90%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          <ProductCardView
                            item={itemData}
                            navigation={navigation}
                          />
                        </View>
                      );
                    }),
                  )
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 40,
                    }}>
                    <View
                      style={{
                        backgroundColor: GS.primaryColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 50,
                        borderRadius: 10,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingHorizontal: 30,
                      }}>
                      <BoldText
                        style={{
                          color: GS.secondaryColor,
                          fontSize: normalizedFontSize(10),
                          marginBottom: 5,
                        }}>
                        {productListText.title}
                      </BoldText>
                      <RText style={{ fontSize: normalizedFontSize(7), textAlign: 'center', lineHeight: 20 }}>
                        {productListText.message}
                      </RText>
                    </View>
                  </View>
                )}
              </ScrollView>
            </Viewport.Tracker>
          ) : (
            <Loading hideheader={true} />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProductList;
