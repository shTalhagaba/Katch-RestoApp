/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import FAIcon from 'react-native-vector-icons/Feather';
import GS, { normalizedFontSize } from '../../GlobeStyle';

const SpinnerPriceInput = (props) => {
  const { onMinus, onPlus, value = 0, onDisplayRow = true } = props;

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
          backgroundColor: GS.logoGreen,
          borderColor: GS.logoGreen,
          flexDirection: 'row',
          borderRadius: 5,
          minHeight: 35,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: GS.logoGreen,
          }}
          onPress={onMinus}>
          <FAIcon name="minus" size={18} color={'#FFF'} />
        </TouchableOpacity>
        <TextInput
          allowFontScaling={false}
          editable={false}
          value={`${value}`}
          style={{
            color: GS.logoGreen,
            textAlign: 'center',
            textAlignVertical: 'center',
            // flex: 1,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            backgroundColor: '#fff',
            borderColor: GS.logoGreen,
            padding: 0,
            margin: 0,
            fontSize: normalizedFontSize(8),
            paddingHorizontal: 30,
          }}
        />
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: GS.logoGreen,
            overflow: 'hidden',
          }}
          onPress={onPlus}>
          <FAIcon name="plus" size={18} color={'#FFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpinnerPriceInput;
