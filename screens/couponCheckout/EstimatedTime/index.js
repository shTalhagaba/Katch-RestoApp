import React, { useState, useEffect } from 'react';
import { View, LayoutAnimation } from 'react-native';

//3rd party
import { useLazyQuery } from '@apollo/react-hooks';
import Lottie from 'lottie-react-native';
//others
import { GET_ESTIMATED_TIME } from '../../../components/GraphQL';
import { RText } from '../../../GlobeStyle';
import styles from './styles';
import { MealReady, DeliveryDrone } from '../../../assets/Lottie';
import serviceTypes from '../../../constants/serviceTypes';

const EstimatedTime = (props) => {
  const {
    userLocation,
    restaurantLocation,
    serviceType,
    restaurantId,
    hasError,
  } = props;

  const [orderEta, setOrderEta] = useState(null);

  const [getEstimatedTime, { loading }] = useLazyQuery(GET_ESTIMATED_TIME, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.getOrderEta) {
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        setOrderEta({
          min: data.getOrderEta.min,
          max: data.getOrderEta.max,
        });
      }
    },
    onError: (data) => {
      setOrderEta(null);
    },
  });

  useEffect(() => {
    if (userLocation && restaurantLocation && serviceType && restaurantId) {
      getEstimatedTime({
        variables: {
          orderEtaInput: {
            userLocation,
            restaurantLocation,
            serviceType,
            restaurantId,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, serviceType, restaurantId]);

  const littleFile = {
    [serviceTypes.pickUp]: MealReady,
    [serviceTypes.delivery]: DeliveryDrone,
  };

  const littleFileStyle = {
    [serviceTypes.pickUp]: 'lottiePickup',
    [serviceTypes.delivery]: 'lottieDelivery',
  };

  return (
    hasError === '' &&
    orderEta && (
      <View style={styles.container}>
        <View style={styles.lottieContainer}>
          {littleFile[serviceType] && (
            <Lottie
              source={littleFile[serviceType]}
              autoPlay
              loop
              style={styles[littleFileStyle[serviceType]]}
            />
          )}
        </View>
        {loading ? null : (
          <RText>
            {' '}
            {serviceType === 'Delivery'
              ? 'Deliver in '
              : 'Preparation time '}{' '}
            {orderEta.min}{' '}
            {orderEta.max > orderEta.min ? '- ' + orderEta.max + ' min' : 'min'}
          </RText>
        )}
      </View>
    )
  );
};

export default EstimatedTime;
