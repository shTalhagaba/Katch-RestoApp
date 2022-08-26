import React from 'react';
import {View, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import GS, {RText, customFont} from '../../GlobeStyle';
import {NoNetwork as NoNetworkLottie} from '../../assets/Lottie';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';

const NoNetwork = () => {

  const onRetry = async () => {
   const netInfo = await NetInfo.fetch();
   if(netInfo.isConnected){
    RNRestart.Restart();
   }
  }

  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={true}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: 40,
        }}>
        <RText
          fontName={customFont.axiformaBold}
          style={{fontSize: 20, alignSelf: 'center'}}>
          Connection error
        </RText>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <LottieView source={NoNetworkLottie} autoPlay loop resizeMode="cover"
            style={{
             
            }}/>
        </View>
        <View
          style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <RText
            fontName={customFont.axiformaBold}
            style={{fontSize: 25, color: GS.secondaryColor}}>
            No internet connection
          </RText>
          <RText
            style={{
              fontSize: 15,
              color: GS.secondaryColor,
              textAlign: 'center',
              color: 'gray',
              marginTop: 20,
            }}>
            Check your device's network connection.
          </RText>
          <TouchableOpacity
            onPress={onRetry}
            style={{
              backgroundColor: GS.secondaryColor,
              width: '90%',
              alignItems: 'center',
              paddingVertical: 20,
              borderRadius: 10,
              marginTop: 20,
            }}>
            <RText style={{color: '#fff', fontSize: 18}}>Retry</RText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NoNetwork;
