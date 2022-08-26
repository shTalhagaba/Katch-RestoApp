import React, { useContext } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

//others
import GS, {
  normalizedFontSize,
  customFont,
  TextBasic,
} from '../../GlobeStyle';
import LinearGradient from 'react-native-linear-gradient';
import { isValidPromo } from '../../components/Helpers';
import { Context } from '../../context/restaurant';

const RestPromoList = (props) => {
  const { showNotUseable = true, promoCodes, showCode } = props;
  const context = useContext(Context);
  const toggle = (index) =>
    context.actions.togglePromoCodeModal(promoCodes[index]);

  return promoCodes.length > 0 ? (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      bounces={false}
      style={{ backgroundColor: '#fff' }}
      data={promoCodes.filter(isValidPromo)} //Filter invalid promos
      renderItem={(props) => (
        <Item
          {...props}
          showCode={showCode}
          showNotUseable={showNotUseable}
          toggleModal={toggle}
        />
      )}
      keyExtractor={(item) => item._id}
    />
  ) : null;
};

const Item = ({
  item,
  showNotUseable,
  toggleModal,
  showCode = true,
  ...props
}) => {
  //Return null if promo type value is zero or null or no code
  if (!item || !item.type || !item.type.value) {
    return null;
  }

  if (!showNotUseable && item.code === '') {
    return null;
  }

  const flatOrDiscount = item.type.name === 'Flat';

  const value = `${flatOrDiscount ? 'GET ' : ''}${item.type.value}${
    flatOrDiscount ? ' KD' : '%'
  }`;

  const presetColors = [
    '#3f76bb',
    '#16B8FF',
    '#16B8FF',
    '#16B8FF',
    '#16B8FF',
    '#fff',
  ];

  return (
    <TouchableWithoutFeedback onPress={() => toggleModal(props.index)}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1.5, y: 0 }}
        colors={presetColors}
        style={{
          marginBottom: 10,
          marginTop: 5,
          marginLeft: props.index === 0 ? 20 : 0,
          marginRight: 10,
          paddingVertical: 7,
          paddingHorizontal: 15,
          borderRadius: 8,
          minWidth: 160,
          justifyContent: 'center',
          alignItems: !showNotUseable ? 'center' : 'baseline',
          overflow: 'hidden',
        }}>
        <View style={{ zIndex: 20 }}>
          <TextBasic
            style={{
              color: '#fff',
              marginBottom: 2,
              fontSize: normalizedFontSize(6.5),
              fontFamily: customFont.axiformaBold,
            }}>
            {value.toUpperCase()} {item.cashback ? 'Cash Back' : 'OFF'}
          </TextBasic>
          {showCode ? (
            <TextBasic
              style={{
                color: '#fff',
                fontSize: normalizedFontSize(5.354),
                fontFamily: customFont.axiformRegular,
              }}>
              Use Code {item.code}
            </TextBasic>
          ) : null}
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default RestPromoList;
