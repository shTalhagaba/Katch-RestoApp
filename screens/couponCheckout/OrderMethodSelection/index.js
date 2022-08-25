import React from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import { CASH } from '../../../assets/images';
import ADIcon from 'react-native-vector-icons/AntDesign';
import { BoldText, RText } from '../../../GlobeStyle';
import styles from './styles';
import serviceTypes from '../../../constants/serviceTypes';

const orderMethods = [
  {
    methodId: 0,
    methodName: serviceTypes.pickUp,
    type: 'cash',
    imageSrc: CASH,
  },
  {
    methodId: 1,
    methodName: serviceTypes.delivery,
    type: 'cash',
    imageSrc: CASH,
  },
];

const OrderMethodSelection = (props) => {
  const { toggleOrderSelection, showOrderSelection, changeOrderMethod } = props;

  const orderMethod = [
    {
      methodId: 0,
      imageSrc: 'CASH',
      methodName: serviceTypes.pickUp,
    },
    {
      methodId: 1,
      imageSrc: 'CASH',
      methodName: serviceTypes.delivery,
    },
  ];
  return (
    orderMethod && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOrderSelection}
        onRequestClose={toggleOrderSelection}>
        <View style={styles.root}>
          <View style={styles.backBtnContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={toggleOrderSelection}
            />
          </View>
          <View style={styles.headerWrapper}>
            {/* header */}
            <View style={styles.orderMethodWrapper}>
              <View style={styles.orderMethodInnerWrapper}>
                <BoldText style={styles.ordermethodText}>
                  Select Order Method
                </BoldText>
              </View>

              <TouchableOpacity
                style={styles.orderMethodButton}
                onPress={toggleOrderSelection}>
                <ADIcon color="gray" name="close" size={30} />
              </TouchableOpacity>
            </View>
            {/* header */}
            <View style={styles.orderMethodsListWrapper}>
              {orderMethods.map((method, index) => {
                return true ? (
                  <TouchableOpacity
                    key={method.methodId}
                    onPress={() => changeOrderMethod(index)}
                    style={styles.orderMethodButtonWrapper}>
                    <View style={styles.orderMethodImageWrapper}>
                      <Image
                        source={method.imageSrc}
                        style={styles.orderMethodImage}
                      />
                    </View>
                    <RText style={styles.orderMethodText}>
                      {method.methodName}
                    </RText>
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

export default OrderMethodSelection;
