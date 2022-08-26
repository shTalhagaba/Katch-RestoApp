/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

//3rd party
import auth from '@react-native-firebase/auth';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/Feather';
import ADIcon from 'react-native-vector-icons/AntDesign';
import IIcons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
//others
import GS, {
  RText,
  BoldText,
  normalizedFontSize,
  customFont,
  priceSymbol,
} from '../../GlobeStyle';
import { analyticsOnSignOut } from '../../components/AppReporting';
import { ADDRESS, COUPON_ICON, REVIEW, WALLET_ICON } from '../../assets/images';
import {
  hydrateUserWallet,
  resetUserState,
} from '../../components/Redux/Actions/userActions';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_USER_WALLET } from '../../components/GraphQL';

const AccountSettings = ({
  setRoute,
  navigation,
  tabProps,
  wallet,
  hydrateWallet: updateWallet,
  ...props
}) => {
  const _onSignOut = async () => {
    tabProps.navigation.navigate('Home');
    props.resetUserState({
      selectedAddress: null,
      selectedService: null,
      addresses: null,
    });
    await analyticsOnSignOut();
    await auth().signOut();
  };

  const [getUserWallet] = useLazyQuery(GET_USER_WALLET, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      updateWallet(data);
    },
    onError: () => {
      updateWallet({ wallet: { walletTotal: '0.000' } });
    },
  });

  useEffect(() => {
    getUserWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <BoldText style={{ fontSize: 15, color: 'gray' }}>
        ACCOUNT SETTINGS
      </BoldText>
      <View
        style={{
          borderWidth: 0.3,
          borderColor: 'gray',
          width: '100%',
          marginVertical: 20,
          backgroundColor: '#fff',
          borderRadius: 10,
          overflow: 'hidden',
          shadowColor: '#000',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserReviews')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <Image source={REVIEW} style={{ height: 20, width: 20 }} />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            My Reviews
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Bookmarks')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <IIcons name="md-bookmarks-outline" size={20} color="#1B9C38" />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            Bookmarks
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Wallet')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <Image
            source={WALLET_ICON}
            style={{ height: 20, width: 20, resizeMode: 'contain' }}
          />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            My Wallet
          </RText>
          {wallet && wallet.wallet && (
            <RText
              style={{
                fontSize: normalizedFontSize(8),
                fontFamily: customFont.axiformaSemiBold,
                color: GS.textColorGreen,
                paddingRight: 10,
              }}>
              {wallet?.wallet?.walletTotal} {priceSymbol}
            </RText>
          )}
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserCoupons')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <Image source={COUPON_ICON} style={{ height: 20, width: 20 }} />

          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            My Coupons
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserAddress')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <Image source={ADDRESS} style={{ height: 20, width: 20 }} />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            My Addresses
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRoute('editAccountInfo')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <ADIcon name="profile" size={20} color="#1B9C38" />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            Update My Details
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRoute('changePassword')}
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
            marginBottom: 1,
          }}>
          <FIcon name="lock" size={20} color="#1B9C38" />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            Change Password
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_onSignOut}
          style={{
            borderColor: 'gray',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            flexDirection: 'row',
          }}>
          <ADIcon name="logout" size={20} color="#1B9C38" />
          <RText style={{ marginRight: 'auto', marginLeft: 10, fontSize: 14 }}>
            Logout
          </RText>
          <MIIcon name="chevron-right" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapDispatchToProp = (dispatch) => {
  return {
    resetUserState: (payload) => dispatch(resetUserState(payload)),
    hydrateWallet: (payload) => dispatch(hydrateUserWallet(payload)),
  };
};

const mapStateToProps = (state) => {
  return {
    wallet: state.user.wallet,
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AccountSettings);
