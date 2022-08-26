import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { connect } from 'react-redux';
//3rd party

//others
import GS from '../../GlobeStyle';

const LandingReferralBanner = (props) => {
  const { navigation, marketingData, image } = props;
  const isActive = marketingData?.referrals?.active;
  if (!isActive) return null;
  const bannerImage = marketingData.referrals.banner;
  return image && bannerImage ? (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          navigation.navigate('Account', {
            accountContent: 'referralCode',
          });
        }}>
        <Image
          source={{ uri: bannerImage }}
          style={styles.bannerStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    overflow: 'hidden',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    marginHorizontal: 5,
  },
  bannerStyle: {
    width: '100%',
    minHeight: 120,
    aspectRatio: 2.7709,
    resizeMode: 'contain',
  },
  loading: {
    width: '95%',
    height: 125,
    borderRadius: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: GS.placeHolderColor,
  },
});

const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(memo(LandingReferralBanner));
