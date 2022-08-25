import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { COUPON_BUTTON } from '../../assets/images';
import serviceTypes from '../../constants/serviceTypes';
import { setSelectedService } from '../Redux/Actions/userActions';

const CouponRibbonFold = ({ hasCoupons, ...props }) => {
  const navigation = useNavigation();
  if (!hasCoupons) {
    return null;
  }
  const navigateToCoupons = () => {
    props.setSelectedService(serviceTypes.coupon);
    navigation.navigate('Home');
  };
  return (
    <View
      style={{
        zIndex: 2,
        position: 'absolute',
        top: 0,
        bottom: 5,
      }}>
      <TouchableOpacity onPress={navigateToCoupons}>
        <View
          style={{
            height: 80,
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
          }}>
          <Image
            source={COUPON_BUTTON}
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedService: (service) => dispatch(setSelectedService(service)),
  };
};

export default connect(null, mapDispatchToProps)(memo(CouponRibbonFold));
