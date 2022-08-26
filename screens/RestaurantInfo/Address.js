import React, { Fragment } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { BoldText, RText } from '../../GlobeStyle';
import { CopyLocation, GetDirections } from '../../assets/svg';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';

const Address = ({ address, style, location, storeName }) => {
  const openMap = () => {
    try {
      const { latitude, longitude } = location;
      let scheme = 'http://maps.google.com/maps?q=';
      const latLng = `${latitude},${longitude}`;
      const label = encodeURIComponent(storeName);
      let url = `${scheme}${latLng}+(${label})`;
      Linking.openURL(url);
    } catch (error) {
      //TODO - Create the logic to show error to user when desiging the UI
      console.error(error);
    }
  };

  const copyToClipboard = () => {
    const { latitude, longitude } = location;
    let scheme = 'http://maps.google.com/maps?q=';
    const latLng = `${latitude},${longitude}`;
    const label = encodeURIComponent(storeName);
    let url = `${scheme}${latLng}+(${label})`;
    Clipboard.setString(url);
    Toast.show('Copied to Clipboard', Toast.SHORT);
  };

  return (
    <View style={style.addressContainerOuter}>
      <View style={style.addressContainerInner}>
        {address ? (
          <Fragment>
            <BoldText style={style.addressTextMarigin}>Address</BoldText>
            <RText style={style.addressLine}>{address}</RText>
          </Fragment>
        ) : null}
        <View style={style.addressButtonsContainer}>
          <AddressButton
            style={style}
            text="COPY LOCATION"
            svg={CopyLocation}
            onPress={copyToClipboard}
          />
          <AddressButton
            style={style}
            text="GET DIRECTION"
            svg={GetDirections}
            onPress={openMap}
          />
        </View>
      </View>
    </View>
  );
};

const AddressButton = ({ style, text, svg: SVG, onPress }) => (
  <TouchableOpacity style={style.addressButtonContainer} onPress={onPress}>
    <SVG height={20} width={20} />
    <RText style={style.addressButtonText}>{text}</RText>
  </TouchableOpacity>
);
export default Address;
