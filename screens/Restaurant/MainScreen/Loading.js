import React, {memo} from 'react';
import {Modal, StatusBar, SafeAreaView, View,TouchableOpacity, Platform} from 'react-native';
import ProgressLoading from '../../../components/Loading/ProgressLoading';
import IOIcon from 'react-native-vector-icons/Ionicons';
import GS from '../../../GlobeStyle';
import LottieView from 'lottie-react-native';
import {Loading} from '../../../assets/Lottie';

const Loading2 = ({navigation, show}) => (
  <Modal
    animationType="slide"
    statusBarTranslucent={false}
    transparent={true}
    visible={!show}>
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,

      }}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#fff',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          zIndex: 100,
          position: 'absolute',
          top: Platform.OS === 'ios'? 40: 20,
          right: 0,
          left: 0,
        }}>
        <TouchableOpacity
          style={{height: 50, justifyContent: 'center', paddingHorizontal: 10}}
          onPress={() => navigation.goBack()}>
          <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
        </TouchableOpacity>
      </View>
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

export default memo(Loading2);
