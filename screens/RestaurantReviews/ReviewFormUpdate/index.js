/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
  findNodeHandle,
} from 'react-native';

//3rd party
import { useQuery,useMutation } from '@apollo/client'
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//others
import GS, {customFont, normalizedFontSize, RText} from '../../../GlobeStyle';
import Icon from '../../../components/Icon';
import {EMPTY_STAR, FILLED_STAR} from '../../../assets/images';
import {
  deepClone,
  generateReviewImgScr,
  useAppProperties,
} from '../../../components/Helpers';
import {
  GET_STORE_REVIEWS,
  GET_TAGS_BY_STOREID,
  UPDATE_REVIEW,
} from '../../../components/GraphQL';
import {Context} from '../../../context/restaurant';
import {AddImage} from '../../../assets/svg';
import Header from '../../../components/AccountHeader';
import Loading from '../Loading';

//show seller tags as selectable tags on both sides of the field
//if selected in positive remove from negative
const RestPromoList = ({route, navigation}) => {
  const _review = route.params;
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [delImages, setDelImages] = useState([]);
  const [imagesNew, setImagesNew] = useState([]);
  const [tagsListDB, setTagsListDB] = useState([]);
  const [reviewType, setReviewType] = useState('General');
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [inputText, setInputText] = useState({
    review: '',
    positive: '',
    negative: '',
  });

  const {data} = useQuery(GET_TAGS_BY_STOREID, {
    variables: {
      storeId: _review.sellerId,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const [loadingProps, propsLoadingError, propsData] = useAppProperties();

  useEffect(() => {
    if (data && data.getTagsByStoreID) {
      const tagArray = data.getTagsByStoreID.map((t) => {
        return {
          name: t,
          type: 'store',
        };
      });
      setTagsListDB(tagArray);
    }
  }, [data]);

  useEffect(() => {
    setInputText((state) => {
      return {...state, review: _review.review};
    });
    setRating(_review.rating);
    setTags([..._review.tags]);
    const imagesArray = _review.images.map((image) => {
      return {uri: generateReviewImgScr(image), url: image};
    });
    setImages(imagesArray);
    setReviewType(_review.reviewType);
  }, [_review]);

  const changeText = (key, value) => {
    const inputs = {...inputText};
    inputs[key] = value;
    setInputText(inputs);
  };

  const checkIfAdded = (tag) => {
    const index = tags.findIndex(({name, sentiment}) => name === tag.name);

    return index >= 0;
  };

  const addSelectedTag = (tagObj) => {
    if (!checkIfAdded(tagObj)) {
      const clonedState = deepClone(tags);
      clonedState.push(tagObj);
      setTags(clonedState);
    }
  };

  const removeSelectedTag = (tag) => {
    const clonedState = deepClone(tags);
    const findIndex = ({name, sentiment}) =>
      name === tag.name && sentiment === tag.sentiment;
    const index = clonedState.findIndex(findIndex);
    clonedState.splice(index, 1);
    setTags(clonedState);
  };

  const removeImage = (index) => {
    const clonedState = deepClone(images);
    setDelImages((imgs)=>[...imgs,{...images[index]}]);
    clonedState.splice(index, 1);
    setImages(clonedState);
  };

  const selectImages = async () => {
    const maxReviewImages =
      propsData &&
      propsData.getAppProperties &&
      propsData.getAppProperties.maxReviewImages
        ? propsData.getAppProperties.maxReviewImages
        : 20;
    try {
      const selectedImages = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: maxReviewImages, //this doesn't work
        mediaType: 'photo',
        compressImageMaxWidth: 500,
        includeBase64: true,
      });

      setImagesNew((state) => {
        state = selectedImages.reduce(
          (acc, selectedImage) => {
            // check if image was already selected
            const wasNotSelected =
              acc.findIndex((file) => file.data === selectedImage.data) < 0;

            if (wasNotSelected && acc.length < 20) {
              selectedImage.uri = selectedImage.path;

              acc.push(selectedImage);
            } else {
            }
            return acc;
          },
          [...state],
        );

        return state;
      });
    } catch (err) {
    }
  };
  const [submitReview] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [
      {
        query: GET_STORE_REVIEWS,
        variables: {
          filter: {
            cursor: null,
            limit: 10,
            storeID: _review.sellerId,
          },
        },
      },
    ],
  });

  const submit = async () => {
    try {
      setIsFormLoading(true);
      const updatedReview = await submitReview({
        variables: {
          updateReviewInput: {
            _id: _review._id,
            sellerId: _review.sellerId,
            review: inputText.review,
            tags: tags,
            imagesNew: imagesNew.map((image) => image.data),
            images: images.map((image) => image.url),
            rating: rating,
            reviewType: reviewType,
            imagesDel: delImages.map((image) => image.url),
          },
        },
      });
      setIsFormLoading(false);
      if (!updatedReview) {
        throw new Error('Review not updated');
      }
      if (route.params.cameFrom) {
        route.params.cameFrom(updatedReview);
      } else {
        navigation.navigate('AllReviews');
      }
    } catch (err) {
      setIsFormLoading(false);
    }
  };

  const doesMatchString = (tag, property) =>
    inputText[property].trim() != ''
      ? tag.name.search(new RegExp(inputText[property].trim(), 'gi')) !== -1
      : true;

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const scrollRef = useRef();
  const _scrollToInput = (reactNode) => {
    const screenHeight = Dimensions.get('screen').height
    setTimeout(() => {
      scrollRef.current.scrollToPosition(0,screenHeight)
    },300)
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff', paddingTop: statusBarHeight}}>
      <Header
        goBack={() => navigation.goBack()}
        title=''
        style={{
          height: 'auto',
          paddingTop: 0,
          paddingBottom: 0,
        }}
      />
      <View
        style={{
          flex: 1,
          paddingBottom: 10,
          paddingHorizontal: 20,
          backgroundColor: '#fff',
        }}>
        <KeyboardAwareScrollView
          ref={ref => {
            scrollRef.current = ref
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
            <View style={style.tagView}>
              <RText style={{fontSize: normalizedFontSize(6)}}>
                Rate your experience
              </RText>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                {[1, 2, 3, 4, 5].map((_, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setRating(i + 1);
                      }}>
                      <Icon
                        source={i + 1 <= rating ? FILLED_STAR : EMPTY_STAR}
                        style={{
                          height: 25,
                          width: 25,
                          marginRight: 4,
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* //positive tags */}

            {rating > 1 && (
              <View style={style.tagView}>
                <RText
                  fontName={customFont.axiformaRegular}
                  style={{fontSize: normalizedFontSize(6)}}>
                  What did you love?
                </RText>

                {/* //removable tags */}
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {tags
                    .filter((tag) => tag.sentiment === 'positive')
                    .map((tag, i) => {
                      return (
                        <TouchableOpacity
                          key={tag.name + i}
                          style={style.selectedTag}
                          onPress={() => {
                            removeSelectedTag(tag);
                          }}>
                          <RText style={style.selectedTagTextColor}>
                            {tag.name}
                          </RText>
                        </TouchableOpacity>
                      );
                    })}
                </View>

                {/* //text input to add new tags */}
                <TextInput
                  onChangeText={(text) => changeText('positive', text)}
                  value={inputText.positive}
                  placeholder="Search tag or select from below"
                  onSubmitEditing={() => {
                    addSelectedTag({
                      name: inputText.positive,
                      sentiment: 'positive',
                      type: 'userCustom',
                    });
                    changeText('positive', '');
                  }}
                  style={style.inputText}
                />
                {/* //addable tags */}

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {tagsListDB.map((tag, i) => {
                    return !checkIfAdded(tag) &&
                      doesMatchString(tag, 'positive') ? (
                      <TouchableOpacity
                        key={tag.name + i}
                        style={style.availableTag}
                        onPress={() => {
                          addSelectedTag({
                            name: tag.name,
                            sentiment: 'positive',
                            type: '',
                          });
                        }}>
                        <RText style={style.availableTagTextColor}>
                          {tag.name}
                        </RText>
                      </TouchableOpacity>
                    ) : null;
                  })}
                </View>
              </View>
            )}

            {/* //negative tags */}
            {rating > 0 && rating < 5 && (
              <View style={style.tagView}>
                <RText
                  fontName={customFont.axiformaRegular}
                  style={{fontSize: normalizedFontSize(6)}}>
                  What did you not love?
                </RText>
                {/* //removable tags */}
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {tags
                    .filter((tag) => tag.sentiment === 'negative')
                    .map((tag, i) => {
                      return (
                        <TouchableOpacity
                          key={tag.name + i}
                          style={style.selectedTag}
                          onPress={() => {
                            removeSelectedTag(tag);
                          }}>
                          <RText style={style.selectedTagTextColor}>
                            {tag.name}
                          </RText>
                        </TouchableOpacity>
                      );
                    })}
                </View>

                {/* //text input to add new tags */}
                <TextInput
                  onChangeText={(text) => changeText('negative', text)}
                  value={inputText.negative}
                  placeholder="Search tag or select from below"
                  onSubmitEditing={() => {
                    addSelectedTag({
                      name: inputText.negative.trim(),
                      sentiment: 'negative',
                      type: 'userCustom',
                    });
                    changeText('negative', '');
                  }}
                  style={style.inputText}
                />

                {/* //addable tags */}

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {tagsListDB.map((tag, i) => {
                    return !checkIfAdded(tag) &&
                      doesMatchString(tag, 'negative') ? (
                      <TouchableOpacity
                        key={tag.name + i}
                        style={style.availableTag}
                        onPress={() => {
                          addSelectedTag({
                            name: tag.name,
                            sentiment: 'negative',
                            type: '',
                          });
                        }}>
                        <RText style={style.availableTagTextColor}>
                          {tag.name}
                        </RText>
                      </TouchableOpacity>
                    ) : null;
                  })}
                </View>
              </View>
            )}
            <View style={style.mtop15}>
              <RText
                fontName={customFont.axiformaSemiBold}
                style={{fontSize: normalizedFontSize(6)}}>
                Add Photos
              </RText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                  flexWrap: 'wrap',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    selectImages();
                  }}
                  style={{
                    marginRight: 5,
                    marginBottom: 5,
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: GS.textColorGrey1,
                    borderRadius: 5,
                  }}>
                  <AddImage height={50} width={50} />
                </TouchableOpacity>
                {images.map((image, index) => {
                  return (
                    <TouchableOpacity
                      key={image.uri}
                      onPress={() => {
                        removeImage(index);
                      }}>
                      <Image
                        style={{
                          height: 80,
                          width: 80,
                          resizeMode: 'cover',
                          borderRadius: 5,
                          marginRight: 5,
                        }}
                        source={{uri: image.uri}}
                      />
                    </TouchableOpacity>
                  );
                })}
                {imagesNew.map((image, index) => {
                  return (
                    <TouchableOpacity
                      key={image.uri}
                      onPress={() => {
                        removeImage(index);
                      }}>
                      <Image
                        style={{
                          height: 80,
                          width: 80,
                          resizeMode: 'cover',
                          borderRadius: 5,
                          marginRight: 5,
                        }}
                        source={{uri: image.uri}}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={style.mtop15}>
              <RText
                fontName={customFont.axiformaSemiBold}
                style={{fontSize: normalizedFontSize(6)}}>
                Write a review
              </RText>

              <TextInput
                onFocus={(event) => {
                _scrollToInput(findNodeHandle(event.target))
                }}
                onChangeText={(text) => changeText('review', text)}
                value={inputText.review}
                placeholder="Review must be at least 100 character in length"
                style={style.textInput}
                multiline
                numberOfLines={6}
              />
            </View>
            <TouchableOpacity
          style={{
            width: '100%',
            paddingVertical: 12,
            backgroundColor: GS.logoGreen,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            alignSelf: 'flex-end',
          }}
          onPress={() => {
            submit();
          }}>
          <RText
            fontName={customFont.axiformaSemiBold}
            style={{color: '#fff', fontSize: normalizedFontSize(8)}}>
            Submit
          </RText>
        </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
      <Loading style={style.formLoading} isLoading={isFormLoading}/>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  formLoading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000030'
  },
  tagView: {
    marginTop: 15,
  },
  inputText: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexGrow: 1,
    paddingVertical: 1,
    marginVertical: 5,
  },
  selectedTag: {
    marginLeft: 10,
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: GS.logoBlue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0,
  },
  availableTag: {
    marginLeft: 10,
    marginTop: 6,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  availableTagTextColor: {
    color: '#000',
    fontSize: normalizedFontSize(5.3),
  },
  selectedTagTextColor: {
    color: '#FFF',
    fontSize: normalizedFontSize(5.3),
  },
  scrollView: {
    marginTop: 25,
    flex: 1,
  },
  mtop15: {
    marginTop: 25,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
    textAlign: 'justify',
    marginBottom: 10,
    textAlignVertical: 'top',
    minHeight: 150,
    padding: 5,
  },
});
export default RestPromoList;
