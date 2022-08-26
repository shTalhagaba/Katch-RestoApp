import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { ActionButton, RText } from '../../GlobeStyle';
import AsyncStorage from '@react-native-community/async-storage';

const LandingModal = ({ popup }) => {
  const { displaymode, popupId, image, route, button } = popup;
  const [modalVisible, setModalVisible] = useState(false);
  const nav = useNavigation();
  const localStorageItem = 'Banner';
  const storeData = async (data) => {
    try {
      await AsyncStorage.setItem(localStorageItem, JSON.stringify(data));
    } catch (error) {}
  };
  const screenWidth = Dimensions.get('window').width;
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem(localStorageItem);
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        if (displaymode === 'once') {
          if (parsedValue.popupId === popupId) {
            setModalVisible(false);
          } else {
            storeData({ popupId: popupId });
            setModalVisible(true);
          }
        } else if (displaymode === 'always') {
          setModalVisible(true);
        } else {
          setModalVisible(false);
        }
      } else {
        if (displaymode === 'once') {
          storeData({ popupId: popupId });
          setModalVisible(true);
        } else if (displaymode === 'always') {
          setModalVisible(true);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <Modal
      onDismiss={() => setModalVisible(!modalVisible)}
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(!modalVisible)}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      backdropOpacity={0.3}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <FastImage
            style={[
              styles.imageStyle,
              {
                height: undefined,
                aspectRatio: image.width / image.height,
              },
            ]}
            source={{ uri: image.uri }}
            resizeMode={'contain'}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.close}>
            <View style={styles.closeIconContainer}>
              <FAIcon name="close" size={15} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <ActionButton
          onPress={() => {
            nav.navigate(route.screen, {
              ...JSON.parse(route.params),
            });
            setModalVisible(!modalVisible);
          }}
          style={JSON.parse(button.btnStyle)}>
          <RText style={JSON.parse(button.textStyle)}>{button.text}</RText>
        </ActionButton>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    maxHeight: '90%',
  },
  close: {
    position: 'absolute',
    top: 5,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconContainer: {
    height: 25,
    width: 25,
    textAlign: 'center',
    backgroundColor: '#333',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LandingModal;
