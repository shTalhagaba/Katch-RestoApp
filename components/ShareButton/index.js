import React, { Fragment, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
//others
import { SHARE } from '../../assets/images';
import ShareModal from '../../containers/ShareModal';
import GS, { customFont, normalizedFontSize, RText } from '../../GlobeStyle';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';

const ShareButton = (props) => {
  const {
    link,
    textOnly = false,
    hideText = false,
    alignLeft = false,
    roundedShare = false,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal((state) => !state);
  };

  const closeModal = () => setShowModal(false);
  return (
    <Fragment>
      {!roundedShare ? (
        <TouchableOpacity
          style={[styles.shareButton, alignLeft ? styles.alignLeft : null]}
          onPress={toggleModal}>
          {textOnly ? (
            <ShareTextButton />
          ) : (
            <Fragment>
              {!alignLeft ? (
                <Image
                  source={SHARE}
                  style={styles.shareIcon}
                  resizeMode="contain"
                />
              ) : (
                <SLIcon name={'share'} color={GS.secondaryColor} size={20} />
              )}
              {!hideText && <RText style={styles.shareText}>Share</RText>}
            </Fragment>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={toggleModal} style={styles.rounded}>
          <SLIcon name={'share'} color={GS.secondaryColor} size={15} />
        </TouchableOpacity>
      )}
      <ShareModal showModal={showModal} closeModal={closeModal} link={link} />
    </Fragment>
  );
};

const ShareTextButton = () => {
  return (
    <View style={styles.container}>
      <RText>Share</RText>
    </View>
  );
};

export default ShareButton;

const styles = StyleSheet.create({
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    margin: 5,
    width: 75,
  },
  shareIcon: {
    height: 20,
    width: 20,
    marginBottom: 10,
  },
  shareText: {
    fontSize: normalizedFontSize(6.126),
    fontFamily: customFont.axiformaRegular,
    color: GS.lightGrey2,
  },
  container: {
    padding: 5,
    marginLeft: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  rounded: {
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: GS.logoGreen,
    height: 35,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 10,
    alignItems: 'center',
  },
});
