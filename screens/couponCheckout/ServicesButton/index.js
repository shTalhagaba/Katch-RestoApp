import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BoldText } from '../../../GlobeStyle';
import styles from './styles';

const ServicesButton = ({ name, clicked, onClick }) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={() => onClick(name)}>
      <BoldText style={styles.btnTextStyle({ clicked: clicked })}>
        {name}
      </BoldText>
    </TouchableOpacity>
  );
};

const ServicesButtons = ({
  selectedOrderType,
  onOrderTypeChange,
  orderMethods,
}) => {
  return (
    <View style={styles.root}>
      {orderMethods.map(({ methodName }, index) => (
        <ServicesButton
          key={methodName}
          clicked={selectedOrderType === methodName}
          name={methodName}
          onClick={() => onOrderTypeChange(index)}
        />
      ))}
    </View>
  );
};

export default ServicesButtons;
