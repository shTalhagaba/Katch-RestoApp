import React, { memo, Fragment } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Dimensions,
} from 'react-native';
//3rd party

//others
import GS from '../../GlobeStyle';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const DoubleCard = (props) => {
  const { item, ...rest } = props;
  const cardStyle = {
    counterStyle: styles.doubleContainer,
    buttonStyle: styles.doubleButtonStyle,
    bannerStyle: styles.doubleBannerStyle,
  };
  return (
    <View style={styles.doubleCardContainer}>
      {item.map((x, i) => {
        return (
          <Fragment key={i}>
            <Card item={x} {...cardStyle} resizeMode="contain"/>
            {i === 0 && <View style={{ width: 10 }} />}
          </Fragment>
        );
      })}
    </View>
  );
};

const Card = (props) => {
  const {
    item,
    counterStyle,
    buttonStyle,
    bannerStyle,
    resizeMode = 'contain',
  } = props;
  const { image, navTo, navParams } = item;
  const navigation = useNavigation();
  return (
    <View style={counterStyle}>
      {image ? (
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => {
            try {
              if (navTo) navigation.navigate(navTo, navParams);
            } catch (error) {
              console.log('🚀 ~ ', { error });
            }
          }}>
          <Image
            source={{ uri: image }}
            style={bannerStyle}
            resizeMode={resizeMode}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.loading} />
      )}
    </View>
  );
};

const BannerCard = (props) => {
  if (Array.isArray(props.item)) {
    return <DoubleCard {...props} />;
  }
  return (
    <Card
      {...props}
      counterStyle={styles.container}
      buttonStyle={styles.buttonStyle}
      bannerStyle={styles.bannerStyle}
    />
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    overflow: 'hidden',
    borderRadius: 5,
    marginHorizontal: 5,
    maxHeight: 175,
    minHeight: 175,
  },
  buttonStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  bannerStyle: {
    width: '100%',
    minHeight: 120,
    aspectRatio: 2.7709,
    height: 175,
  },
  doubleContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 15,
    maxHeight: 175,
  },
  doubleButtonStyle: {
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  doubleBannerStyle: {
    width: '100%',
    // height: '100%',
    minHeight: 120,
    aspectRatio: 2.7709,
    height: 175,
  },
  loading: {
    width: '100%',
    height: 125,
    borderRadius: 0,
    backgroundColor: GS.placeHolderColor,
  },
  slideStyle: {
    marginBottom: 10,
  },
  inactiveIndicatorConfig: {
    transform: [{ scale: 0.6 }],
    color: GS.textColorGrey,
    margin: 3,
    opacity: 0.7,
  },
  activeIndicatorConfig: {
    color: GS.secondaryColor,
    margin: 3,
    opacity: 1,
  },
  dotsCarouselContainer: {
    width: screenWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 10,
  },
  doubleCardContainer: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});



export default memo(BannerCard);
