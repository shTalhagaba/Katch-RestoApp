import React, { useRef } from 'react';
import { View, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { Loading } from '../../assets/Lottie';
import IOIcon from 'react-native-vector-icons/Ionicons';
import GS from '../../GlobeStyle';

const ProgressLoading = ({ backgroundColor, visible = true, onBack }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor ? backgroundColor : '#00000020',
        }}>
        {onBack && (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 20,
              left: 0,
              right: 0,
            }}>
            <TouchableOpacity
              onPress={onBack}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 8,
              }}>
              <IOIcon
                name="md-arrow-back"
                size={35}
                color={GS.secondaryColor}
              />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 25,
            backgroundColor: '#fff',
          }}>
          <LottieView source={Loading} autoPlay loop />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ProgressLoading;
