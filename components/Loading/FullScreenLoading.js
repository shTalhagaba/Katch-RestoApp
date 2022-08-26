import React from 'react';
import { View, Image, Platform, Modal } from 'react-native';
import { Loading } from '../../assets/Lottie';
import LottieView from 'lottie-react-native';
import { KATCH_LOGO } from '../../assets/images';
import FastImage from 'react-native-fast-image';

const FSL = ({ isLoading = true }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isLoading}
      onRequestClose={() => null}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {Platform.OS === 'android' ? (
            <Image source={KATCH_LOGO} style={{ width: '175%', height: 200 }} />
          ) : (
            <FastImage
              style={{ width: '175%', height: 200 }}
              source={KATCH_LOGO}
            />
          )}
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 50,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 25,
              backgroundColor: '#fff',
            }}>
            <LottieView source={Loading} autoPlay loop />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FSL;
