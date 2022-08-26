import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OrderNow, ForwardGreenButton } from '../../assets/svg';
import { RText } from '../../GlobeStyle';

const OrderDelivery = ({ style, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Order Food Delivery')}
      style={style.addOptionsContainer}>
      <View style={style.orderDeliveryContainer}>
        <View style={style.orderDeliveryContainerLeft}>
          <OrderNow height={40} width={40} />
          <View style={style.orderDeliveryContainerText}>
            <RText style={style.orderDeliveryHeader}>Order for Delivery</RText>
            <RText style={style.orderDeliverySubtext}>
              Order quickly and get Delivered
            </RText>
          </View>
        </View>
        <View style={style.orderDeliveryContainerRight}>
          <ForwardGreenButton height={25} width={25} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default OrderDelivery;
