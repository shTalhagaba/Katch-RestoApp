/* eslint-disable react-native/no-inline-styles */
// @ts-nocheck

import { useMutation } from '@apollo/client'
import { insidePolygon } from 'geolocation-utils';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import KeyboardManager from 'react-native-keyboard-manager';
import Animated, { Easing, Extrapolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ADIcon from 'react-native-vector-icons/AntDesign';
import IOIcon from 'react-native-vector-icons/Ionicons';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { SEARCH } from '../../assets/images';
import { Apartment, House, Office } from '../../assets/svg';
import {
  ADD_USER_ADDRESS,
  UPDATE_USER_ADDRESS,
} from '../../components/GraphQL';
import { capitalizeFirstLetter } from '../../components/Helpers';
import CustomLoading from '../../components/Loading/More';
import {
  hydrateUserAddresses,
  setSelectedAddress,
} from '../../components/Redux/Actions/userActions';
import { kuwaitAreas } from '../../constants/kuwaitAreas';
import { coordinates } from '../../constants/kuwaitPolygon';
//others
import GS, { BoldText, customFont, RText } from '../../GlobeStyle';
import Input from '../../screens/Auth/input';
import AddressMapView from './addressmapview';
import styles from './styles';

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableAutoToolbar(false);
}
const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
    userReduxAddresses: state.user.addresses,
    userReduxselectedAddress: state.user.selectedAddress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setReduxAddresses: (addressess) =>
      dispatch(hydrateUserAddresses(addressess)),
    setReduxSelectedAddress: (addresses) =>
      dispatch(setSelectedAddress(addresses)),
  };
};

