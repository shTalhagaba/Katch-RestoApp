//react
import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';

//3rd party
import {useNavigation} from '@react-navigation/native';
//others
import GS, {RText} from '../../GlobeStyle';

const ReviewOptionsModal = (props) => {
  const {
    displayDialog,
    setSelectedReview,
    setDisplayDialog,
    deleteSelectedReview,
    reviews,
    selectedReview,
    overRideUpdateEvent
  } = props;

  const navigation = useNavigation();
  const closeModal = () => {
    setSelectedReview(null);
    setDisplayDialog(false);
  };

  const [isDeleteInprogress, setIsDeleteInprogress] = useState(false);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!displayDialog}
      onRequestClose={closeModal}>
      <View style={style.modalContainer}>
        <TouchableOpacity
          disabled={isDeleteInprogress}
          style={style.backgroundBackButton}
          onPress={closeModal}
        />
        <View style={style.dialogContainer}>
          <TouchableOpacity
            disabled={isDeleteInprogress}
            style={[
              style.buttonsStyle,
              {backgroundColor: '#fff', marginBottom: 20},
            ]}
            onPress={() => {
              closeModal();
              if(overRideUpdateEvent){
                overRideUpdateEvent()
              }else{
                navigation.navigate('Update Review', {
                  ...reviews.data[selectedReview.reviewIndex],
                });
              }
             
            }}>
            <RText>Update</RText>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isDeleteInprogress}
            onPress={() => {
              setIsDeleteInprogress(true);

              deleteSelectedReview()
                .then((_) => {
                  setDisplayDialog(false);
                })
                .catch(_ => {
                  setIsDeleteInprogress(false);
                });
            }}
            style={[style.buttonsStyle, {backgroundColor: GS.logoRed}]}>
            {isDeleteInprogress ? (
              <ActivityIndicator color={GS.logoYellow} />
            ) : (
              <RText style={{color: '#fff'}}>Delete</RText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewOptionsModal;

const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000030',
    justifyContent: 'center',
  },
  backgroundBackButton: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  dialogContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 50,
  },
  buttonsStyle: {
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 0.1,
    borderColor: GS.lightGrey2,
  },
});
