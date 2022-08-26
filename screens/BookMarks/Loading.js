import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import {Loading as LottieLoading} from '../../assets/Lottie';

const Loading = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
  );
};

export default Loading;
