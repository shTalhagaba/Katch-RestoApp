import React, { useCallback, useEffect } from 'react';
import { Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import {
  SLIDER_OFF_2,
  SLIDER_ON_2,
} from '../../assets/images';
import { setSelectedService as _setSelectedService } from '../../components/Redux/Actions/userActions';
import { RText } from '../../GlobeStyle';
import styles from './styles';

const SearchDelivery = ({
  selectedService,
  searchQuery,
  setSearchQuery,
  commenceSearch,
}) => {
  useEffect(() => {
    // if selected Service is Delivery add Delivery to Search
    if (selectedService && selectedService === 'Delivery') {
      deliveryOn();
    } else {
      deliveryOff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService]);

  const isDeliverySelected = useCallback(() => {
    if (searchQuery.filter.length === 0) {
      return false;
    }
    let f = false;
    searchQuery.filter.forEach((filter) => {
      if (filter.type === 'services') {
        f = filter.values.indexOf('Delivery') !== -1;
      }
    });
    return f;
  }, [searchQuery]);

  const deliveryOn = () => {
    const _temp = JSON.parse(JSON.stringify(searchQuery));
    let found = false;
    _temp.filter = _temp.filter.map((
      /** @type {{ type: string; values: string[]; }} */ x,
    ) => {
      if (x.type === 'services') {
        x.values.push('Delivery');
        x.values = Array.from(new Set(x.values));
        found = true;
      }
      return x;
    });
    if (!found) {
      _temp.filter.push({
        type: 'services',
        values: ['Delivery'],
      });
    }
    commenceSearch(_temp);
    setSearchQuery(_temp);
  };

  const deliveryOff = () => {
    const _temp = JSON.parse(JSON.stringify(searchQuery));
    _temp.filter = _temp.filter
      .map((/** @type {{ type: string; values: string[]; }} */ x) => {
        if (x.type === 'services') {
          const index = x.values.indexOf('Delivery');
          if (index > -1) {
            x.values.splice(index, 1);
          }
          if (x.values.length === 0) {
            return false;
          }
        }
        return x;
      })
      .filter((x) => x);
    commenceSearch(_temp);
    setSearchQuery(_temp);
  };

  const changeService = () => {
    !isDeliverySelected() ? deliveryOn() : deliveryOff();
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={changeService}
        style={styles.clickable}
        activeOpacity={1}>
        <RText style={styles.text}>Delivery Only</RText>
        <Image
          source={isDeliverySelected() ? SLIDER_ON_2 : SLIDER_OFF_2}
          style={styles.toggleImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedService: state.user.selectedService,
  };
};

export default connect(mapStateToProps, (dispatch) => {
  return {
    setSelectedService: (payload) => {
      dispatch(_setSelectedService(payload));
    },
  };
})(SearchDelivery);
