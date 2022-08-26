import React, { useContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { TouchableOpacity, View, StyleSheet, Linking } from 'react-native';

//3rd party
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import ClipBoard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';

//others
import { FACEBOOK, TWITTER, WHATSAPP, COPY_URL } from '../../assets/images';
import GS, { normalizedFontSize, RText } from '../../GlobeStyle';
import { Context as restaurantContext } from '../../context/restaurant';
import { Platform } from 'react-native';

const ShareButton = (
  /** @type {{ showModal: Boolean, closeModal: VoidFunction, link?: String }} */ props,
) => {
  const context = useContext(restaurantContext);
  const storeId = context.state ? context.state.storeInfo._id : '';
  const socialId = context.state ? context.state.storeInfo.socialId : '';
  const { link } = props;
  const deepLink = link || `https://app.katchkw.com/${socialId || storeId}`;
  const shareOptions = {
    url: deepLink,
  };
  const [icons, setIcons] = useState([
    {
      image: COPY_URL,
      onPress: () => {
        closeModal();

        ClipBoard.setString(deepLink);
        Toast.show('Copied to Clipboard');
      },
      name: 'Copy url',
    },
    {
      image: FACEBOOK,
      onPress: () => {
        share({ social: Share.Social.FACEBOOK });
      },
      name: 'Facebook',
    },
    {
      image: TWITTER,
      onPress: () => {
        share({ social: Share.Social.TWITTER });
      },
      name: 'Twitter',
    },
  ]);

  const addWhatsAppToState = (isInstalled) => {
    if (isInstalled) {
      setIcons((state) => {
        state.push({
          image: WHATSAPP,
          onPress: () => {
            if (Platform.OS === 'android') {
              share({ social: Share.Social.WHATSAPP });
            } else {
              Linking.openURL(`whatsapp://send?text=${shareOptions.url}`).catch(
                (_) => {},
              );
            }
          },
          name: 'WhatsApp',
        });
        return state;
      });
    }
  };

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

  const share = async (options) => {
    try {
      if (options.social) {
         await Share.shareSingle({ ...shareOptions, ...options });
      }
      // closeModal();
    } catch (error) {
      if (options?.social === Share.Social.FACEBOOK) {
        Linking.openURL(
          'https://www.facebook.com/sharer/sharer.php?u=' + shareOptions.url,
        ).catch((ignored) => {});
      } else if (options?.social === Share.Social.TWITTER) {
        Linking.openURL(
          'https://twitter.com/intent/tweet?text=' + shareOptions.url,
        ).catch((ignored) => {});
      }
      closeModal();
    }
  };

  const { showModal, closeModal } = props;

  const renderIcons = icons.map((item) => {
    return (
      <TouchableOpacity
        style={styles.iconsButton}
        key={item.name}
        onPress={item.onPress}>
        <Image
          source={item.image}
          style={styles.socialMediaIcons}
          resizeMode="contain"
        />
        <RText style={styles.iconsText}>{item.name}</RText>
      </TouchableOpacity>
    );
  });

  return (
    <Modal
      onDismiss={closeModal}
      isVisible={showModal}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      backdropOpacity={0.5}
      onBackdropPress={closeModal}
      style={styles.modalStyle}>
      <View style={styles.modalContainer}>
        <View style={styles.contentHeader}>
          <RText style={styles.headerText}>Share</RText>
        </View>

        <View style={styles.contentBody}>{renderIcons}</View>
        <View style={styles.contentFooter}>
          <TouchableOpacity onPress={closeModal}>
            <RText style={styles.cancelButtonText}>Cancel</RText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ShareButton;

const styles = StyleSheet.create({
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
    marginVertical: 25,
  },
  headerText: {
    fontSize: normalizedFontSize(10),
    color: GS.greyColor,
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
});
