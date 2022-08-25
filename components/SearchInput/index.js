import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { FILTER_ICON, SEARCH } from '../../assets/images/index';
import GS, { RText } from '../../GlobeStyle';
import style from './style';
const SearchInput = ({
  containerStyle = {},
  inputContainerStyle,
  inputStyle,
  navigation,
  onShowOption,
  inputValue,
  onChangeText,
  onKeyPress,
  onBack,
  ...props
}) => {
  return (
    <View style={[style.container, containerStyle]}>
      <View style={style.wrapper}>
        <Image source={SEARCH} style={style.image} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Search');
          }}
          style={style.inputBox}>
          <RText style={{ color: GS.textColorGreyDark3 }}>
            Search for restaurants, dishes...
          </RText>
        </TouchableOpacity>
      </View>
      <View style={{}}>
        <TouchableOpacity
          style={style.filterButton}
          onPress={() => {
            navigation.navigate('Search', {
              toggleSortFilter: true,
            });
          }}>
          <Image source={FILTER_ICON} style={style.filterIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchInput;
