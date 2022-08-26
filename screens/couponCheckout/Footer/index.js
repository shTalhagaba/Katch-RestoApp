// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import GS, {
  BoldText,
  RText,
  customFont,
  priceSymbol,
  normalizedFontSize,
  ActionButton as CheckOutButton,
  ActionButtonDisabled as CheckOutButtonDisabled,
} from '../../../GlobeStyle';
import styles from './styles';
import serviceTypes from '../../../constants/serviceTypes';
import { SLIDER_ON, SLIDER_OFF } from '../../../assets/images';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { onlinePayments as onlinePaymentsText } from '../../../constants/staticText';


const Footer = (props) => {
  const {
    error,
    addressError,
    realTotal,
    deliveryCharge,
    serviceType,
    walletTotal,
    walletUsed,
    setWalletUsed,
    finalPrice,
    changeAddress,
    changePaymentMethod,
    storePaymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods,
  } = props;

  const [total, setTotal] = useState(null);
  const [cartTotal, setCartTotal] = useState(null);
  useEffect(() => {
    if (serviceType === serviceTypes.delivery && deliveryCharge) {
      setTotal(
        (parseFloat(realTotal) + parseFloat(deliveryCharge)).toFixed(3) + ' KD',
      );
    } else {
      setTotal(realTotal);
    }
    setCartTotal(realTotal);
  }, [realTotal, deliveryCharge, serviceType]);

  const calculateTotal = (grandTotal) => {
    if (walletUsed) {
      const _total = parseFloat(grandTotal) - parseFloat(walletTotal);
      if (_total <= 0) {
        finalPrice(0);
        return 'Free';
      } else {
        finalPrice(_total.toFixed(3));
        return _total.toFixed(3) + ' KD';
      }
    }
    finalPrice(grandTotal);
    return grandTotal;
  };

  return (
    <View style={styles.root}>
      {addressError !== '' && (
        <TouchableOpacity style={styles.errorWrapper} onPress={changeAddress}>
          <MIcon name="error-outline" color={GS.errorRed} size={18} />
          <RText style={styles.errorText}>{addressError}</RText>
        </TouchableOpacity>
      )}
      {error !== '' && (
        <View style={styles.errorWrapper}>
          <MIcon name="error-outline" color={GS.errorRed} size={18} />
          <RText style={styles.errorText}>{error}</RText>
        </View>
      )}
      <View style={styles.paymentTitleWrapper}>
        <BoldText style={styles.paymentTitleText}>Payment Summary</BoldText>
      </View>

      <View style={styles.paymentSummaryWrapper}>
        {parseFloat(walletTotal) !== 0 && (
          <View style={styles.paymentTotalWrapper}>
            <RText style={styles.useWalletText}>Use Wallet</RText>
            <RText style={styles.walletTotal}>
              {walletTotal} {priceSymbol}{' '}
            </RText>
            <TouchableOpacity
              onPress={() => setWalletUsed(!walletUsed)}
              activeOpacity={1}>
              <Image
                source={!walletUsed ? SLIDER_ON : SLIDER_OFF}
                style={styles.toggleImage}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.paymentTotalWrapper}>
          <RText style={styles.totalText}>Cart Amount</RText>
          <RText style={styles.total}>{cartTotal}</RText>
        </View>
        {serviceType === serviceTypes.delivery &&
          deliveryCharge !== undefined &&
          deliveryCharge !== false &&
          deliveryCharge !== 0 && (
            <View style={styles.paymentTotalWrapper}>
              {deliveryCharge === '0' ? (
                <>
                  <View />
                  <RText style={styles.freeDeliveryText}>Free Delivery</RText>
                </>
              ) : (
                <>
                  <RText style={styles.totalText}>Delivery Charge</RText>
                  <RText style={styles.total}>
                    {parseFloat(deliveryCharge).toFixed(3) + ' KD'}
                  </RText>
                </>
              )}
            </View>
          )}
        <View style={styles.paymentTotalWrapper}>
          <RText style={styles.totalText}>Total</RText>
          <RText
            style={[
              styles.total,
              calculateTotal(total) === 'Free' ? styles.freeDeliveryText : {},
            ]}>
            {calculateTotal(total)}
          </RText>
        </View>
      </View>

      <View>
        <View style={styles.paymentTitleWrapper}>
          <BoldText style={styles.paymentTitleText}>
            Select Payment Method
          </BoldText>
        </View>
        {selectedPaymentMethod !== -1 && (
          <View>
            <RText style={styles.paymentWarningText}>
              {onlinePaymentsText.warning}
            </RText>
          </View>
        )}
        {storePaymentMethods && (
          <View style={styles.paymentSummaryWrapper}>
            <RadioForm formHorizontal={false} animation={true} initial={-1}>
              {paymentMethods.map((method, i) => {
                const isSelected = selectedPaymentMethod === i;
                const selectpayment = () => {
                  setSelectedPaymentMethod(i);
                  changePaymentMethod(i);
                };
                const isMethodUseAble =
                  storePaymentMethods.paymentMethods.includes(method.type);
                return isMethodUseAble ? (
                  <RadioButton
                    labelHorizontal={true}
                    key={i}
                    style={{ alignItems: 'center' }}>
                    <RadioButtonInput
                      obj={{
                        name: method.methodName,
                        value: method.methodId,
                      }}
                      index={i}
                      isSelected={isSelected}
                      onPress={selectpayment}
                      borderWidth={1}
                      buttonInnerColor={GS.bgGreenDark1}
                      buttonOuterColor={
                        isSelected ? GS.bgGreenDark1 : GS.greyColor
                      }
                      buttonSize={normalizedFontSize(5)}
                      buttonOuterSize={normalizedFontSize(9)}
                      buttonStyle={{ borderWidth: 2 }}
                      buttonWrapStyle={{ marginRight: 10 }}
                    />
                    <TouchableOpacity onPress={selectpayment}>
                      <View style={styles.paymentListBtnImageWrapper}>
                        <Image
                          source={method.imageSrc}
                          style={styles.paymentListBtnImage}
                        />
                      </View>
                    </TouchableOpacity>
                    <RadioButtonLabel
                      obj={{
                        label: method.methodName,
                        value: method.methodId,
                      }}
                      index={i}
                      labelHorizontal={true}
                      onPress={selectpayment}
                      // labelStyle={{}}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                ) : (
                  <></>
                );
              })}
            </RadioForm>
          </View>
        )}
      </View>
    </View>
  );
};

export const PlaceOrderButton = (props) => {
  const {
    addressError,
    _onCheckout,
    loading,
    selectedPaymentMethod,
    realTotal,
    deliveryCharge,
    walletTotal,
    walletUsed,
  } = props;
  const walletCheckout =
    walletUsed &&
    parseFloat(walletTotal) >=
      parseFloat(realTotal) + parseFloat(deliveryCharge);
  return (
    <View style={styles.placeOrderWrapper}>
      {addressError === '' &&
      !loading &&
      (selectedPaymentMethod > -1 || walletCheckout) ? (
        <CheckOutButton onPress={_onCheckout}>
          <RText
            style={styles.placeOrderButtonText}
            fontName={customFont.axiformaMedium}>
            Place order
          </RText>
        </CheckOutButton>
      ) : (
        <CheckOutButtonDisabled>
          <RText
            style={styles.placeOrderButtonText}
            fontName={customFont.axiformaMedium}>
            Place order
          </RText>
        </CheckOutButtonDisabled>
      )}
    </View>
  );
};

export default Footer;
