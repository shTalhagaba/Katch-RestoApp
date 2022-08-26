import React,{useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

//3rd party
import EIIcon from 'react-native-vector-icons/EvilIcons';
import Timer from 'easytimer.js';

//others
import ProgressiveImage from '../ProgressiveImage';
import {DEFAULT_REST_IMG} from '../../assets/images';
import { toLocalTime,generateImgScr,timeDifference} from '../Helpers';
import GS,{customFont,RText,TextBasic} from '../../GlobeStyle';
import { status } from '../../constants/orderStatus';

const Card = (props) => {
  const {item, navigation, onCartAdd} = props;
  const orderStatus = item.orderStatus;
  const timer = useRef(new Timer()).current;
  const min = timeDifference(item.timeStampEta)
  const [minTillReady, setMinTillReady] = useState(min);

  if((orderStatus === status.accepted || orderStatus === status.enRoute) && minTillReady && minTillReady > 0){
    timer.start({countdown: true, startValues: {minutes: minTillReady + 1}});
  }

  useEffect(() => {
    const timerEvent = e => {
      const min = e.detail.timer.getTotalTimeValues().minutes     
      setMinTillReady(min);
    };
    timer.addEventListener('minutesUpdated', timerEvent);
    return () => timer.removeEventListener('minutesUpdated', timerEvent);
  },[]);

  useEffect(() => {
    if(
      min !== undefined 
      && minTillReady === undefined 
      && (orderStatus === status.accepted || orderStatus === status.enRoute)){
      setMinTillReady(min);
    }
  },[min]);

  const statusColor = {
    Pending: 'gray',
    Accepted: 'gray',
    EnRoute: 'gray',
    Ready: 'gray',
    Cancelled: 'gray',
    Incomplete: 'gray',
    Completed: GS.secondaryColor,
    Declined: GS.errorRed,
    Refunded: GS.errorRed,
  };
  
  const showStatus = {
    Pending: 'Pending',
    Ready: 'Ready',
    Cancelled: 'Cancelled',
    Incomplete: 'Incomplete',
    Completed: 'Completed',
    Declined: 'Declined',
    Refunded: 'Refunded',
    Accepted: `Preparing your meal , ${minTillReady} mins till it's ready` ,
  }

  const TimerDone = (elseStatus) => 
  minTillReady <= 0 && orderStatus === 'Accepted' ? 'Your meal is being finalized' : elseStatus;

  return (
    <TouchableHighlight
      underlayColor="#00000005"
      onPress={() => {
        navigation.navigate('OrderSummary',{orderId: item._id })
      }}>
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 20,
          flexDirection: 'row',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <ProgressiveImage
          fallBackImage={DEFAULT_REST_IMG}
          source={generateImgScr(item.storeId,'logo.png')}
          resizeMode="cover"
          containerStyle={{
            height: 50,
            width: 50,
            borderRadius: 10,
            borderWidth: .2,
            borderColor: 'silver',
            overflow:'hidden'
          }}/>
        <View style={{marginLeft: 15, marginVertical: 5}}>
          <TextBasic style={{fontSize: 13.5, fontFamily: customFont.axiformaMedium}}>
            {item.storeName}
          </TextBasic>
        <TextBasic style={{fontSize: 12, color: statusColor[orderStatus]}}>{TimerDone(showStatus[orderStatus])}</TextBasic>
          <View style={{flexDirection: 'row',marginTop:2}}>
            <RText style={{fontSize: 12, color: 'gray'}}>{item.total}</RText>
            <RText style={{fontSize: 12, color: 'gray'}}>{`  -  `}</RText>
            <RText style={{fontSize: 12, color: 'gray'}}>
              {toLocalTime(item.timeStamp)}
            </RText>
          </View>
        </View>
        {
          (orderStatus === 'Completed' || orderStatus === 'Declined') ?
            <TouchableOpacity
              onPress={() => onCartAdd(item)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 10,
              }}>
              
                <EIIcon name="redo" size={40} color="#00b800" />
                <RText style={{color: 'gray', fontSize: 12}}>Reorder</RText>
              
            </TouchableOpacity>
            :
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 10,
              }}>
              <RText style={{fontSize: 40}}>#{item.orderNumber}</RText>
            </View>
        }
      </View>
    </TouchableHighlight>

    
  );
};

export default Card;