const AddUserAddress = connect(
  mapStateToProps,
  mapDispatchToProps,
)((props) => {
  const {
    addressSaved,
    route,
    navigation,
    userLoc,
    tabProps,
    setReduxAddresses,
    userReduxAddresses,
    userReduxselectedAddress,
    setReduxSelectedAddress,
  } = props;
  const onChange = (key, value) => {
    const values = { ...address };
    values[key] = value;
    if (key === 'landmark') {
      setAddress({ ...values });
    } else {
      isFormValidated({ key, value });
      setAddress({ ...values });
    }
  };

  const INITIAL_STATE = route?.params?.initial_state || {
    label: '',
    addressType: 'Apartment',
    area: '',
    block: '',
    street: '',
    building: '',
    floor: '',
    apartmentNo: '',
    houseNo: '',
    office: '',
    landmark: '',
    location: userLoc ? [userLoc.longitude, userLoc.latitude] : [0, 0],
  };

  INITIAL_STATE.location = INITIAL_STATE.location.coordinates
    ? INITIAL_STATE.location.coordinates
    : INITIAL_STATE.location;

  // Store Error for each field
  const INITIAL_STATE_ERROR = {
    label: null,
    area: null,
    block: null,
    street: null,
    building: null,
    floor: null,
    apartmentNo: null,
    houseNo: null,
    office: null,
  };
  const [errors, setErrors] = useState(INITIAL_STATE_ERROR);
  const [address, setAddress] = useState(INITIAL_STATE);
  const [showModal, setShowModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocInArea, setIsLocInArea] = useState(false);

  useEffect(() => {
    const isIn = insidePolygon(
      [address.location[0], address.location[1]],
      coordinates,
    );
    if (isIn !== isLocInArea) {
      setIsLocInArea(isIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.location]);

  const isFormValidated = async (keyValue) => {
    const fieldMap = {
      houseNo: 'House no',
      apartmentNo: 'Apartment no',
    };
    const { key, value } = keyValue;
    if (value === '') {
      setErrors({
        ...errors,
        [key]:
          (fieldMap[key] || capitalizeFirstLetter(key)) + ' cannot be empty',
      });
    } else {
      setErrors((state) => {
        state = { ...errors, [key]: '' };
        return state;
      });
    }
  };

  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios'
      ? Math.ceil(StatusBar.currentHeight)
      : insets.top < 1
      ? 25
      : insets.top;

  //Update User UPDATE_USER_ADDRESS
  const [updateUserAddress] = useMutation(UPDATE_USER_ADDRESS);
  //Create new Address for loggedin user
  const [addUserAddress] = useMutation(ADD_USER_ADDRESS);

  const saveAddress = async (addressBody) => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    const addressType = addressBody.addressType.toLowerCase();
    if (addressType === 'apartment') {
      addressBody.houseNo = '';
      addressBody.office = '';
    } else if (addressType === 'house') {
      addressBody.apartmentNo = '';
      addressBody.building = '';
      addressBody.floor = '';
      addressBody.office = '';
    } else if (addressType === 'office') {
      addressBody.apartmentNo = '';
      addressBody.houseNo = '';
    }

    try {
      // Update Method
      if (route?.params?.initial_state) {
        const { data } = await updateUserAddress({
          variables: {
            form: addressBody,
          },
        });
        setReduxAddresses(
          userReduxAddresses.map((_address) => {
            return _address._id === addressBody._id
              ? data.updateUserAddress
              : _address;
          }),
        );
        if (userReduxselectedAddress?._id === addressBody._id) {
          setReduxSelectedAddress(data.updateUserAddress);
        }
      } else {
        const { data } = await addUserAddress({
          variables: {
            form: addressBody,
          },
        });

        setReduxAddresses([data.addUserAddress, ...userReduxAddresses]);
        setReduxSelectedAddress(data.addUserAddress);
      }
      navigation.goBack();
    } catch (e) {
      setIsLoading(false);
      addressSaved(false);
    }
  };

  const [selectedAddressType, setSelectedAddressType] = useState(
    route?.params?.initial_state.addressType || 'Apartment',
  );
  const hideModal = () => setShowModal(false);
  const changeSelectedType = (x) => {
    onChange('addressType', x);
    setSelectedAddressType(x);
    // clear the error for apartments and
    if (x?.toLowerCase() === 'house') {
      setErrors({
        ...errors,
        building: '',
        floor: '',
        apartmentNo: '',
        office: '',
      });
    }
    if (x?.toLowerCase() === 'apartment') {
      setErrors({ ...errors, houseNo: '', office: '' });
    }

    if (x?.toLowerCase() === 'office') {
      setErrors({ ...errors, houseNo: '', apartmentNo: '' });
    }

    setShowModal(false);
    if (!address.area) {
      setShowAreaModal(true);
    } else {
      setTimeout(() => inputRef_3.current?.focus(), 100);
    }
  };

  const validateForm = () => {
    return Object.keys(INITIAL_STATE_ERROR).every((x) => {
      if (selectedAddressType === 'House') {
        if (['building', 'floor', 'apartmentNo', 'office'].includes(x)) {
          return true;
        }
      }
      if (selectedAddressType === 'Office') {
        if (['houseNo', 'apartmentNo'].includes(x)) {
          return true;
        }
      }
      if (selectedAddressType === 'Apartment') {
        if (['houseNo', 'office'].includes(x)) {
          return true;
        }
      }
      if (address[x] === '') {
        isFormValidated({ key: x, value: '' });
      }
      return address[x] !== '';
    });
  };

  const hideAreaModal = () => setShowAreaModal(false);
  const viewAreaModal = () => setShowAreaModal(true);

  const changeAreaType = (x) => {
    onChange('area', x);
    hideAreaModal();
    setTimeout(() => inputRef_3.current?.focus(), 100);
  };

  const translateY = useRef(new Animated.Value(0)).current;

  const screenHeight = Dimensions.get('window').height;

  const [docked, setDocked] = useState(true);

  const expandDock = () => {
    setDocked(false);
    Animated.timing(translateY, {
      duration: 200,
      toValue: 1,
      easing: Easing.ease,
    }).start();
  };

  const hideDock = () => {
    setDocked(true);
    Keyboard.dismiss();
    Animated.timing(translateY, {
      duration: 200,
      toValue: 0,
      easing: Easing.ease,
    }).start();
  };

  const dockTranslateY = screenHeight - 80;

  const translateYInterpolate = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [dockTranslateY, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const statusBarPlaceHolderOpacity = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const [showUserLoc, setUserLoc] = useState(null);
  const showUserLocation = () => {
    setUserLoc(Date.now());
  };

  const inset = useSafeAreaInsets();
  const marginBottom = Platform.OS === 'android' ? 0 : 20;
  const inputRef = Array(11).fill(React.useRef());
  const inputRef_0 = React.useRef();
  const inputRef_1 = React.useRef();
  const inputRef_2 = React.useRef();
  const inputRef_3 = React.useRef();
  const inputRef_4 = React.useRef();
  const inputRef_5 = React.useRef();
  const inputRef_6 = React.useRef();
  const inputRef_7 = React.useRef();
  const inputRef_8 = React.useRef();
  const inputRef_9 = React.useRef();
  const inputRef_10 = React.useRef();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Animated.View
        style={[
          styles.statusBarPlaceHolder,
          { opacity: statusBarPlaceHolderOpacity },
        ]}
      />

      <BackButton
        docked={docked}
        hideDock={hideDock}
        navigation={navigation}
        statusBarHeight={statusBarHeight}
        tabProps={tabProps}
      />
      {docked ? (
        <View style={[styles.userLocationButton, { top: inset.top + 10 }]}>
          <TouchableOpacity onPress={showUserLocation}>
            <MIIcon name="my-location" color={GS.secondaryColor} size={25} />
          </TouchableOpacity>
        </View>
      ) : null}
      <AddressMapView
        mapChange={(coordinate) => onChange('location', coordinate)}
        location={userLoc}
        isLocInArea={isLocInArea}
        expandDock={expandDock}
        navigation={navigation}
        docked={docked}
        showUserLoc={showUserLoc}
        initialMarker={
          INITIAL_STATE.location[0] === 0
            ? null
            : {
                latitude: INITIAL_STATE.location[1],
                longitude: INITIAL_STATE.location[0],
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
        }
      />

      <Animated.View
        style={[
          styles.addressFormDock,
          { transform: [{ translateY: translateYInterpolate }] },
        ]}>
        {!docked && <View style={{ height: 80, width: '100%' }} />}
        <ScrollView
          style={[styles.scrollView]}
          scrollEnabled={!docked}
          contentContainerStyle={[
            styles.contentContainerStyle,
            {
              opacity: !docked ? 1 : 0,
            },
          ]}>
          <Input
            SvgColor={'silver'}
            borderBottomColor={'silver'}
            placeHolder="Address Label"
            value={address.label}
            onChangeText={(text) => onChange('label', text)}
            errorMessage={errors.label}
            textInputHeight={null}
            marginBottom={marginBottom}
            blurOnSubmit={false}
            forwardedRef={inputRef_0}
            onChange={() => setShowModal(true)}
          />

          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Input
              dropDown
              borderBottomColor={'silver'}
              placeHolder="Address Type"
              value={address.addressType}
              errorMessage={errors.addressType}
              editable={false}
              textInputHeight={null}
              marginBottom={marginBottom}
              pointerEvent={'none'}
              blurOnSubmit={false}
              forwardedRef={inputRef_1}
              onChange={() => inputRef_2.current?.focus()}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={viewAreaModal}>
            <Input
              dropDown
              borderBottomColor={'silver'}
              placeHolder="Area"
              value={address.area}
              onChangeText={(text) => onChange('area', text)}
              errorMessage={errors.area}
              editable={false}
              textInputHeight={null}
              marginBottom={marginBottom}
              pointerEvent={'none'}
              blurOnSubmit={false}
              forwardedRef={inputRef_2}
              onChange={() => inputRef_3.current?.focus()}
            />
          </TouchableOpacity>

          <Input
            SvgColor={'silver'}
            borderBottomColor={'silver'}
            placeHolder="Block"
            value={address.block}
            onChangeText={(text) => onChange('block', text)}
            errorMessage={errors.block}
            textInputHeight={null}
            marginBottom={marginBottom}
            blurOnSubmit={false}
            forwardedRef={inputRef_3}
            onChange={() => inputRef_4.current?.focus()}
          />

          <Input
            SvgColor={'silver'}
            borderBottomColor={'silver'}
            placeHolder="Street"
            value={address.street}
            onChangeText={(text) => onChange('street', text)}
            errorMessage={errors.street}
            textInputHeight={null}
            marginBottom={marginBottom}
            blurOnSubmit={false}
            forwardedRef={inputRef_4}
            onChange={() => {
              selectedAddressType !== 'House'
                ? inputRef_5.current?.focus()
                : inputRef_8.current?.focus();
            }}
          />

          {selectedAddressType !== 'House' && (
            <Input
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              placeHolder="Building"
              value={address.building}
              onChangeText={(text) => onChange('building', text)}
              errorMessage={errors.building}
              textInputHeight={null}
              marginBottom={marginBottom}
              blurOnSubmit={false}
              forwardedRef={inputRef_5}
              onChange={() => inputRef_6.current?.focus()}
            />
          )}

          {selectedAddressType !== 'House' && (
            <Input
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              placeHolder="Floor"
              value={address.floor}
              onChangeText={(text) => onChange('floor', text)}
              errorMessage={errors.floor}
              textInputHeight={null}
              marginBottom={marginBottom}
              blurOnSubmit={false}
              forwardedRef={inputRef_6}
              onChange={() =>
                selectedAddressType === 'Apartment'
                  ? inputRef_7.current?.focus()
                  : selectedAddressType === 'Office'
                  ? inputRef_9.current?.focus()
                  : inputRef_8.current?.focus()
              }
            />
          )}

          {selectedAddressType === 'Apartment' && (
            <Input
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              placeHolder="Apartment No."
              value={address.apartmentNo}
              onChangeText={(text) => onChange('apartmentNo', text)}
              errorMessage={errors.apartmentNo}
              textInputHeight={null}
              marginBottom={marginBottom}
              blurOnSubmit={false}
              forwardedRef={inputRef_7}
              onChange={() => inputRef_10.current?.focus()}
            />
          )}

          {selectedAddressType === 'House' && (
            <Input
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              placeHolder="House No."
              value={address.houseNo}
              onChangeText={(text) => onChange('houseNo', text)}
              errorMessage={errors.houseNo}
              textInputHeight={null}
              marginBottom={marginBottom}
              blurOnSubmit={false}
              forwardedRef={inputRef_8}
              onChange={() => inputRef_10.current?.focus()}
            />
          )}

          {selectedAddressType === 'Office' && (
            <Input
              SvgColor={'silver'}
              borderBottomColor={'silver'}
              placeHolder="Office"
              value={address.office}
              onChangeText={(text) => onChange('office', text)}
              errorMessage={errors.office}
              textInputHeight={null}
              marginBottom={marginBottom}
              blurOnSubmit={false}
              forwardedRef={inputRef_9}
              onChange={() => inputRef_10.current?.focus()}
            />
          )}

          <Input
            SvgColor={'silver'}
            borderBottomColor={'silver'}
            placeHolder="Landmark (Optional)"
            value={address.landmark}
            onChangeText={(text) => onChange('landmark', text)}
            errorMessage={errors.landmark}
            textInputHeight={null}
            marginBottom={marginBottom}
            blurOnSubmit={true}
            forwardedRef={inputRef_10}
          />
        </ScrollView>
        <View style={styles.fromButtonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => hideDock()}>
            <RText style={styles.cancelButtonText}>Cancel</RText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveAddress(address)}>
            <RText style={styles.saveButtonText}>SAVE</RText>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ViewAddressType
        showModal={showModal}
        selectedType={changeSelectedType}
        hideModal={hideModal}
      />

      <AreaModal
        isOpen={showAreaModal}
        toggleModal={hideAreaModal}
        changeAreaType={changeAreaType}
      />

      <Modal
        visible={isLoading}
        transparent={true}
        statusBarTranslucent={true}
        animationType="none">
        <View style={styles.loadingContainer}>
          <CustomLoading iconSize="large" style={styles.loadingStyle} />
        </View>
      </Modal>
    </SafeAreaView>
  );
});

const BackButton = (props) => {
  const { navigation, tabProps, hideDock, docked } = props;
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.backButton, { top: insets.top + 10 }]}>
      <TouchableOpacity
        onPress={() => {
          if (docked) {
            navigation.goBack()
            if (
              tabProps &&
              tabProps.routeParams &&
              tabProps.routeParams.cameFrom
            ) {
              tabProps.routeParams.cameFrom();
            }
          } else {
            hideDock();
          }
        }}>
        <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
      </TouchableOpacity>
    </View>
  );
};

