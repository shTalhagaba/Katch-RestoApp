import React from 'react';
import { View, TouchableOpacity, Image, Modal } from 'react-native';
import GS, { RText, BoldText } from '../../../GlobeStyle';
import { onlinePayments as onlinePaymentsText } from '../../../constants/staticText';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import { CASH, K_NET, CREDIT_CARD } from '../../../assets/images';
import styles from './styles';

const paymentMethods = [
  {
    methodId: 0,
    methodName: 'Cash',
    type: 'cash',
    imageSrc: CASH,
  },
  {
    methodId: 1,
    methodName: 'KNET',
    type: 'knet',
    imageSrc: K_NET,
  },
  {
    methodId: 2,
    methodName: 'Visa / Master',
    type: 'cc',
    imageSrc: CREDIT_CARD,
  },
];

const PaymentMethodSelection = ({ paymentMethod, togglePaymentSelection }) => {
  return (
    <TouchableOpacity onPress={togglePaymentSelection} style={styles.root}>
      <View style={styles.rootView}>
        <View style={styles.leftWrapper}>
          <RText style={styles.paymentMethodText}>
            {paymentMethod.methodName}
          </RText>
          <View style={styles.paymentImageWrapper}>
            <Image
              source={paymentMethod.imageSrc}
              style={styles.paymentMethodImage}
            />
          </View>
        </View>
        {paymentMethod.methodName !== 'Cash' && (
          <View>
            <RText style={styles.paymentWarningText}>
              {onlinePaymentsText.warning}
            </RText>
          </View>
        )}
      </View>
      <MCIcon name="chevron-right" size={20} color={GS.textColorGreyDark3} />
    </TouchableOpacity>
  );
};

export const PaymentMethodSelectionModal = (props) => {
  const {
    togglePaymentSelection,
    showPaymentSelection,
    changePaymentMethod,
    storePaymentMethods,
  } = props;

  return (
    storePaymentMethods && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentSelection}
        onRequestClose={togglePaymentSelection}>
        <View style={styles.modalRoot}>
          <View style={styles.modalButtonWrapper}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={togglePaymentSelection}
            />
          </View>
          <View style={styles.modalPaymentSelectRoot}>
            {/* header */}
            <View style={styles.selectPaymentWrapper}>
              <View style={styles.selectPaymentTextWrapper}>
                <BoldText style={styles.selectPaymentText}>
                  Select Payment Method
                </BoldText>
              </View>

              <TouchableOpacity
                style={styles.selectPaymentBtn}
                onPress={togglePaymentSelection}>
                <ADIcon color="gray" name="close" size={30} />
              </TouchableOpacity>
            </View>
            {/* header */}
            <View style={styles.paymentListWrapper}>
              {paymentMethods.map((method, index) => {
                const isMethodUseAble = storePaymentMethods.paymentMethods.includes(
                  method.type,
                );
                return isMethodUseAble ? (
                  <TouchableOpacity
                    key={method.methodId}
                    onPress={() => changePaymentMethod(index)}
                    style={styles.paymentListBtn}>
                    <View style={styles.paymentListBtnImageWrapper}>
                      <Image
                        source={method.imageSrc}
                        style={styles.paymentListBtnImage}
                      />
                    </View>
                    <RText style={styles.paymentListText}>
                      {method.methodName}
                    </RText>

                    <MIIcon name="chevron-right" size={20} color="gray" />
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </View>
        </View>
      </Modal>
    )
  );
};

export default PaymentMethodSelection;
