import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { generateCouponImgScr } from '../../components/Helpers';
import IIcon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import More from '../../components/Loading/More';

const CouponImagesModal = (props) => {
  const { images, couponId, toggleImagesModal, showImagesModal } = props;
  const backdropColor = 'rgba(0,0,0,1)';
  const imagesSrc = (images || [])
    .map((image) =>
      image
        ? {
            url: generateCouponImgScr(couponId, `subImage/${image}`),
          }
        : null,
    )
    .filter((x) => x);

  const onClose = () => {
    toggleImagesModal(null);
  };

  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios' ? 20 : insets.top + 10;

  return (
    <Modal
      onDismiss={onClose}
      isVisible={typeof showImagesModal === 'number'}
      onBackdropPress={onClose}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      style={styles.modalStyle}
      backdropOpacity={1}
      backdropColor={backdropColor}>
      <ImageViewer
        index={showImagesModal || 0}
        imageUrls={imagesSrc}
        useNativeDriver={true}
        saveToLocalByLongPress={false}
        loadingRender={() => <More style={styles.imageLoading}/>}
      />
      <View style={[styles.modalCoseBtnContainer, { top: statusBarHeight }]}>
        <TouchableOpacity style={styles.modalCoseBtn} onPress={onClose}>
          <IIcon name="close" size={30} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CouponImagesModal;

const styles = StyleSheet.create({
  imageLoading: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  modalStyle: {
    padding: 0,
    margin: 0,
    flex: 1,
  },
  modalCoseBtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff80',
  },
  modalCoseBtnContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
});
