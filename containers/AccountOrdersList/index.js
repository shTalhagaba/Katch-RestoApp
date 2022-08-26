import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import {useQuery, useMutation, useSubscription} from '@apollo/react-hooks';

//others
import {RText, BoldText} from '../../GlobeStyle';
import {GET_USER_ORDERS, ORDER_STATUS_CHANGE} from '../../components/GraphQL';
import Loading from '../../components/AccountOrderCard/loading';
import OrderCard, {NoOrder} from '../../components/AccountOrderCard';
import {status} from '../../constants/orderStatus';
import { animateLayout } from '../../components/Helpers';
const {
  pending,
  accepted,
  declined,
  ready,
  completed,
  incomplete,
  cancelled,
  refunded,
  enRoute,
} = status;

const OrdersList = ({navigation, tabProps}) => {
  const {} = useQuery(GET_USER_ORDERS, {
    fetchPolicy: 'no-cache',
    variables: {orderStatus: [pending, accepted, ready, enRoute, completed]},
    onCompleted: (data) => {
      if (data) {
        const allPending = data?.getUserOrders.filter(
          (order) =>
            order.orderStatus === pending ||
            order.orderStatus === accepted ||
            order.orderStatus === enRoute ||
            order.orderStatus === ready,
        );
        const lastCompleted = data.getUserOrders.filter(
          (order) => order.orderStatus === completed,
        );
        animateLayout()
        if (allPending.length > 0) {
          setOrders(allPending.slice(0, 5));
        } else if (lastCompleted?.length > 0) {
          lastCompleted ? setOrders([lastCompleted[0]]) : setOrders([]);
        } else {
          setOrders([]);
        }
      }
    },
  });

  const [orders, setOrders] = useState(null);
  const subscription = useSubscription(ORDER_STATUS_CHANGE, {
    variables: {customerId: auth().currentUser?.uid},
  });

  //subscription on state change
  useEffect(() => {
    if (subscription?.data) {
      const {orderStatusChanged} = subscription.data;
      const allOrders = [...orders];
      for (let i = 0; i < allOrders.length; i++) {
        if (allOrders[i]._id === orderStatusChanged._id) {
          allOrders[i] = orderStatusChanged;
        }
      }
      setOrders((state) => {
        state = [...allOrders];
        return state;
      });
    }
  }, [subscription?.data]);

  return (
    <View style={{marginBottom: 20}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
        <BoldText style={{fontSize: 15, color: 'gray'}}>
          ORDERS
        </BoldText>

        <TouchableOpacity
          onPress={() => navigation.navigate('Orders')}
          style={{
            marginLeft: 'auto',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <RText style={{fontSize: 14}}>View all</RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
      </View>
      {orders ? (
        <>
          {orders?.length > 0 ? (
            orders.map((order, index) => (
              <OrderCard
                navigation={navigation}
                key={order._id + order.orderStatus + order.timeStampEta + index}
                order={order}
              />
            ))
          ) : (
            <NoOrder navigation={tabProps.navigation} />
          )}
        </>
      ) : (
        <Loading />
      )}
    </View>
  );
};

export default OrdersList;
