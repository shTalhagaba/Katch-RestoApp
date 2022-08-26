import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ORDER_NOW_BANNER } from '../../assets/images';
import style from './style';

const OrderPickUp = ({ onOrderClick }) => (
  <View style={style.pickUpContainer}>
    <TouchableOpacity onPress={onOrderClick}>
      <Image source={ORDER_NOW_BANNER} style={[style.pickUpBanner]} />
    </TouchableOpacity>
  </View>
);

export default OrderPickUp;
