import React, {memo, useRef} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import Card from '../../components/BestRestCard';
import {RES} from '../../assets/images';
import {BoldText} from '../../GlobeStyle';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/LandingListHeader';
import Loading,{style}  from './loading';
import {Viewport} from '@skele/components';
import More from '../../components/Loading/More';

const ViewportAware = Viewport.Aware(More);

const Title = styled(BoldText)`
  font-size: 15px;
  margin-right: 50px;
  padding: 10px 20px;
  color: #000;
  flex-grow: 1;
`;

const LandingOpenRestList = (props) => {
  const {openStores, fetchMoreOpenStores, hideHeader} = props;
  const navigation = useNavigation();
  const fetchingMore = useRef(false);

  const onViewportEnter = () => {
    if(!fetchingMore.current){
      fetchingMore.current = true;
      fetchMoreOpenStores(() => {
        fetchingMore.current = false;
      });
    }
  }
  return (
    <View style={{marginTop:10}}>
      {!hideHeader && <Header title={`Open Restaurants`} imageSrc={RES} />}
      {openStores ? (
        <>
        {openStores?.data.map((item, index) => {          
          return(
          <View key={item._id} style={{marginHorizontal:10, marginVertical: 5}}>
            <Card 
             {...item}
            navigation={navigation} />
          </View>
        )})}
        {openStores?.next && <ViewportAware
          preTriggerRatio={0.5}
          onViewportEnter={onViewportEnter}
          style={style.more}/>}
        </>
      ) : (
        <Loading />
      )}
    </View>
  );
};

export {Title};
export default memo(LandingOpenRestList);
