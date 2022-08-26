import React from 'react';
import { View } from 'react-native';
import { TextBasic } from '../../../GlobeStyle';
import styles from './styles';

const StoreAddress = ({ storeName, storeAddress }) => {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrapper} />
      <View style={styles.addressWrapper}>
        <TextBasic style={styles.addressLabel}>{storeName}</TextBasic>
        <TextBasic style={styles.addressText}>{storeAddress}</TextBasic>
      </View>
      <View style={styles.changeAddressWrapper} />
    </View>
  );
};

export default StoreAddress;
