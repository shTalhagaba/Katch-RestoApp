/* eslint-disable react-native/no-inline-styles */
//react
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColorFromURL } from 'rn-dominant-color';
import { LOGOGREEN } from '../../assets/images';
import { Context } from '../../context/restaurant';
import GS, { customFont, normalizedFontSize, RText } from '../../GlobeStyle';
import RestHeader from '../Restaurant/MainScreen/Header';

const DeliveryView = ({ navigation }) => {
  const context = useContext(Context);

  const storeInfo = context.state.storeInfo;
  const deliveryServices = storeInfo?.deliveryServices;
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const translateY = useRef(new Animated.Value(0)).current;

  const opacity = translateY.interpolate({
    inputRange: [0, 171],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  let headerSpace = translateY.interpolate({
    inputRange: [0, 50],
    outputRange: [-statusBarHeight, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView
      style={[style.container, { paddingTop: statusBarHeight, flex: 1 }]}>
      {storeInfo ? (
        <RestHeader
          storeInfo={storeInfo}
          headerSpace={headerSpace}
          opacity={opacity}
          navigation={navigation}
        />
      ) : null}
      <View style={{ height: 50 }} />
      <View style={style.container}>
        <View style={style.labelContainer}>
          <RText
            fontName={customFont.axiformaSemiBold}
            style={style.orderFoodText}>
            Order Food Delivery
          </RText>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <KatchDeliveryContainer navigation={navigation} />
          {deliveryServices &&
            deliveryServices
              .filter(
                (/** @type {{ icon: string; url: string; }} */ service) =>
                  service?.icon?.startsWith('http') &&
                  service?.url?.startsWith('http'),
              )
              .map((service, index) => (
                <DeliveryViewContainer service={service} key={index} />
              ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const openLink = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
    }
  } catch (error) {}
};

const KatchDeliveryContainer = ({ navigation }) => {
  return (
    <View style={style.deliveryListView}>
      <View
        style={{
          justifyContent: 'center',
          marginRight: 10,
          backgroundColor: GS.logoGreen,
          borderRadius: 10,
        }}>
        <Image
          source={LOGOGREEN}
          style={{
            height: 60,
            width: 60,
            borderRadius: 10,
          }}
        />
      </View>
      <View style={{ padding: 10, justifyContent: 'center', flexGrow: 1 }}>
        <RText
          fontName={customFont.axiformaRegular}
          style={{ fontSize: 11, marginBottom: 5 }}>
          Order With{' '}
          <RText
            fontName={customFont.axiformaSemiBold}
            style={{ color: GS.logoGreen }}>
            US
          </RText>
        </RText>
        <RText
          fontName={customFont.axiformaRegular}
          style={{ fontSize: 11, marginBottom: 5 }}>
          Food Delivery
        </RText>
      </View>
      <View style={{ padding: 0, justifyContent: 'center' }}>
        <View style={{ borderColor: '#000', padding: 0 }}>
          <TouchableOpacity
            style={style.orderNowButton}
            onPress={() =>
              navigation.navigate('Rest', {
                screen: 'Menu',
              })
            }>
            <RText
              fontName={customFont.axiformaSemiBold}
              style={{
                fontSize: normalizedFontSize(6),
              }}>
              Order Now
            </RText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const DeliveryViewContainer = ({ service }) => {
  const [state, setState] = useState('#000');
  useEffect(() => {
    getColorFromURL(service.icon)
      .then((x) => {
        const color = Platform.OS === 'ios' ? x.background : x.primary;
        setState(color);
      })
      .catch((error) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={style.deliveryListView}>
      <View
        style={{
          justifyContent: 'center',
          paddingRight: 10,
        }}>
        <Image
          source={{ uri: service.icon }}
          style={{
            height: 60,
            width: 60,
            borderRadius: 10,
          }}
        />
      </View>
      <View style={{ padding: 10, justifyContent: 'center', flexGrow: 1 }}>
        <RText
          fontName={customFont.axiformaRegular}
          style={{ fontSize: 11, marginBottom: 5 }}>
          Order With{' '}
          <RText
            fontName={customFont.axiformaSemiBold}
            style={{ color: state }}>
            {service.name}
          </RText>
        </RText>
        <RText
          fontName={customFont.axiformaRegular}
          style={{ fontSize: 11, marginBottom: 5 }}>
          Food Delivery
        </RText>
      </View>
      <View style={{ padding: 0, justifyContent: 'center' }}>
        <View style={{ borderColor: '#000', padding: 0 }}>
          <TouchableOpacity
            style={style.orderNowButton}
            onPress={() => openLink(service.url)}>
            <RText
              fontName={customFont.axiformaSemiBold}
              style={{ fontSize: normalizedFontSize(6) }}>
              Order Now
            </RText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default DeliveryView;

const style = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  labelContainer: {
    // border: 1,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderColor: '#e6e6e6',
    borderWidth: 0.9,
    borderRadius: 5,
    marginBottom: 15,
  },
  orderFoodText: {
    fontSize: normalizedFontSize(8),
    marginLeft: 10,
    color: GS.black,
  },
  deliveryListView: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  orderNowButton: {
    color: GS.black,
    borderWidth: 0.7,
    borderColor: '#000',
    padding: 6,
    borderRadius: 3,
  },
});
