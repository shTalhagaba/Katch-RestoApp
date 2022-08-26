//react
import React, { memo, useContext } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Context } from '../../context/cart';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

//others
import GS, {
  RText,
  normalizedFontSize,
  customFont,
  TextBasic,
} from '../../GlobeStyle';

const Menu = ({ menuTransformY, menu, setShowMenu, showMenu }) => {
  const context = useContext(Context);
  return (
    <Animated.View
      style={[
        style.wrapper,
        {
          transform: [{ translateY: menuTransformY }],
        },
      ]}>
      <TouchableWithoutFeedback onPress={() => setShowMenu(!showMenu)}>
        <View style={style.flex} />
      </TouchableWithoutFeedback>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.pv8}
        style={style.scrollView}>
        {menu.map((category, index) => {
          return (
            <TouchableOpacity
              key={category.title + index}
              onPress={() => {
                setShowMenu(!showMenu);
                context.actions.scrollTo(category.title);
              }}
              style={style.touch}>
              <RText style={style.categoryText}>{category.title}</RText>
              <RText style={style.length}>{category.length}</RText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default memo(Menu);

export const MenuButton = ({ menuTransformY, showMenu, setShowMenu, goToCartVisible }) => (
  <Animated.View
    style={[
      style.menuButtonContainer,
      {
        transform: [{ translateY: menuTransformY }],
        bottom: goToCartVisible ? 55 : 10,
      },
    ]}>
    <TouchableOpacity
      onPress={() => setShowMenu(!showMenu)}
      style={style.menuButton}>
      {!showMenu ? (
        <MCIcon name="menu" color="#fff" size={15} />
      ) : (
        <MCIcon name="close" color="#fff" size={15} />
      )}

      <TextBasic style={style.menuText}>
        {showMenu ? 'Close' : 'Categories'}
      </TextBasic>
    </TouchableOpacity>
  </Animated.View>
);

const style = StyleSheet.create({
  menuButtonContainer: {
    position: 'absolute',
    height: 30,
    width: 160,
    borderRadius: 20,
    backgroundColor: GS.menuButtonColor,
    overflow: 'hidden',
    alignSelf: 'center',
    zIndex: 2,
    marginBottom: Platform.OS === 'android' ? undefined : 5,
  },
  menuButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: normalizedFontSize(8.632),
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 15,
    fontFamily: customFont.axiformaMedium,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#00000020',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  pv8: {
    paddingVertical: 8,
  },
  flex: { flex: 1 },
  scrollView: {
    position: 'absolute',
    maxHeight: 300,
    bottom: 50,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: GS.primaryColor,
    overflow: 'hidden',
    zIndex: 2,
  },
  touch: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'flex-start',
    minWidth: 250,
    flexDirection: 'row',
  },
  categoryText: { color: 'gray', fontSize: 14, maxWidth: 200 },
  length: { color: 'gray', fontSize: 14, marginLeft: 'auto' },
});
