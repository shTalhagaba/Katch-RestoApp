/* eslint-disable react-native/no-color-literals */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import GS, { RText, normalizedFontSize } from '../../GlobeStyle';
import { House, Apartment, Office } from '../../assets/svg';
import FIcon from 'react-native-vector-icons/Feather';
import AIcon from 'react-native-vector-icons/AntDesign';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import CustomLoading from '../Loading/More';
import { setSelectedAddress } from '../Redux/Actions/userActions';

const AddressCard = (props) => {
  const {
    address,
    deleteAddress,
    navigation,
    isEditMode,
    user,
    closeModal,
    isSelectable,
    hideIcon = false,
    containerStyle = {},
  } = props;

  const icon = {
    house: House,
    apartment: Apartment,
    office: Office,
  };

  const AddressIcon = icon[address?.addressType.toLowerCase()];
  const [isLoading, setisLoading] = useState(false);

  const UpdateButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddUserAddress', {
            update: true,
            initial_state: address,
          });
        }}>
        <FIcon name="edit" size={24} color={GS.secondaryColor} />
      </TouchableOpacity>
    );
  };

  const DeleteButton = () => {
    const onDelete = async () => {
      try {
        setisLoading(true);
        await deleteAddress(address._id);
      } catch {
        setisLoading(false);
      }
    };
    const onDeleteAddressButtonPress = async (id) =>
      Alert.alert('Delete', 'Are you sure you want to delete this address?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => onDelete() },
      ]);

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDeleteAddressButtonPress}>
        <AIcon name="delete" size={24} color={GS.errorRed} />
      </TouchableOpacity>
    );
  };

  const addressInfo = {
    house: `Block: ${address.block}, Street: ${address.street}, House No.: ${address.houseNo}`,
    apartment: `Block: ${address.block}, Street: ${address.street}, Build: ${address.building}\nFloor: ${address.floor}, Apartment No.: ${address.apartmentNo}`,
    office: `Block: ${address.block}, Street: ${address.street}, Build: ${address.building}\nFloor: ${address.floor}, Office: ${address.office}`,
  };

  const selectAddress = (address) => {
    props.setSelectedAddress(address);
    closeModal();
  };

  const onPress = () => {
    if (isSelectable) {
      selectAddress(address);
    }
  };

  return (
    <View style={[styles.addressCardContainer, containerStyle]}>
      {isLoading ? (
        <View style={styles.addressLoadingContainer}>
          <CustomLoading iconSize={20} style={styles.loadingStyle} />
        </View>
      ) : (
        <>
          {!hideIcon &&
            (isEditMode ? (
              <UpdateButton />
            ) : (
              <AddressIcon fill={GS.lightGrey2} />
            ))}
          <TouchableOpacity
            activeOpacity={isSelectable ? 0.2 : 1}
            key={address._id}
            onPress={onPress}
            style={styles.selectableAddress}>
            <View style={styles.addressInfoContainer}>
              <RText style={styles.addressTextLabel}>{address.label}</RText>
              <RText style={styles.addressTextOthers}>{address.area}</RText>
              <RText style={styles.addressTextOthers}>
                {addressInfo[address?.addressType.toLowerCase()]}
              </RText>
              <RText style={styles.addressTextOthers}>{address.landmark}</RText>
            </View>
            {isEditMode && <DeleteButton />}
            {isSelectable && user.selectedAddress?._id === address._id && (
              <MIIcon
                name="my-location"
                color={GS.secondaryColor}
                style={styles.selectableAddressIcon}
                size={20}
              />
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    marginLeft: 'auto',
  },
  addressCardContainer: {
    minHeight: 70,
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'visible',
    marginHorizontal: 20,
  },
  addressInfoContainer: {
    marginLeft: 14,
    marginRight: 25,
  },
  addressTextLabel: {
    fontSize: normalizedFontSize(7),
  },
  addressTextOthers: {
    fontSize: normalizedFontSize(6),
    color: GS.lightGrey2,
    marginTop: 2.5,
    lineHeight: 17,
    marginLeft: 3,
  },
  addressLoadingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: -5,
  },
  selectableAddress: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 35,
    marginTop: 15,
  },
  selectableAddressIcon: {
    marginRight: 0,
    marginLeft: 'auto',
  },
  loadingStyle: {
    padding: 15,
    borderRadius: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispactToProps = (dispatch) => {
  return {
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
  };
};

export default connect(mapStateToProps, mapDispactToProps)(AddressCard);
