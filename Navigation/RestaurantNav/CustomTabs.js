import React from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import GS, {normalizedFontSize, BoldText} from '../../GlobeStyle';

const TabContent = ({state, descriptors, navigation, ...props}) => {
  const [Home, Reviews, Info, Gallery] = state.routes;

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const content = [Home, Reviews, Info, Gallery].map((route, index) => {
    const {options} = descriptors[route.key];

    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
        key={`${route.name}${index}`}
        disabled={isFocused}
        onPress={onPress}>
        <View
          style={
            isFocused ? style.placeHolderSelected : style.placeHolderNotSelected
          }
        />
        <View style={style.tabsStyle}>
          <BoldText
            style={
              isFocused ? style.tabsTextSelected : style.tabsTextNotSelected
            }>
            {label}
          </BoldText>
        </View>
      </TouchableOpacity>
    );
  });

  return <View style={style.tabBarStyle}>{content}</View>;
};

const style = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
  },
  tabsStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    minHeight: Platform.OS === 'android' ? 40 : 60,
  },
  tabsTextSelected: {
    color: '#333',
    fontSize: normalizedFontSize(6),
    paddingBottom: Platform.OS === 'android' ? undefined : 10,
  },
  tabsTextNotSelected: {
    color: '#666',
    fontSize: normalizedFontSize(6),
    paddingBottom: Platform.OS === 'android' ? undefined : 10,
  },
  placeHolderSelected: {
    backgroundColor: '#000',
    height: 4,
    width: '100%',
  },
  placeHolderNotSelected: {
    backgroundColor: '#e6e6e6',
    height: 2,
    width: '100%',
  },
});

export default TabContent;
