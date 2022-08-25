import React, { useState, useEffect, memo, Fragment } from 'react';
import {
  View,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
  Platform,
  Linking,
  Image,
} from 'react-native';

//3rd party
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";

//others
import ClipBoard from '@react-native-community/clipboard';
import GS, { RText, BoldText, normalizedFontSize } from '../../GlobeStyle';
import { FACEBOOK, WHATSAPP, COPY_URL } from '../../assets/images';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_USER_REFERRAL_CODE } from '../../components/GraphQL/User/queries';
import FIcon from 'react-native-vector-icons/Feather';
import EditRefCodeDialog from '../../containers/EditRefCodeDialog';
import Loading from '../../components/Loading/More';
import { connect } from 'react-redux';

const ShareReferral = (props) => {
  const { goBack, showModal, marketingData, toggleThankMessage } = props;
  const url = 'app.katchkw.com';
  const isActive = marketingData?.referrals?.active;
  const referralShareImage = marketingData?.referrals?.shareImage;
  const shareText = marketingData?.referrals?.shareText;
  const shareMessage = marketingData?.referrals?.shareMessage;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [referralCode, setReferralCode] = useState(null);

  const createShareMessage = (refCode, url, remove = false) => {
    const message = [];

    if (isActive) {
      message.push(`Referral Code: ${refCode}`);
      message.push(`\n\n`);
      if (shareText) {
        message.push(shareText);
      }

      message.push(`\n\nDownload Katch: ${url}`);
      message.push(`\n\n`);
      return message.join('');
    } else {
      message.push(`Referral Code: ${refCode}`);
      message.push(`\n\n`);
      message.push(`Download Katch: ${url}`);
      message.push(`\n\n`);
      return message.join('');
    }
  };

  const [getRefCode] = useLazyQuery(GET_USER_REFERRAL_CODE, {
    fetchPolicy: 'network-only',
    onCompleted: (rawData) => {
      if (rawData) {
        const data = rawData.getUserReferralCode;
        if (data) {
          setReferralCode(data.referralCode);
        }
      }
    },
  });

  useEffect(() => {
    getRefCode();
  }, []);

  const [icons, setIcons] = useState([
    {
      image: COPY_URL,
      onPress: (refCode) => {
        let message = createShareMessage(refCode, url);
        if (isActive) {
          message = `${referralShareImage}\n\n\n ${message}`;
        }
        ClipBoard.setString(message);
        Toast.show('Copied to Clipboard');
        goBack();
        if(isActive){
          toggleThankMessage()
        }
      },
      name: 'Copy Text',
    },
    {
      image: FACEBOOK,
      onPress: (refCode) => {
        let message = createShareMessage(refCode, url, true);
        share({ social: Share.Social.FACEBOOK }, message);
        if(isActive){
          toggleThankMessage()
        }
      },
      name: 'Facebook',
    },
  ]);

  const share = async (options, message) => {
    const shareOptions = {
      message,
    };
    try {
      if (options?.social === Share.Social.FACEBOOK) {
        let url = `https://www.facebook.com/sharer/sharer.php?quote=${shareOptions.message}&u=${ isActive ?  referralShareImage : 'https://katchkw.com/'}`;

        await Linking.openURL(encodeURI(url));
      } else if (options.social) {
        if(isActive){
          const base64 = await RNFetchBlob.config({
            fileCache: true
          })
          .fetch("GET", referralShareImage)
          .then(resp => {
            return resp.readFile("base64");
          }).catch(_ => null) ;
          
          if(base64){
            shareOptions.url = `data:image/jpeg;base64,${base64}`;
          } else {
            shareOptions.url = referralShareImage
          }
        }
       
          await Share.shareSingle({
            ...shareOptions,
            ...options,
            message,
          });
      }
      goBack();
      if(isActive){
        toggleThankMessage()
      }
    } catch (error) {
      goBack();
    }
  };
  const addWhatsAppToState = (isInstalled) => {
    if (isInstalled) {
      setIcons((state) => {
        state.push({
          image: WHATSAPP,
          onPress: (refCode) => {
            let message = createShareMessage(refCode, url);
            if (Platform.OS === 'android') {
              share({ social: Share.Social.WHATSAPP,  }, message);
            } else {
              if (isActive) {
                message = `${referralShareImage}\n\n\n ${message}`;
              }
              Linking.openURL(
                `whatsapp://send?text=${message}&url=${referralShareImage}`,
              ).catch((_) => {});
              if(isActive){
                toggleThankMessage()
              }
              goBack();
            }
          },
          name: 'WhatsApp',
        });
        return state;
      });
    }
  };

  useEffect(() => {
    const handleBackButton = () => {
      goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  });

  useEffect(() => {
    try {
      if (Platform.OS === 'android') {
        Share.isPackageInstalled('com.whatsapp').then(({ isInstalled }) =>
          addWhatsAppToState(isInstalled),
        );
      } else {
        Linking.canOpenURL('whatsapp://send').then((isInstalled) =>
          addWhatsAppToState(isInstalled),
        );
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderIcons = icons.map((item) => {
    return (referralCode !== null ?
      <TouchableOpacity
        disabled={referralCode === null}
        style={styles.iconsButton}
        key={item.name}
        onPress={() => item.onPress(referralCode)}>
        <Image
          source={item.image}
          style={styles.socialMediaIcons}
          resizeMode="contain"
        />
        <RText style={styles.iconsText}>{item.name}</RText>
      </TouchableOpacity> : null
    );
  });

  const toggleEditDialog = () => {
    setShowEditDialog(!showEditDialog);
  };

  const setRefCode = (code) => {
    setReferralCode(code);
  };

  return (
    <Fragment>
      <Modal
        onDismiss={goBack}
        isVisible={showModal}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropOpacity={0.5}
        onBackdropPress={goBack}
        statusBarTranslucent={true}
        style={styles.modalStyle}>
        {showEditDialog && (
          <EditRefCodeDialog
            toggleEditDialog={toggleEditDialog}
            referralCode={referralCode}
            setRefCode={setRefCode}
          />
        )}
        {isActive && (
          <Image source={{ uri: referralShareImage }} style={styles.image} />
        )}

        <View
          style={[
            styles.modalContainer,
            isActive ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {},
          ]}>
          <View style={styles.contentHeader}>
            <RText style={styles.headerText}>
              {isActive ? 'SHARE & WIN' : 'Invite to Katch!'}
            </RText>
          </View>
          {referralCode ? (
            <View style={styles.bodyTextContainer}>
              <BoldText style={styles.bodyText}>{referralCode}</BoldText>
              <TouchableOpacity
                style={styles.editIconButton}
                onPress={toggleEditDialog}>
                <FIcon
                  name="edit-3"
                  color={GS.secondaryColor}
                  size={25}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Loading style={styles.loading} />
          )}
          <View style={styles.contentBody}>{renderIcons}</View>

          {isActive && (
            <Fragment>
             <RText style={styles.bottomText}>
                 {shareMessage}
                </RText>
            </Fragment>
          )}

          <View style={styles.contentFooter}>
            <TouchableOpacity onPress={goBack}>
              <RText style={styles.cancelButtonText}>Cancel</RText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};
export default connect(mapStateToProps, null)(memo(ShareReferral));

const styles = StyleSheet.create({
  image: {
    width: '100%',
    resizeMode: 'cover',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalStyle: {
    padding: 0,
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 30,
  },
  contentHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  headerText: {
    fontSize: normalizedFontSize(10),
    color: GS.greyColor,
  },
  bodyText: {
    fontSize: normalizedFontSize(12),
    paddingVertical: 25,
  },
  bodyTextContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsButton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialMediaIcons: {
    height: 65,
    width: 65,
  },
  iconsText: {
    color: GS.lightGrey,
    fontSize: normalizedFontSize(5.5),
    marginTop: 10,
  },
  contentFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    borderTopWidth: 1,
    borderColor: GS.greyColor,
    paddingVertical: 20,
  },
  cancelButtonText: {
    fontSize: normalizedFontSize(10),
    color: GS.greyColor,
  },
  editIconButton: {
    position: 'absolute',
    right: 10,
  },
  editIcon: {},
  loading: {
    justifyContent: 'center',
    marginVertical: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomText: {
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 15,
    fontSize: normalizedFontSize(7),
    color: GS.greyColor,
  },
});
