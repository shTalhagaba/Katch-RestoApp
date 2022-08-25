import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { House, Apartment, Office } from '../../../assets/svg';
import GS, { TextBasic, RText } from '../../../GlobeStyle';
import styles from './styles';

const AddressSection = ({ address, changeAddress }) => {
  if (address) {
    const icon = {
      house: House,
      apartment: Apartment,
      office: Office,
    };

    const AddressIcon = icon[address?.addressType.toLowerCase()];
    const addressInfo = {
      house: `Block: ${address.block}, Street: ${address.street}, House No.: ${address.houseNo}`,
      apartment: `Block: ${address.block}, Street: ${address.street}, Build: ${address.building}\nFloor: ${address.floor}, Apartment No.: ${address.apartmentNo}`,
      office: `Block: ${address.block}, Street: ${address.street}, Build: ${address.building}\nFloor: ${address.floor}, Office: ${address.office}`,
    };
    return (
      <View style={styles.root}>
        <View style={styles.iconWrapper}>
          {address ? <AddressIcon fill={GS.lightGrey2} /> : null}
        </View>
        <View style={styles.addressWrapper}>
          <TextBasic style={styles.addressLabel}>{address.label}</TextBasic>
          <TextBasic style={styles.addressText}>{address.area}</TextBasic>
          <TextBasic style={styles.addressText}>
            {addressInfo[address?.addressType.toLowerCase()]}
          </TextBasic>
          <TextBasic style={styles.addressText}>{address.landmark}</TextBasic>
        </View>
        <View style={styles.changeAddressWrapper}>
          <TouchableOpacity onPress={() => changeAddress()}>
            <TextBasic style={[styles.addressText, styles.changeAddressText]}>
              Change
            </TextBasic>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.root}>
        <NoAddressSection />
        <View style={styles.changeAddressWrapper}>
          <TouchableOpacity onPress={() => changeAddress()}>
            <TextBasic style={[styles.addressText, styles.changeAddressText]}>
              Change
            </TextBasic>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const NoAddressSection = () => {
  return (
    <View style={styles.addressWrapper}>
      <TextBasic style={styles.noAddressText}>No delivery address</TextBasic>
    </View>
  );
};

export default AddressSection;
