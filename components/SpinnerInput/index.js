/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import FAIcon from 'react-native-vector-icons/Feather';
import GS, {
  customFont,
  normalizedFontSize,
  priceSymbol,
  TextBasic,
} from '../../GlobeStyle';

const SpinnerInput = (props) => {
  const {
    onMinus,
    onPlus,
    value = 0,
    price = false,
    onDisplayRow = true,
  } = props;

  const getPrice = (_price) => {
    return typeof _price === 'number' ? _price.toFixed(3) : _price;
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: onDisplayRow ? 'center' : 'flex-end',
      }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'silver',
          flexDirection: 'row',
          borderRadius: 7,
          minHeight: 30,
          minWidth: 73,
        }}>
        <TouchableOpacity
          style={{ justifyContent: 'center', paddingHorizontal: 3 }}
          onPress={onMinus}>
          <FAIcon name="minus" size={14} color={GS.textColorBlue} />
        </TouchableOpacity>
        <TextInput
          allowFontScaling={false}
          editable={false}
          value={`${value}`}
          style={{
            color: GS.textColorBlue,
            textAlign: 'center',
            textAlignVertical: 'center',
            flex: 1,
            borderRightWidth: 0.5,
            borderLeftWidth: 0.5,
            borderColor: 'silver',
            padding: 0,
            margin: 0,
          }}
        />
        <TouchableOpacity
          style={{ justifyContent: 'center', paddingHorizontal: 3 }}
          onPress={onPlus}>
          <FAIcon name="plus" size={14} color={GS.textColorBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpinnerInput;
