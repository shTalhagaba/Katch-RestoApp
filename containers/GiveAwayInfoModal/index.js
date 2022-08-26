import React, { memo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  RRR_GIVEAWAY_BACKGROUND,
  RRR_GIVEAWAY_BUTTON,
} from '../../assets/images';
import { RText } from '../../GlobeStyle';
import styles from './styles';
import ADIcon from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

const GiveAwayInfoModal = (props) => {
  const {
    giveAwayModal,
    setGiveAwayModal,
    referralLogin,
    isLoggedIn,
    marketingData,
  } = props;
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const foregroundImage = marketingData?.referrals?.foregroundImage;
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Modal
      isVisible={giveAwayModal ? giveAwayModal : false}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      animationInTiming={1}
      style={styles.container}
      statusBarTranslucent={true}>
      <ImageBackground
        source={RRR_GIVEAWAY_BACKGROUND}
        style={styles.detailsContainer}>
        <View
          style={[
            styles.closeButtonContainer,
            { top: statusBarHeight, right: 20 },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setGiveAwayModal(false);
            }}>
            <ADIcon color="white" name="close" size={20} />
          </TouchableOpacity>
        </View>
        <ImageBackground
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={() => {
            setImageLoaded(true);
          }}
          source={{uri: foregroundImage}}
          style={styles.detailsBanner}
          resizeMode="contain">
          {!imageLoaded && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#594b3e" />
            </View>
          )}
          <TouchableOpacity onPress={referralLogin} style={[styles.button]}>
            <ImageBackground
              source={RRR_GIVEAWAY_BUTTON}
              style={{ height: 40, borderRadius: 20, overflow: 'hidden' }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  paddingHorizontal: 30,
                }}>
                <RText style={{ color: '#fff' }}>
                  {isLoggedIn ? 'CLAIM NOW' : 'Login / Signup'}
                </RText>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      </ImageBackground>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(memo(GiveAwayInfoModal));
