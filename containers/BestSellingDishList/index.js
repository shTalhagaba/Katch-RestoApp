import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {FlatList, View, Dimensions, Image} from 'react-native';
import Card from '../../components/BestDishCard';
import {BSD} from '../../assets/images';
import GS, {BoldText} from '../../GlobeStyle';
import Loading, {SignalLoading} from './loading';
import {Viewport} from '@skele/components';
import Header from '../../components/LandingListHeader';
import {useNavigation} from '@react-navigation/native';

const ViewportAware = Viewport.Aware(SignalLoading);

const Title = styled(BoldText)`
  font-size: 15px;
  padding-left: 10px;
  color: #000;
  flex-grow: 1;
`;

const BestSellingDishList = ({products, fetchMore}) => {
  const [dishes, setDish] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    if (products && !dishes) {
      setDish(makeTwoDArray(products.data));
    }

    if (products === null) {
      setDish(null);
    }
  }, [products]);

  useEffect(() => {
    if (isFetchingMore) {
      fetchMore((data) => {
        setDish([...dishes, ...makeTwoDArray(data)]);
        setIsFetchingMore(false);
      });
    }
  }, [isFetchingMore]);

  return dishes === null || dishes.length > 0 ? (
    <View style={{backgroundColor: '#fff', marginTop: 10}}>
      <Header
      title="Best Selling Dishes"
      imageSrc={BSD}
      
      />
      {products?.data && dishes ? (
        <Viewport.Tracker>
          <FlatList
            horizontal
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            data={dishes}
            renderItem={({item, index}) => {
              return <RenderRow item={item} index={index} />;
            }}
            keyExtractor={(item, index) => `${item[0]._id}$ + ${index}`}
            ListFooterComponent={() =>
              products.next ? (
                <ViewportAware
                  preTriggerRatio={1.5}
                  onViewportEnter={() => {
                    if (!isFetchingMore) {
                      setIsFetchingMore(true);
                    }
                  }}
                />
              ) : null
            }
          />
        </Viewport.Tracker>
      ) : (
        <Loading />
      )}
    </View>
  ) : null;
};

const RenderRow = ({item, index}) => {
  const navigation = useNavigation();

  return (item &&
    <View
      key={item[0]._id + index}
      style={{
        width: Dimensions.get('window').width - 50,
        maxWidth: 400,
        marginHorizontal: 10,
      }}>
      <Card {...item[0]} key={item[0]._id} navigation={navigation}/>
      {item.length > 1 && <Card {...item[1]} key={item[1]._id} navigation={navigation}/>}
    </View>
  );
};

const makeTwoDArray = (data) => {
  const arrays = [];
  const size = 2;
  while (data.length > 0) {
    arrays.push(data.splice(0, size));
  }
  return arrays;
};

export {Title};
export default BestSellingDishList;
