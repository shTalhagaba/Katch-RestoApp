/* eslint-disable react-native/no-inline-styles */
//react
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import GS, {normalizedFontSize, RText} from '../../GlobeStyle';

const FileUploadModal = ({...props}) => {
  let {images, submit, cancel} = props;
  const [image, setImage] = useState([]);
  useEffect(() => {
    setImage(images);
  }, []);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={images ? images.length > 0 : false}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems:'center',
              paddingHorizontal: 10
            }}
              data={images}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    marginRight: 5,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <Image
                    style={{height: 110, width: 110}}
                    source={{uri: `data:${item.mime};base64,${item.data}`}}
                  />
                </TouchableOpacity>
              )}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{paddingTop: 5, flexDirection: 'row'}}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => cancel()}>
                <RText style={styles.textStyle}>Cancel</RText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.openButton} onPress={() => submit(images)}>
                <RText style={styles.textStyle}>Upload</RText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: '#00000050',
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: GS.logoGreen,
  },
  openButton: {
    flex:1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    backgroundColor: GS.logoGreen,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  cancelButton: {
    flex:1,
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.greyColor,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  textStyle: {
    color: '#fff',
    fontSize: normalizedFontSize(8),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelTextStyle: {
    color: GS.logoRed,
  },
});
export default FileUploadModal;
