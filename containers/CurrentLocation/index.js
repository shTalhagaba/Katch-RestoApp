import auth from '@react-native-firebase/auth';
import React, { Fragment, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import RNLocation from 'react-native-location';
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
import ADIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import AddressCard from '../../components/AddressCard';
import { setSelectedAddress } from '../../components/Redux/Actions/userActions';
//others
import GS, { BoldText, customFont, TextBasic } from '../../GlobeStyle';
import style from './style';

const CurrentLocation = (props) => {
  const { user, navigation, userLoc } = props;
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    RNLocation.checkPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    })
      .then((res) => {
        if (res !== permission) {
          setPermission(res);
        }
      })
      .catch((error) => {});
  }, [permission, userLoc]);

  const pickLocationPress = async () => {
    try {
      if (permission === true) {
        setShowAddressModal(true);
      } else if (permission === false) {
        if (Platform.OS === 'android') {
          // eslint-disable-next-line no-shadow
          const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          const result = await request(permission);
          if (result === 'granted') {
            setPermission(true);
            setShowAddressModal(true);
          } else if (['unavailable', 'denied', 'blocked'].includes(result)) {
            openSettings();
          }
        } else {
          openSettings();
        }
      }
    } catch (error) {}
  };

  return (
    <>
      <View style={style.container}>
        {
          <View style={[style.locationContainer]}>
            <TouchableOpacity
              style={style.locationButton}
              onPress={pickLocationPress}>
              {permission === true ? (
                <Fragment>
                  <FAIcon name="location-arrow" color={GS.secondaryColor} />
                  <TextBasic style={style.locationButtonText}>
                    {user.selectedAddress
                      ? user.selectedAddress.label
                      : 'Current Location'}
                  </TextBasic>
                </Fragment>
              ) : permission === false ? (
                <MIIcon name="location-off" color={GS.errorRed} size={25} />
              ) : null}
            </TouchableOpacity>
          </View>
        }
      </View>

      <AddressModal
        navigation={navigation}
        isVisible={showAddressModal}
        close={() => {
          setShowAddressModal(false);
        }}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userLoc: state.app.userLoc,
  };
};

const mapDispactToProps = (dispatch) => {
  return {
    setSelectedAddress: (address) => dispatch(setSelectedAddress(address)),
  };
};

const AddressModal = connect(
  mapStateToProps,
  mapDispactToProps,
)((props) => {
  // eslint-disable-next-line no-shadow
  const { user, setSelectedAddress, isVisible, close, navigation } = props;

  const selectAddress = (address) => {
    setSelectedAddress(address);
    close();
  };

  const renderAdressCard = ({ item }) => {
    return (
      <AddressCard
        address={item}
        navigation={navigation}
        user={user}
        closeModal={close}
        isSelectable={true}
      />
    );
  };

  const address = user.addresses ? (
    <FlatList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={style.addressList}
      keyExtractor={({ _id }, index) => (_id ? _id : index)}
      data={user.addresses}
      renderItem={renderAdressCard}
    />
  ) : null;

  return (
    <Modal
      visible={isVisible}
      onRequestClose={close}
      transparent={true}
      animated={true}
      animationType="slide">
      <StatusBar backgroundColor="#00000050" />
      <View style={style.modalContainer}>
        <TouchableOpacity
          style={style.modalBackgroundToucable}
          onPress={close}
        />
        <View style={style.modalInnderContainer}>
          <View style={style.modalHeader}>
            <BoldText
              fontName={customFont.axiformaMedium}
              style={style.modalHeaderText}>
              Your Location
            </BoldText>
            <TouchableOpacity style={style.modalCloseButton} onPress={close}>
              <ADIcon color="gray" name="close" size={20} />
            </TouchableOpacity>
          </View>

          <View style={style.addAddressContainer}>
            <TouchableOpacity
              onPress={() => {
                const authUser = auth().currentUser;
                if (authUser) {
                  close();
                  navigation.navigate('Account', {
                    screen: 'AddUserAddress',
                  });
                } else {
                  navigation.navigate('Account');
                }
              }}
              style={[style.addAddressButton]}>
              <EIcon name="plus" color={GS.secondaryColor} size={18} />
              <BoldText
                fontName={customFont.axiformaMedium}
                style={style.addAddressText}>
                Add new address
              </BoldText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              selectAddress(null);
            }}
            style={style.selectableAddress}>
            <FAIcon
              name="location-arrow"
              fill={GS.lightGrey2}
              style={style.ph5}
            />
            <BoldText
              fontName={customFont.axiformaMedium}
              style={style.selectableAddressText}>
              Current Location
            </BoldText>
            {!user.selectedAddress && (
              <MIIcon
                name="my-location"
                color={GS.secondaryColor}
                style={style.selectableAddressIcon}
                size={20}
              />
            )}
          </TouchableOpacity>
          {address}
        </View>
      </View>
    </Modal>
  );
});

export default connect(mapStateToProps, mapDispactToProps)(CurrentLocation);
