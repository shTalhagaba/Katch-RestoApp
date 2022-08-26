/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import EIcon from 'react-native-vector-icons/Entypo';
import ADIcon from 'react-native-vector-icons/AntDesign';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import RNLocation from 'react-native-location';
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
import { House, Apartment, Office } from '../../assets/svg';

//others
import GS, {
  TextBasic,
  normalizedFontSize,
  customFont,
  BoldText,
} from '../../GlobeStyle';
import { getGreetings } from '../Helpers';
import { setSelectedAddress } from '../Redux/Actions/userActions';
import AddressCard from '../../components/AddressCard';

const LandingGreeting = (props) => {
  const { user, navigation, userLoc } = props;
  const authUser = auth().currentUser;
  const [state, setState] = useState(false);
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
        setState(true);
      } else if (permission === false) {
        if (Platform.OS === 'android') {
          // eslint-disable-next-line no-shadow
          const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          const result = await request(permission);
          if (result === 'granted') {
            setPermission(true);
            setState(true);
          } else if (['unavailable', 'denied', 'blocked'].includes(result)) {
            openSettings();
          }
        } else {
          openSettings();
        }
      }
    } catch (error) {}
  };

  const minifyName = (/** @type {string} */ name) => {
    if (!name) {
      return '';
    }
    try {
      if (name.length > 18) {
        const parsedName = name.split(' ');
        if (parsedName.length === 1) {
          return name;
        } else if (parsedName.length === 2) {
          return parsedName[0] + ' ' + parsedName[1].substring(0, 1) + '.';
        } else {
          return name.substring(0, 14) + '.';
        }
      } else {
        return name;
      }
    } catch (e) {
      return name;
    }
  };
  return (
    <>
      <View style={style.container}>
        <View style={style.greetingContainer}>
          {authUser && (
            <TextBasic allowFontScaling={false} style={style.greetingText1}>
              {`Good ${getGreetings()}`}
            </TextBasic>
          )}
          <TextBasic allowFontScaling={false} style={style.greetingText2}>
            {authUser
              ? minifyName(authUser.displayName)
              : `Good ${getGreetings()}`}
          </TextBasic>
        </View>
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
        isVisible={state}
        close={() => {
          setState(false);
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
  const [address, setAddress] = useState(null);
  const selectAddress = (address) => {
    setSelectedAddress(address);
    close();
  };

  useEffect(() => {
    if (user && user.addresses) {
      setAddress(
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={style.addressList}
          keyExtractor={({ _id }, index) => (_id ? _id : index)}
          data={user.addresses}
          renderItem={renderAddressCard}
        />,
      );
    } else {
      setAddress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderAddressCard = ({ item }) => {
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
              style={{ paddingHorizontal: 5 }}
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

export default connect(mapStateToProps, mapDispactToProps)(LandingGreeting);

const style = StyleSheet.create({
  addressList: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  container: {
    paddingLeft: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  greetingContainer: {},
  greetingText1: {
    color: '#fff',
    fontSize: normalizedFontSize(8),
    paddingBottom: 0,
    fontFamily: customFont.axiformaRegular,
  },
  greetingText2: {
    color: '#fff',
    fontSize: normalizedFontSize(12),
    fontFamily: customFont.axiformaMedium,
  },
  locationContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flexGrow: 1,
  },
  locationButton: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonText: {
    marginLeft: 10,
    color: GS.secondaryColor,
    fontSize: normalizedFontSize(8),
    fontFamily: customFont.axiformaMedium,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000050',
  },
  modalBackgroundToucable: {
    flexGrow: 0.6,
  },
  modalInnderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  modalHeaderText: {
    fontSize: normalizedFontSize(9),
    color: GS.textColorGreyDark3,
  },
  modalCloseButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  selectableAddress: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 35,
    marginTop: 15,
  },
  selectableAddressText: {
    fontSize: normalizedFontSize(8.5),
    marginRight: 'auto',
    paddingHorizontal: 10,
  },
  selectableAddressDetails: {
    flexDirection: 'column',
    fontSize: 11,
  },
  selectableAddressIcon: {
    marginRight: 20,
  },
  addAddressContainer: {
    backgroundColor: '#fff',
  },
  addAddressText: {
    fontSize: normalizedFontSize(7),
    marginLeft: 10,
    marginTop: 5,
    marginHorizontal: 10,
    color: GS.secondaryColor,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    marginHorizontal: 0,
    backgroundColor: '#fff',
  },
});
