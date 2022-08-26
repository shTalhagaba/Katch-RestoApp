/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { View, StyleSheet } from 'react-native';

//3rd party
import Lottie from 'lottie-react-native';

//others
import {
  MealReady,
  PendingMeal,
  PreparingMeal,
  DeliveryDrone,
} from '../../assets/Lottie';
import { status } from '../../constants/orderStatus';
import { delivery } from '../../constants/serviceTypes';
const { pending, accepted, ready, enRoute } = status;
const OrderLottie = (props) => {
  const { orderStatus, orderType } = props;
  const lottieFilesDelivery = {
    [pending]: PendingMeal,
    [accepted]: PreparingMeal,
    [ready]: PreparingMeal,
    [enRoute]: DeliveryDrone,
  };

  const lottieFilesPickUp = {
    [pending]: PendingMeal,
    [accepted]: PreparingMeal,
    [ready]: MealReady,
    [enRoute]: DeliveryDrone,
  };

  const lottieFiles =
    orderType === delivery ? lottieFilesDelivery : lottieFilesPickUp;

  const lottieFile = lottieFiles[orderStatus];
  const lottieStyle = fileStyle[orderStatus]
    ? fileStyle[orderStatus]
    : fileStyle.default;

  return lottieFile ? (
    <View style={styles.container}>
      <Lottie
        resizeMode="cover"
        autoPlay
        loop={true}
        source={lottieFile}
        style={lottieStyle}
      />
    </View>
  ) : null;
};

export default OrderLottie;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

const fileStyle = StyleSheet.create({
  default: {
    height: 140,
    width: 140,
    marginTop: -5,
    marginBottom: -20,
  },
  EnRoute: {
    height: 180,
    width: 180,
    marginTop: -15,
    marginBottom: -50,
  },
});
