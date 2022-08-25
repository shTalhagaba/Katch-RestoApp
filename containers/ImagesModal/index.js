/* eslint-disable react-native/no-inline-styles */
//react
import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';

//3rd party
import IIcon from 'react-native-vector-icons/Ionicons';

//others
import {generateReviewImgScr} from '../../components/Helpers';

const windowWidth = Dimensions.get('window').width;

/**
 *
 * @param {React props} props
 * @param {function} clearImages callback to clear the list of images and close the modal
 * @param {object} images pass an object with a list property which contains an array of the image uri and the index of image to focus to it
 *   example: -
 *      images : {
 *          list: [uri],
 *          index: 3
 *      }
 *
 */
const ImagesModal = (props) => {
  const {images, clearImages} = props;

  const renderItem = ({item}) => {
    const image = item;
    return (
      <View
        key={image}
        style={style.imageContainer}>
        <Image
          source={{uri: generateReviewImgScr(image)}}
          style={style.imageStyle}
        />
      </View>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={images !== null}
      onRequestClose={clearImages}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
        <View style={style.header}>
          <TouchableOpacity onPress={clearImages} style={style.closeButton}>
            <IIcon name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {images && (
          <FlatList
            getItemLayout={(data, index) => {
              return {
                index: index,
                  length: windowWidth,
                  offset: index * windowWidth
              }
            }}
            initialScrollIndex={images.index}
            data={images.list}
            keyExtractor={(item, index) => item + index}
            contentContainerStyle={style.flatListContainer}
            horizontal
            contentOffset={{x: 10, y: 20}}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            renderItem={renderItem}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default ImagesModal;

const style = StyleSheet.create({
  header: {
    width: '100%',
    zIndex: 1,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 35 : 0,
    right: 0,
    left: 0,
    backgroundColor: '#00000050',
    alignItems: 'flex-end',
  },
  closeButton: {
    marginRight: 10,
    padding: 5,
  },
  flatListContainer: {
    // paddingVertical: 10,
  },
  imageContainer: {
    width: windowWidth,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
