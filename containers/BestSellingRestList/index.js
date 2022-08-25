import React, {memo, useState, useEffect} from 'react';
import {ScrollView, View, Dimensions} from 'react-native';
import Card from '../../components/BestRestCard';
import {RES} from '../../assets/images';
import Loading, {SignalLoading} from './loading';
import {Viewport} from '@skele/components';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/LandingListHeader';
import { animateLayout } from '../../components/Helpers';

const ViewportLoading = Viewport.Aware(SignalLoading);

const BestSellingRestList = ({stores, fetchMore}) => {
  
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [state, setState] = useState(null);

  useEffect(() => {
    if(!state || stores !== state){
      setState(stores);
    }
  },[stores])

  useEffect(() => {
    if (isFetchingMore) {
      fetchMore(state.nextCursor,(newData) => {
        animateLayout()
        setIsFetchingMore(false);
        setState(newData);
      });
    }
  }, [isFetchingMore]);

  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: '#fff', paddingBottom: 20}}>
      <Header title="Best Selling Restaurants" imageSrc={RES} />
      {state ? (
        <Viewport.Tracker>
          <ScrollView
            scrollEventThrottle={16}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}>
            {state.data.map((item, index) => {
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
                  />
                </View>
              );
            })}
            {state.next &&
              <ViewportLoading
                onViewportEnter={() => {
                  if(!isFetchingMore){
                  setIsFetchingMore(true);
                  }
                }}
                />}
          </ScrollView>
        </Viewport.Tracker>
      ) : (
        <Loading />
      )}
    </View>
  );
};

export default memo(BestSellingRestList);
