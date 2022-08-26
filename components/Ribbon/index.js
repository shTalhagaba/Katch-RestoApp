//react
import React, { memo } from 'react';
import { View } from 'react-native';
import { isValidPromo } from '../../components/Helpers';

//3rd party

//others
import GS, { BoldText } from '../../GlobeStyle';

const Ribbon = ({ promos }) => {
  if (!promos) {
    return null;
  }
  const filteredPromos = promos.filter(isValidPromo);
  const maxPromos =
    filteredPromos.length > 2 ? filteredPromos.splice(0, 2) : filteredPromos;
  return (
    <View
      style={{
        zIndex: 2,
        position: 'absolute',
        left: 0,
        bottom: 5,
      }}>
      <View style={{ flexDirection: 'row' }}>
        {maxPromos.map((promo, index) => (
          <RibbonItems key={promo._id + index} promo={promo} index={index} />
        ))}
      </View>
    </View>
  );
};

const RibbonItems = ({ promo, index }) => {
  const flatOrDiscount = promo.type.name === 'Flat';
  const title = `${parseFloat(promo.type.value)}${
    flatOrDiscount ? ' KD' : '%'
  } ${promo.cashback ? 'Cash Back' : 'OFF'}`;

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        borderTopLeftRadius: index > 0 ? 3 : 0,
        borderBottomLeftRadius: index > 0 ? 3 : 0,
        overflow: 'hidden',
        marginLeft: index > 0 ? 10 : 0,
        paddingVertical: 5,
        backgroundColor: '#16b8ff',
      }}>
      <BoldText style={{ color: '#fff', paddingHorizontal: 10, fontSize: 12 }}>
        {title}
      </BoldText>
    </View>
  );
};

export default memo(Ribbon);
