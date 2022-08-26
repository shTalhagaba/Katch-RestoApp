import React, { memo } from 'react';
import {
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';

//3rd party
import Animated, { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IOIcon from 'react-native-vector-icons/Ionicons';

//others
import GS, { RText } from '../../GlobeStyle';
import { FILTER_ICON, SEARCH_SELECTED } from '../../assets/images';
import Icon from '../../components/Icon';

const SearchHeader = (props) => {
  const {
    animatedResearch,
    animated,
    refreshLocations,
    onBack,
    onFilterClicked,
    navigation,
    debounce,
  } = props;

  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;

  const showHeight =
    Platform.OS !== 'ios' ? StatusBar.currentHeight + 50 : insets.top + 50;

  const ResearchY = animatedResearch.interpolate({
    inputRange: [0, 1],
    outputRange: [statusBarHeight, showHeight],
  });

  const ResearchOpacity = animatedResearch.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const onSearchArea = () => {
    refreshLocations();
    Animated.timing(animatedResearch, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
    }).start();

    Animated.timing(animated, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
    }).start();
  };
  return (
    <>
      <View style={[styles.headerContainer, { top: statusBarHeight }]}>
        <View
          style={[
            styles.headerInnerContainer,styles.lightBorder
          ]}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={onBack}
              style={[styles.backButton, styles.lightBorder]}>
              <IOIcon
                name="md-arrow-back"
                size={30}
                color={GS.secondaryColor}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.searchPlaceHolderContainer,styles.lightBorder
            ]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Search');
              }}
              style={styles.searchPlaceHolderButton}>
              <Icon source={SEARCH_SELECTED} style={styles.searchIcon} />
              <View style={styles.searchPlaceHolderText}>
                <RText>Search</RText>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              onPress={onFilterClicked}
              style={[
                styles.filterButton, styles.lightBorder
              ]}>
              <Icon source={FILTER_ICON} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Animated.View
        style={[
          styles.searchAreaContainer,
          {
            transform: [
              {
                translateY: ResearchY,
              },
            ],
            opacity: ResearchOpacity,
          },
        ]}>
        <TouchableOpacity
          onPress={onSearchArea}
          style={styles.searchAreaButton}>
          <RText>Search this area</RText>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default memo(SearchHeader);

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPlaceHolderContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchPlaceHolderButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  searchIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  searchPlaceHolderText: {
    color: '#000',
    flex: 1,
    paddingVertical: 8,
    maxHeight: 45,
    marginLeft: 10,
  },
  backButtonContainer: {
    flex: 0.2,
    alignItems: 'flex-start',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 7,
    borderRadius: 100,
    backgroundColor: '#fff',
    height: 45,
    width: 45,
  },
  filterContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  filterIcon: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  searchAreaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: 'absolute',
    height: 80,
    top: 0,
    zIndex: 1,
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchAreaButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: GS.primaryColor,
    borderWidth: 0.1,
    borderColor: GS.lightGrey2,
  },
  lightBorder: {
    borderWidth: 0.1,
    borderColor: GS.lightGrey2,
  },
});
