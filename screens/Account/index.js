import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import Lottie from 'lottie-react-native';

//others
import GS, { BoldText, normalizedFontSize, RText } from '../../GlobeStyle';
import EditAccountInfo from '../../containers/AccountEditInfo';
import ChangePassword from '../../containers/AccountChangePassword';
import ShareReferralModal from '../../containers/ShareReferralModal';
import SelectLangModal from '../../containers/SelectLangModal';
import OrdersList from '../../containers/AccountOrdersList';
import UserInfo from '../../containers/UserInfo';
import AccountSettings from '../../containers/AccountSettings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GREEN_WHATSAPP, REFERRAL_ICON } from '../../assets/images';
import { connect } from 'react-redux';
import { ReviewStar } from '../../assets/Lottie';
import { goToWhatsapp } from '../../components/Helpers';

const Account = ({ navigation, tabProps, marketingData }) => {
  const { setScreen } = tabProps;
  if (auth().currentUser) {
    const [route, setRoute] = useState('');
    const [showThanksMessage, setShowThanksMessage] = useState(false);
    const contact = marketingData.orderSupport.whatsAppContact;
    const toggleThankMessage = () => {
      setShowThanksMessage(!showThanksMessage);
    }
    useEffect(() => {
      let timer = null;
      if (tabProps.routeParams?.accountContent === 'referralCode') {
        timer = setTimeout(() => {
          setRoute(tabProps.routeParams.accountContent);
        }, 500);
      }
      return () => {
        timer && clearTimeout(timer);
        tabProps.navigation.setParams({ accountContent: null });
      };
    }, [tabProps.routeParams?.accountContent]);

    const routeNameEqualTo = (routeName) => route === routeName;
    const insets = useSafeAreaInsets();
    const statusBarHeight =
      Platform.OS !== 'ios'
        ? Math.ceil(StatusBar.currentHeight)
        : insets.top < 1
        ? 20
        : insets.top;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: GS.secondaryColor,
          paddingTop: statusBarHeight,
        }}>
        <UserInfo navigation={navigation} />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: GS.secondaryColor,
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{}}
            contentContainerStyle={{
              backgroundColor: '#fff',
              paddingHorizontal: 25,
              paddingTop: 25,
              flexGrow: 1,
            }}>
            {/* share modal */}
            <ReferralCode setRoute={setRoute} marketingData={marketingData} />
            {!!contact && <ContactSupport contact={contact} />}
            <OrdersList navigation={navigation} tabProps={tabProps} />
            <AccountSettings
              setRoute={setRoute}
              navigation={navigation}
              tabProps={tabProps}
            />
          </ScrollView>

          {routeNameEqualTo('referralCode') ? (
            <ShareReferralModal
              toggleThankMessage={toggleThankMessage}
              goBack={() => setRoute('')}
              showModal={route === 'referralCode'}
            />
          ) : (
            <Modal
              animationType="slide"
              transparent={true}
              visible={route !== ''}
              onRequestClose={() => setRoute('')}>
              {routeNameEqualTo('editAccountInfo') && (
                <EditAccountInfo
                  navigation={navigation}
                  goBack={() => setRoute('')}
                />
              )}
              {routeNameEqualTo('changePassword') && (
                <ChangePassword goBack={() => setRoute('')} />
              )}
            </Modal>
          )}
          {marketingData &&
            marketingData.referrals &&
            marketingData.referrals.active && (
              <SelectLangModal setRoute={setRoute} />
            )}
        </View>
        {showThanksMessage && marketingData?.referrals?.active && <ThanksPopUp message={marketingData?.referrals?.thankMessage} toggle={toggleThankMessage}/>}
      </SafeAreaView>
    );
  } else {
    setScreen('Login');
    return null;
  }
};

const ThanksPopUp = (props) => {
  const { message, toggle } = props;
  return (message ?
    <View style={styles.thanksContainer}>
      <View style={styles.thanksContainerInner}>
        <View
          style={{
            height: 'auto',
            overflow: 'hidden',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ height: 200 }}>
            <Lottie
              autoPlay={true}
              loop={false}
              source={ReviewStar}
              style={{ height: 200, width: 400 }}
              resizeMode="cover"
            />
          </View>
          <BoldText style={styles.thankTitle}>Thank you for sharing</BoldText>
          <RText style={styles.thankBody}>{message}</RText>
        </View>
        <TouchableOpacity style={styles.thankOkButton} onPress={toggle}>
          <RText style={styles.thankOkButtonText}>OK</RText>
        </TouchableOpacity>
      </View>
    </View> : null
  );
};

const ReferralCode = (props) => {
  const { setRoute, marketingData } = props;
  return (
    <View style={styles.referralCodeContainer}>
      <TouchableOpacity
        onPress={() => setRoute('referralCode')}
        style={styles.referralCodeButton}>
        <Image source={REFERRAL_ICON} style={{ height: 20, width: 20 }} />
        <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
          {marketingData?.referrals?.active
            ? 'Refer & Win Free Tickets for “RRR”'
            : 'Referral Code'}
        </RText>
        <MIIcon name="chevron-right" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const ContactSupport = ({ contact }) => {
  return (
    <View style={[styles.referralCodeContainer, { marginBottom: 20 }]}>
      <TouchableOpacity
        onPress={() => goToWhatsapp(contact)}
        style={styles.referralCodeButton}>
        <Image source={GREEN_WHATSAPP} style={styles.whatsappIcon} />
        <RText style={styles.contactSupport}>Contact Support</RText>
        <MIIcon name="chevron-right" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  referralCodeContainer: {
    borderWidth: 0.3,
    borderColor: 'gray',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
  },
  referralCodeButton: {
    borderColor: 'gray',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 1,
  },
  thanksContainer: {
    backgroundColor: '#00000020',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  thanksContainerInner: {
    minHeight: 100,
    minWidth: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  thankTitle: {
    fontSize: normalizedFontSize(10),
  },
  thankBody: {
    fontSize: normalizedFontSize(7),
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 20,
  },
  thankOkButton: {
    backgroundColor: GS.logoGreen,
    minWidth: '100%',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  thankOkButtonText: {
    color: '#fff',
    fontSize: normalizedFontSize(10),
  },
  contactSupport: { marginRight: 'auto', marginLeft: 10, fontSize: 14 },
  whatsappIcon: { height: 20, width: 20 },
});
const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};
export default connect(mapStateToProps, null)(Account);
