//react
//3rd party
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PHOTO_BACKGROUND } from '../../assets/images';
import { CameraColored, CameraGreen } from '../../assets/svg';
//othersScrollView,
import {
  ADD_IMAGE_GALLERY,
  GET_IMAGE_BY_STORE,
  GET_TOTAL_IMAGE_COUNT,
} from '../../components/GraphQL';
import { deepClone, generateReviewImgScr } from '../../components/Helpers';
import ShowMore from '../../components/Loading/More';
import StoreInfo from '../../components/StoreInfo';
import FileUploadModal from '../../containers/FileUploadModal';
import ImagesModal from '../../containers/ImagesModal';
import { Context } from '../../context/restaurant';
import GS, { customFont, normalizedFontSize, RText } from '../../GlobeStyle';
import RestHeader from '../Restaurant/MainScreen/Header';

const RestaurantGallery = ({ navigation, route, ...props }) => {
  const context = useContext(Context);
  const { storeInfo } = context.state;
  const limit = 15;

  const storeID = route.params.id;
  const {
    loading,
    error,
    data,
    fetchMore,
    refetch: refetchImages,
  } = useQuery(GET_IMAGE_BY_STORE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      filter: {
        cursor: null,
        limit: limit,
        sellerId: storeID,
      },
    },
  });
  const [imageCount, setImageCount] = useState(null);
  const { refetch: refetchImageCount } = useQuery(GET_TOTAL_IMAGE_COUNT, {
    notifyOnNetworkStatusChange: true,
    variables: {
      sellerId: storeID,
    },
    onCompleted: (data) => {
      setImageCount(data.getTotalImagesCount);
    },
  });

  const [images, setImages] = useState(null);
  const [modalImages, setModalImages] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  const translateY = useRef(new Animated.Value(0)).current;
  const [addImage] = useMutation(ADD_IMAGE_GALLERY);
  const [uploadImages, setUploadImages] = useState(null);
  const showPicker = async () => {
    try {
      const selectedImages = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: 20,
        mediaType: 'photo',
        compressImageMaxWidth: 500,
        includeBase64: true,
      });
      setUploadImages(selectedImages);
    } catch (error) {
    }
  };

  const uploadImage = async (selectedImages) => {
    try {
      setUploadImages(null);
      setRefreshing(true);

      const { data } = await addImage({
        variables: {
          imageRefInput: {
            sellerId: storeID,
            imagesBase64: selectedImages.map((image) => image.data),
          },
        },
      });

      const newImagesArray = data.addImages.map(({ image }) => image);

      setImages((state) => {
        const ImagesInState = state.data;
        const newArray = newImagesArray.concat(ImagesInState);
        state.data = newArray;
        return state;
      });

      setImageCount((state) => (state += newImagesArray.length));

      setRefreshing(false);
    } catch (error) {
    }
  };

  const cancelUpload = async () => {
    setUploadImages(null);
  };

  const opacity = translateY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  let headerSpace = translateY.interpolate({
    inputRange: [0, 50],
    outputRange: [-statusBarHeight, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (data && data.getImagesByStoreIDWithCursor) {
      setImages(data.getImagesByStoreIDWithCursor);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const showModal = (index) => {
    setModalImages({
      list: images.data,
      index,
    });
  };

  const clearImages = () => {
    setModalImages(null);
  };

  const fetchMoreImage = () => {
    if (images) {
      if (images.next && images.nextCursor) {
        const updateQuery = (previousResult, { fetchMoreResult }) => {
          const newData = deepClone({
            data: [
              ...images.data,
              ...fetchMoreResult.getImagesByStoreIDWithCursor.data,
            ],
            nextCursor: fetchMoreResult.nextCursor,
            next: fetchMoreResult.next,
          });
          setImages(newData);

          return {
            getImagesByStoreIDWithCursor: {
              data: [
                ...previousResult.getImagesByStoreIDWithCursor.data,
                ...fetchMoreResult.getImagesByStoreIDWithCursor.data,
              ],
              nextCursor:
                fetchMoreResult.getImagesByStoreIDWithCursor.nextCursor,
              next: fetchMoreResult.getImagesByStoreIDWithCursor.next,
            },
          };
        };
        const filter = {
          cursor: images.nextCursor,
          limit: limit,
          sellerId: storeID,
        };

        fetchMore({ variables: { filter }, updateQuery });
      }
    }
  };

  const onRefresh = async () => {
    try {
      setImages(null);
      const _images = await refetchImages();
      setImages(_images.data.getImagesByStoreIDWithCursor);

      refetchImageCount();
    } catch (_error) {}
  };

  return (
    storeInfo && (
      <SafeAreaView
        style={[style.container, { paddingTop: statusBarHeight, flex: 1 }]}>
        {storeInfo ? (
          <RestHeader
            storeInfo={storeInfo}
            headerSpace={headerSpace}
            opacity={opacity}
            navigation={navigation}
          />
        ) : null}
        <View style={{ height: 50 }} />

        <Animated.FlatList
          data={images ? images.data : []}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);

                onRefresh().finally(() => {
                  setRefreshing(false);
                });
              }}
            />
          }
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: translateY,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
          onEndReached={fetchMoreImage}
          onEndReachedThreshold={0.2}
          numColumns={3}
          keyExtractor={(item, index) => item + index}
          ListFooterComponent={
            images?.next && <ShowMore style={style.showMore} />
          }
          ListHeaderComponent={() => {
            return (
              <View>
                {storeInfo ? (
                  <StoreInfo info={storeInfo} withReviews={false} />
                ) : null}
                <View style={style.photoTopContainer}>
                  <CameraColored height={30} width={30} />
                  <RText
                    fontName={customFont.axiformaSemiBold}
                    style={style.TopChildContainer1Text}>
                    PHOTOS
                  </RText>
                  {!storeInfo.comingSoon && (
                    <TouchableOpacity
                      style={style.addPhotoButton}
                      onPress={showPicker}>
                      <CameraGreen height={17} width={17} />
                      <RText
                        fontName={customFont.axiformaSemiBold}
                        style={style.newPhotoButtonText}>
                        ADD PHOTO
                      </RText>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    paddingTop: 20,
                    padding: 10,
                    flexShrink: 1,
                    borderBottomColor: '#FF0000',
                    borderBottomSize: 2,
                  }}>
                  {imageCount ? (
                    <RText
                      fontName={customFont.axiformaSemiBold}
                      style={{
                        textDecorationLine: 'underline',
                        textDecorationStyle: 'solid',
                        textDecorationColor: '#000',
                        fontSize: normalizedFontSize(5.3),
                      }}>
                      ALL ({imageCount || '0'})
                    </RText>
                  ) : null}
                </View>
              </View>
            );
          }}
          style={style.ph15}
          renderItem={({ item, index }) => {
            const uri = item;
            return (
              <TouchableOpacity
                onPress={() => showModal(index)}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  padding: 5,
                }}>
                <Image
                  key={item.index}
                  style={{
                    height: 120,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: generateReviewImgScr(uri),
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />

        {!images && (
          <View style={style.centerContainer}>
            <ShowMore style={style.loadingList} />
          </View>
        )}

        {images && images.data.length === 0 && (
          <View style={style.centerContainer}>
            <Image
              source={PHOTO_BACKGROUND}
              style={style.emptyImage}
              resizeMode="contain"
            />
            <RText style={style.emptyText}>
              {storeInfo.comingSoon ? "Review's Coming Soon !!" : 'No Reviews'}
            </RText>
          </View>
        )}

        <ImagesModal clearImages={clearImages} images={modalImages} />
        <FileUploadModal
          images={uploadImages}
          submit={uploadImage}
          cancel={cancelUpload}
        />
      </SafeAreaView>
    )
  );
};

export default RestaurantGallery;

const style = StyleSheet.create({
  loadingList: {
    padding: 20,
    borderRadius: 10,
  },
  centerContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ph15: {
    paddingHorizontal: 15,
  },
  addPhotoButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: GS.logoGreen,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  newPhotoButtonText: {
    fontSize: normalizedFontSize(5),
    marginLeft: 10,
    color: GS.logoGreen,
  },
  photoTopContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  TopChildContainer1Text: {
    fontSize: normalizedFontSize(6),
    marginLeft: 10,
  },
  showMore: {
    justifyContent: 'center',
    marginVertical: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  emptyImage: {
    height: 250,
    width: 300,
  },
  emptyText: {
    marginTop: 10,
    color: GS.greyColor,
  },
});
