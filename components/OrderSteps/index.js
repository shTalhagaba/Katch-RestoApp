import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
//3rd party
import Steps from 'react-native-steps';
import { Alert } from '../../assets/images';
import { status } from '../../constants/orderStatus';
import paymentMethod from '../../constants/paymentMethod';
import { delivery } from '../../constants/serviceTypes';
//others
import GS, { BoldText, normalizedFontSize, RText } from '../../GlobeStyle';

const { declined, cancelled } = status;
const windowWidth = Dimensions.get('window').width;

const configs = {
  stepIndicatorSize: 10,
  separatorStrokeWidth: 2,
  stepStrokeWidth: 3,
  stepIndicatorLabelFontSize: 0,
  labelColor: 'gray',
  labelSize: normalizedFontSize(8),

  //current
  currentStepIndicatorSize: 20,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: GS.secondaryColor,
  stepIndicatorCurrentColor: '#fff',
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: '#fff',
  currentStepLabelColor: 'gray',

  //unFinished
  stepStrokeUnFinishedColor: '#aaa',
  separatorUnFinishedColor: '#aaa',
  stepIndicatorUnFinishedColor: '#fff',
  stepIndicatorLabelUnFinishedColor: '#fff',

  //finished
  stepStrokeFinishedColor: GS.secondaryColor,
  stepIndicatorFinishedColor: GS.secondaryColor,
  separatorFinishedColor: GS.secondaryColor,
  stepIndicatorLabelFinishedColor: GS.secondaryColor,
  labelStyle: {
    width: windowWidth,
  },
};

const currentStepPickup = {
  Pending: 0,
  Accepted: 1,
  Ready: 2,
};

const currentStepDelivery = {
  Pending: 0,
  Accepted: 1,
  EnRoute: 2,
  Ready: 1,
};

const currentStepLabelPickUp = {
  Pending: 'Waiting for order confirmation',
  Accepted: 'Preparing your meal',
  Ready: 'Your meal is ready for pick up',
};

const currentStepLabelDelivery = {
  Pending: 'Waiting for order confirmation',
  Accepted: 'Preparing your meal',
  EnRoute: 'Your meal is on the way',
  Ready: 'Preparing your meal',
};

const statusColor = {
  Pending: 'gray',
  Accepted: 'gray',
  Ready: 'gray',
  EnRoute: 'gray',
  Cancelled: 'gray',
  Incomplete: 'gray',
  Completed: GS.secondaryColor,
  Declined: GS.errorRed,
  Refunded: GS.errorRed,
};

const customStatus = {
  Pending: 'Pending',
  Accepted: 'Accepted',
  Ready: 'Ready',
  EnRoute: 'En Route',
  Cancelled: 'Cancelled',
  Incomplete: 'Incomplete',
  Completed: 'Completed',
  Declined: 'Declined',
  Refunded: 'Refunded',
};

const OrdeSteps = (props) => {
  const {
    orderStatus,
    orderType,
    showDelayed = false,
    paymentMethod: orderPaymentMethod,
  } = props;
  const currentStepLabel =
    orderType === delivery ? currentStepLabelDelivery : currentStepLabelPickUp;

  const stepsCount = Object.keys(currentStepLabel).length;

  const currentStep =
    orderType === delivery ? currentStepDelivery : currentStepPickup;

  return (
    <>
      {currentStepLabel[orderStatus] ? (
        <Steps
          count={stepsCount}
          configs={configs}
          current={currentStep[orderStatus]}
          labels={[currentStepLabel[orderStatus]]}
        />
      ) : (
        <BoldText
          style={[styles.statusText, { color: statusColor[orderStatus] }]}>
          {customStatus[orderStatus]}
        </BoldText>
      )}
      {(orderPaymentMethod === paymentMethod.cc ||
        orderPaymentMethod === paymentMethod.knet) &&
      (orderStatus === declined || orderStatus === cancelled) ? (
        <View style={styles.delayContainer}>
          <Image source={Alert} resizeMode={'cover'} style={styles.image} />
          <RText style={styles.delayedText}>
            Your refund has been processed to your wallet.
          </RText>
        </View>
      ) : null}

      {showDelayed && currentStepLabel[orderStatus] ? (
        <View style={styles.delayContainer}>
          <Image source={Alert} resizeMode={'cover'} style={styles.image} />
          <RText style={styles.delayedText}>
            Your order is taking longer then expected, Sorry for the delay.
          </RText>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  statusText: {
    fontSize: normalizedFontSize(10),
    marginTop: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  // eslint-disable-next-line react-native/no-color-literals
  delayContainer: {
    backgroundColor: '#FFFAEB',
    borderColor: '#FFBF00',
    borderWidth: 0.8,
    borderRadius: 10,
    paddingHorizontal: 0,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  delayedText: {
    color: '#C18A09',
    fontSize: normalizedFontSize(5.7),
    lineHeight: normalizedFontSize(8),
    flex: 1,
  },
  image: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
  },
});

export default OrdeSteps;
