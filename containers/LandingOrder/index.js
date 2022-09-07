import React, {useEffect, useState, memo} from 'react';
import {TouchableOpacity, View} from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import { useLazyQuery, useSubscription } from '@apollo/client'

//others
import {GET_USER_ORDERS, ORDER_STATUS_CHANGE} from '../../components/GraphQL';
import {ONGOING_ORDER, ONGOING_ORDER_BUTTON} from '../../assets/images';
import {showOrderLanding} from '../../components/Redux/Actions/appActions';
import {status} from '../../constants/orderStatus';
import {RText, BoldText, normalizedFontSize} from '../../GlobeStyle';
import Icon from '../../components/Icon';

const { accepted, ready, pending, enRoute } = status;

const LandingOrder = ({navigation, showOrderLanding, isHomeFocused, ...props}) => {
  if (!auth().currentUser) return null;

  const [order, setOrder] = useState(null);

  const [getOrder] = useLazyQuery(GET_USER_ORDERS, {
    fetchPolicy: 'network-only',
    variables: {orderStatus: [ accepted, ready, pending, enRoute ]},
    onCompleted: (data) => {
      if (data?.getUserOrders.length > 0) {
        setOrder(data.getUserOrders[0]);
      }
    },
  });

  useSubscription(ORDER_STATUS_CHANGE, {
    variables: {customerId: auth().currentUser.uid},
    onSubscriptionData: ({subscriptionData: {data}}) => {
      if (data) {
        const orderStatus = data.orderStatusChanged.orderStatus;
        const orderId = data.orderStatusChanged._id;
        const refetchIfNot = [accepted, ready];

        //if order status is not accepted or ready, get next pending, accepted or ready order
        if (orderId === order?._id && !refetchIfNot.includes(orderStatus)) {
          getOrder();
          setOrder(null);
          showOrderLanding(false);
        }
      }
    },
  });

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    if (props.showOrder) {
      getOrder();
      showOrderLanding(false);
    }
  }, [props.showOrder]);

  const _onPress = () => {
    navigation.navigate('OrderSummary', {orderId: order._id});
  };

  return order &&  isHomeFocused ? (
    <View
      style={{
        backgroundColor: '#d9f7d9',
        padding: 15,
        paddingHorizontal: 25,
        overflow: 'hidden',
        zIndex: -1,
      }}>
      <TouchableOpacity
        onPress={_onPress}
        underlayColor="#00B80030"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <>
          <Icon
            source={ONGOING_ORDER}
            style={{height: 35, width: 35, resizeMode: 'contain'}}
          />

          <View style={{marginHorizontal: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <BoldText
                style={{fontSize: normalizedFontSize(10), color: '#30692d'}}>
                Order No. {order.orderNumber}
              </BoldText>
            </View>
            <RText>{order.storeName}</RText>
          </View>
          <Icon
            source={ONGOING_ORDER_BUTTON}
            style={{
              height: 35,
              width: 35,
              resizeMode: 'contain',
              marginLeft: 'auto',
            }}
          />
        </>
      </TouchableOpacity>
    </View>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    showOrder: state.app.showOrderLanding,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showOrderLanding: (boolean) => {
      dispatch(showOrderLanding(boolean));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(LandingOrder));
