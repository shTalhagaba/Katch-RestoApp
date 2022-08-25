import React,{memo} from 'react';
import IOIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Platform, View, StatusBar, Animated, Text} from 'react-native';
import {
  Header,
  InfoContainerHeader,
  InfoHeader,
  HeaderText,
} from './style';
import GS from '../../../GlobeStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useStore } from 'react-redux';

const RestHeader = ({
  storeInfo,
  opacity,
  navigation,
  headerSpace
}) => {
  const {shopName = '', address = ''} = storeInfo ? storeInfo : {};

  const store = useStore();
  const { user } = store.getState();

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  return (
    <>
      <Animated.View style={{opacity, zIndex: 1, transform: [{translateY: headerSpace}],backgroundColor:'#fff'}}>
        <Header style={{marginTop: 0,borderBottomWidth:.5,borderColor:'silver',backgroundColor:'#fff',paddingTop: 6}}>
          <View
            style={{
              height: '100%',
              width: 50,
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginLeft:0
            }}/>

          <InfoContainerHeader>
            <InfoHeader style={{justifyContent: 'center',width: '90%'}}>
              <HeaderText style={{fontSize: 15}}>{shopName}</HeaderText>
              {user.selectedService === 'Pickup'
                ? <HeaderText numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 11, color: GS.secondaryColor, lineHeight: 12, }}>
                  Pickup from{' '}
                  <Text style={{ color: 'gray', fontSize: 10 }}>{address}</Text>
                </HeaderText>
                : <HeaderText numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 11, color: GS.secondaryColor, lineHeight: 12, }}>
                  Delivering to{' '}
                  <Text style={{ color: 'gray', fontSize: 10 }}>
                    {user.selectedAddress
                      ? user.selectedAddress.label
                      : 'Current Location'}
                  </Text>
                </HeaderText>
              }
            </InfoHeader>
          </InfoContainerHeader>
        </Header>
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          top: statusBarHeight,
          left: 0,
          zIndex: 1,
          paddingVertical: 3,
          paddingHorizontal: 4,
          borderRadius: 100,
          justifyContent: 'center',
          marginLeft: 10,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default memo(RestHeader);