// Modal To change address Type
const ViewAddressType = (props) => {
  const { showModal, selectedType, hideModal } = props;
  const locations = [
    {
      name: 'House',
      icon: House,
    },
    {
      name: 'Office',
      icon: Office,
    },
    {
      name: 'Apartment',
      icon: Apartment,
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={hideModal}>
      <View style={styles.areaModalContainer}>
        <TouchableOpacity style={{ flexGrow: 1 }} onPress={hideModal} />
        <View style={styles.viewAddressTypeContainer}>
          {/* header */}
          <View style={styles.modalHeader}>
            <BoldText
              fontName={customFont.axiformaMedium}
              style={styles.modalHeaderText}>
              Select Address Type
            </BoldText>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={hideModal}>
              <ADIcon color="gray" name="close" size={20} />
            </TouchableOpacity>
          </View>
          {/* header */}
          <View style={styles.addressTypeContainer}>
            {locations.map((location) => {
              const Icon = location.icon;
              return (
                <TouchableOpacity
                  key={location.name}
                  onPress={() => selectedType(location.name)}
                  style={styles.addressTypeButton}>
                  <Icon fill={GS.lightGrey2} />
                  <RText style={styles.addressTypeButtonText}>
                    {location.name}
                  </RText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddUserAddress;

const AreaModal = (props) => {
  const { isOpen, toggleModal, changeAreaType } = props;

  const [areaSearch, setAreaSearch] = useState('');

  const DATA = Object.keys(kuwaitAreas).map((area) => ({
    title: area,
    data: kuwaitAreas[area].filter((_area) => {
      if (areaSearch === '') {
        return _area;
      } else if (new RegExp(areaSearch, 'gi').test(_area)) {
        return _area;
      }
    }),
  }));

  const renderSectionHeader = (sectionProps) => {
    const {
      section: { title, data },
    } = sectionProps;
    if (data.length < 1) {
      return null;
    }
    return (
      <View style={styles.areaTitle}>
        <BoldText style={styles.areaTitleText}>{title}</BoldText>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          changeAreaType(item);
        }}
        styles={styles.areaNameButton}>
        <View style={styles.areaName}>
          <RText style={styles.areaNameText}>{item}</RText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      statusBarTranslucent={true}
      onRequestClose={toggleModal}
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onDismiss={toggleModal}>
      <View style={styles.areaModalContainer}>
        <TouchableOpacity onPress={toggleModal} style={{ flex: 1 }} />
        <View style={styles.areaModal}>
          <View style={styles.modalHeader}>
            <BoldText
              fontName={customFont.axiformaMedium}
              style={styles.modalHeaderText}>
              Areas
            </BoldText>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={toggleModal}>
              <ADIcon color="gray" name="close" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.areaSearchContainer}>
            <Image source={SEARCH} style={styles.areaSearchIcon} />
            <TextInput
              style={styles.areaSearchInput}
              placeholder="Search area..."
              value={areaSearch}
              onChangeText={(text) => {
                setAreaSearch(text);
              }}
            />
          </View>
          <SectionList
            stickySectionHeadersEnabled={true}
            showsVerticalScrollIndicator={false}
            style={styles.sectionList}
            sections={DATA}
            keyExtractor={(item, index) => item}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
          />
        </View>
      </View>
    </Modal>
  );
};
