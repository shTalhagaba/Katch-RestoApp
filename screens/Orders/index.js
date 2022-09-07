import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  TouchableWithoutFeedback,
  View,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import Header from '../../components/AccountHeader';

//3rd party
import { useQuery,useSubscription } from '@apollo/client'
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

//others
import {
  GET_USER_ORDERS,
  ORDER_STATUS_CHANGE,
} from '../../components/GraphQL';
import OrderCard from '../../components/AccountOrderCard';
import Loading from './loading';
import ProgressLoading from '../../components/Loading/ProgressLoading';
import {addToCart, clearCart} from '../../components/Redux/Actions/cartActions';
import GS, {BoldText, customFont, TextBasic} from '../../GlobeStyle';
import { status } from '../../constants/orderStatus';

const { accepted, pending, ready, enRoute } = status;

const Orders = ({navigation, route, ...props}) => {
  const scrollRef = useRef();
  const subscription = useSubscription(ORDER_STATUS_CHANGE, {
    variables: {customerId: auth().currentUser.uid},
  });

  const {data, loading, error} = useQuery(GET_USER_ORDERS, {
    fetchPolicy: 'network-only',
  });
  const [orders, setOrders] = useState({
    pending: null,
    others: null,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  let translateXIn = translateX.interpolate({
    inputRange: [0, Math.ceil(windowWidth / 2)],
    outputRange: [0, Math.ceil(windowWidth / 4)],
  });

  let opacity = translateX.interpolate({
    inputRange: [0, Math.ceil(windowWidth / 4), Math.ceil(windowWidth / 2)],
    outputRange: [0, 0.5, 1],
  });

  useEffect(() => {
    if (subscription.data) {
      const statusChanged = subscription.data.orderStatusChanged;
      let pendingOrders = [...orders.pending];
      let othersOrders = [...orders.others];

      if (
        statusChanged.orderStatus === accepted ||
        statusChanged.orderStatus === enRoute ||
        statusChanged.orderStatus === ready
      ) {
        const filtered = pendingOrders.filter(
          (order) => order._id !== statusChanged._id,
        );
        pendingOrders = [statusChanged, ...filtered];
      } else {
        pendingOrders = pendingOrders.filter(
          (order) => order._id !== statusChanged._id,
        );
        const filtered = othersOrders.filter(
          (order) => order._id !== statusChanged._id,
        );
        othersOrders = [statusChanged, ...filtered];
      }

      setOrders({pending: pendingOrders, others: othersOrders});
    }
  }, [subscription.data]);

  useEffect(() => {
    if (data && orders.pending === null) {
      if (data.getUserOrders.length > 0) {
        setOrders({
          pending: data.getUserOrders.filter(
            (order) =>
              order.orderStatus === pending ||
              order.orderStatus === accepted ||
              order.orderStatus === enRoute ||
              order.orderStatus === ready,
          ),
          others: data.getUserOrders.filter(
            (order) =>
              order.orderStatus !== pending &&
              order.orderStatus !== accepted &&
              order.orderStatus !== enRoute &&
              order.orderStatus !== ready,
          ),
        });
        setIsFetching(false);
      } else {
        setOrders({
          pending: [],
          others: [],
        });
        setIsFetching(false);
      }
    }
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1, marginTop: StatusBar.currentHeight}}>
        <View>
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              backgroundColor: '#fff',
            }}>
            <Header goBack={() => navigation.goBack()} title="My Orders" />
          </View>
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              backgroundColor: '#fff',
              borderBottomWidth: 0.3,
              borderColor: 'silver',
            }}>
            <PlaceHolder translateX={translateXIn} />

            <PendingButton
              opacity={opacity}
              length={orders.pending ? orders.pending.length : 0}
              onPress={() => {
                scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
              }}
            />

            <CompletedButton
              opacity={opacity}
              length={orders.others ? orders.others.length : 0}
              onPress={() => {
                scrollRef.current.scrollToEnd({animated: true});
              }}
            />
          </View>
        </View>

        <Animated.ScrollView
          style={{
            opacity: Animated.add(1, Animated.multiply(0, translateX)),
          }}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: translateX,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
          ref={scrollRef}
          contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}
          decelerationRate="fast"
          pagingEnabled={true}
          horizontal>
          {isFetching ? (
            <>
              <Loading />
              <Loading />
            </>
          ) : (
            <>
              {orders.pending.length > 0 ? (
                <FlatList
                  data={orders.pending}
                  renderItem={(item) => (
                    <OrderCard navigation={navigation} order={item.item} />
                  )}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={{paddingBottom: 50}}
                  style={{width: windowWidth, padding: 25}}
                />
              ) : (
                <View
                  style={{
                    width: windowWidth,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <BoldText style={{fontSize: 20, color: GS.secondaryColor}}>
                    No Pending Orders
                  </BoldText>
                </View>
              )}
              {orders.others.length > 0 ? (
                <FlatList
                  data={orders.others}
                  renderItem={(item) => (
                    <OrderCard
                      setIsLoading={setIsLoading}
                      navigation={navigation}
                      order={item.item}
                    />
                  )}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={{paddingBottom: 50}}
                  style={{width: windowWidth, padding: 25}}
                />
              ) : (
                <View
                  style={{
                    width: windowWidth,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <BoldText style={{fontSize: 20, color: GS.secondaryColor}}>
                    No Completed Orders
                  </BoldText>
                </View>
              )}
            </>
          )}
        </Animated.ScrollView>

        {isLoading && <Loading />}

        {isAddingToCart && <ProgressLoading />}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    items: state.cart.addedItems,
    viewDish: state.app.viewDish,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch(addToCart(product));
    },
    clearCart: () => {
      dispatch(clearCart());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);

const PlaceHolder = ({translateX}) => {
  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        width: '50%',
        height: '100%',
        transform: [{translateX: translateX}],
      }}>
      <View
        style={{
          borderRadius: 100,
          paddingHorizontal: 10,
          paddingVertical: 2,
          backgroundColor: '#00b800',
          height: 25,
          width: 130,
        }}
      />
    </Animated.View>
  );
};

const PendingButton = ({length, onPress, opacity}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
    }}>
    <View
      style={{
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
      }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{flex: 1}}>
          <TextBasic
            style={{
              fontFamily: customFont.axiformaRegular,
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              textAlignVertical: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              color: '#fff',
              paddingTop: Platform.OS === 'ios' ? 20 : 0,
            }}>
            {`Pending (${length})`}
          </TextBasic>
          <Animated.Text
            style={{
              opacity: opacity,
              fontFamily: customFont.axiformaRegular,
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              color: '#00b800',
              textAlignVertical: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              paddingTop: Platform.OS === 'ios' ? 20 : 0,
            }}>
            {`Pending (${length})`}
          </Animated.Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
);

const CompletedButton = ({length, onPress, opacity}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
    }}>
    <View
      style={{
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
      }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{flex: 1}}>
          <TextBasic
            style={{
              fontFamily: customFont.axiformaRegular,
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              textAlignVertical: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              color: '#00b800',
              paddingTop: Platform.OS === 'ios' ? 20 : 0,
            }}>
            {`Completed (${length})`}
          </TextBasic>
          <Animated.Text
            style={{
              opacity: opacity,

              fontFamily: customFont.axiformaRegular,
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: 'center',
              color: '#fff',
              textAlignVertical: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              paddingTop: Platform.OS === 'ios' ? 20 : 0,
            }}>
            {`Completed (${length})`}
          </Animated.Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
);
