import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import AddressDirectionCard from '../AddressDirectionCard';
import AddressSection from './AddressSection';
import styles from './styles';
import DistanceCard from '../../screens/checkout/Distance';

const AddressCardCheckout = ({ navigation, ...props }) => {
  const {
    changeAddress,
    address,
    sourceAddress,
    destinationAddress,
    addressDeliverable,
    distanceLimit,
    userDistance,
  } = props;
  return (
    <View style={styles.addressWrapper}>
      <AddressDirectionCard
        sourceAddress={sourceAddress}
        destinationAddress={destinationAddress}
      />
      <DistanceCard
        source={sourceAddress}
        destination={destinationAddress}
        distanceLimit={distanceLimit}
        validDistance={addressDeliverable}
        userDistance={userDistance}
      />
      <AddressSection address={address} changeAddress={changeAddress} />
    </View>
  );
};

const mapStateToProps = (/** @type {{ user: any; }} */ state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AddressCardCheckout);
