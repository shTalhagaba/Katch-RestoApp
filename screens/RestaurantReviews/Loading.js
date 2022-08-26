import React from 'react';
import {View, Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import {Loading as LottieLoading} from '../../assets/Lottie';

const Loading = ({style, isLoading}) => {
  return (
    <Modal 
      transparent={true}
      animationType="fade"
      visible={isLoading}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          ...style,
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 25,
            backgroundColor: '#fff',
          }}>
          <LottieView source={LottieLoading} autoPlay loop />
        </View>
      </View>
    </Modal>
  );
};

export default Loading;
