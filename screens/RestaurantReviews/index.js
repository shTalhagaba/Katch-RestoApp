/* eslint-disable react-native/no-inline-styles */
//react
import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Animated,
  Image,
  Platform,
} from 'react-native';

//3rd party
import { useLazyQuery,useMutation } from '@apollo/client'
import auth from '@react-native-firebase/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
//others
import {
  GET_STORE_REVIEWS,
  DELETE_REVIEW,
  LIKE_REVIEW,
  UNLIKE_REVIEW,
  ADD_COMMENT,
} from '../../components/GraphQL';
import { REVIEW_BACKGROUND } from '../../assets/images';

import {
  StarShineGold,
  StarGreenBox,
  StarRedBox,
  StarGreenFilled,
} from '../../assets/svg';
import { deepClone } from '../../components/Helpers';
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  RText,
} from '../../GlobeStyle';
import ReviewCard from '../../components/ReviewCard';
import { Context } from '../../context/restaurant';
import StoreInfo from '../../components/StoreInfo';
import RestHeader from '../Restaurant/MainScreen/Header';
import ImagesModal from '../../containers/ImagesModal';
import Stars from '../../components/Stars';
import ShowMore from '../../components/Loading/More';
import ReviewOptionsModal from '../../containers/ReviewOptionsModal';
import ReviewModal from '../../containers/ReviewModal';

const Restaurant = (props) => {
  const { parentTabNavigation, route } = props;
  const context = useContext(Context);
  const { storeInfo } = context.state;
  const navigation = useNavigation();
  const storeID = route.params.id;
  const [isFetchMore, setIsFetchMore] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [images, setImages] = useState(null);
  const [viewReview, setViewReview] = useState(null);

  const [deleteReview] = useMutation(DELETE_REVIEW);
  const [likeReview] = useMutation(LIKE_REVIEW);
  const [unlikeReview] = useMutation(UNLIKE_REVIEW);

  const [getReviews, { loading, error, data, fetchMore, refetch }] =
    useLazyQuery(GET_STORE_REVIEWS, {
      variables: {
        filter: {
          cursor: null,
          limit: 10,
          storeID: storeID,
        },
      },
    });

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    if (data && data.getReviewsByStoreID) {
      setReviews(data.getReviewsByStoreID);
      setRefreshing(false);
    }
  }, [data]);

  useEffect(() => {
    setRefreshing(loading);
  }, [loading]);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const onCommentButtonClicked = (review) => {
    if (auth().currentUser && auth().currentUser.uid) {
      onViewReview({ ...review, focusInput: true });
    } else {
      navigation.navigate('Account', {
        cameFrom: (navigation) => {
          navigation.navigate('Rest', {
            ...route.params,
            showReview: review,
            screen: 'AllReviews',
            cameFrom: null,
          });
        },
      });
    }
  };

  const deleteSelectedReview = async () => {
    try {
      const { data } = await deleteReview({
        variables: { reviewID: selectedReview.id },
      });
      if (data.deleteReview) {
        let clonedState = deepClone(reviews);
        clonedState.data.splice(selectedReview.reviewIndex, 1);
        if (clonedState.data.length <= 0) {
          clonedState = null;
        }
        setReviews(clonedState);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (storeInfo && route.params.showReview) {
      const review = route.params.showReview;
      onViewReview(review);
      parentTabNavigation.setParams({ showReview: null });
    }
  }, [storeInfo]);

  const likeSelectedReview = async (review) => {
    //Chech if user is logged in
    if (auth().currentUser && auth().currentUser.uid) {
      try {
        const rid = review ? review._id : false;
        const reviewId = rid ? rid : selectedReview.id;

        const { data } = likeReview({
          variables: {
            likeInput: {
              rid: reviewId,
              reaction: 'like',
            },
          },
        });

        const clonedState = deepClone(reviews);
        const reviewIndex = clonedState.data.findIndex(
          (review) => review._id === reviewId,
        );
        clonedState.data[reviewIndex].likes.push({
          userId: auth().currentUser.uid,
        });
        setReviews(clonedState);
        if (
          viewReview &&
          viewReview._id === clonedState.data[reviewIndex]._id
        ) {
          const reviewClone = deepClone(viewReview);
          reviewClone.likes.push({
            userId: auth().currentUser.uid,
          });
          setViewReview(reviewClone);
        }
        return true;
      } catch (err) {}
    } else {
      navigation.navigate('Account', {
        cameFrom: (navigation) => {
          navigation.navigate('Rest', {
            ...route.params,
            showReview: review,
            screen: 'AllReviews',
            cameFrom: null,
          });
        },
      });
    }
  };

  const unlikeSelectedReview = async (review) => {
    try {
      const rid = review ? review._id : false;
      const reviewId = rid ? rid : selectedReview.id;
      const userId = auth().currentUser.uid;
      const { data } = unlikeReview({
        variables: {
          likeInput: {
            rid: reviewId,
            reaction: 'like',
          },
        },
      });
      const clonedState = deepClone(reviews);
      const reviewIndex = clonedState.data.findIndex(
        (review) => review._id === reviewId,
      );

      const modifiedLikes = clonedState.data[reviewIndex].likes.filter(
        (like) => like.userId !== userId,
      );
      clonedState.data[reviewIndex].likes = modifiedLikes;

      setReviews(clonedState);

      if (viewReview && viewReview._id === clonedState.data[reviewIndex]._id) {
        const reviewClone = deepClone(viewReview);
        reviewClone.likes = modifiedLikes;
        setViewReview(reviewClone);
      }
      return true;
    } catch (err) {}
  };

  const toggleDialog = (review, index) => {
    setDisplayDialog(true);
    setSelectedReview({
      id: review._id,
      reviewIndex: index,
    });
  };

  const viewImages = (images) => {
    setImages(images);
  };

  const clearImages = () => {
    setImages(null);
  };

  const onFetchMore = () => {
    try {
      setIsFetchMore(true);
      const updateQuery = (previousResult, { fetchMoreResult }) => {
        const newData = {
          data: [...reviews.data, ...fetchMoreResult.getReviewsByStoreID.data],
          nextCursor: fetchMoreResult.getReviewsByStoreID.nextCursor,
          next: fetchMoreResult.getReviewsByStoreID.next,
        };
        setReviews(deepClone(newData));
        setIsFetchMore(false);

        return {
          getReviewsByStoreID: {
            data: [
              ...previousResult.getReviewsByStoreID.data,
              ...fetchMoreResult.getReviewsByStoreID.data,
            ],
            nextCursor: fetchMoreResult.getReviewsByStoreID.nextCursor,
            next: fetchMoreResult.getReviewsByStoreID.next,
          },
        };
      };

      const filter = {
        cursor: reviews.nextCursor,
        limit: 10,
        storeID: storeID,
      };

      fetchMore({ variables: { filter: filter }, updateQuery });
    } catch (err) {}
  };

  const onNewReview = () => {
    if (auth().currentUser && auth().currentUser.uid) {
      navigation.navigate('Add Review', {
        storeID: storeID,
        cameFrom: (args) => {
          refetch();
          navigation.goBack();
          navigation.setParams({ cameFrom: null });
        },
      });
    } else {
      navigation.navigate('Account', {
        cameFrom: (nav) => {
          navigation.navigate('Rest', {
            ...route.params,
            screen: 'Add Review',
            cameFrom: null,
          });
        },
      });
    }
  };

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  const translateY = useRef(new Animated.Value(0)).current;

  const opacity = translateY.interpolate({
    inputRange: [0, 171],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  let headerSpace = translateY.interpolate({
    inputRange: [0, 50],
    outputRange: [-statusBarHeight, 0],
    extrapolate: 'clamp',
  });

  const onViewReview = (review) => {
    setViewReview(review);
  };

  const onRefresh = async () => {
    setReviews(null);
    const value = await refetch();
    if (value && value.data && value.data.getReviewsByStoreID) {
      setReviews(value.data.getReviewsByStoreID);
      setRefreshing(false);
    }
  };

  return (
    storeInfo && (
      <SafeAreaView
        style={[{ paddingTop: statusBarHeight }, style.safeAreaStyle]}>
        {storeInfo && (
          <RestHeader
            storeInfo={storeInfo}
            headerSpace={headerSpace}
            opacity={opacity}
            navigation={navigation}
          />
        )}
        <Animated.ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 15,
          }}
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
              listener: (e) => {
                var windowHeight = Dimensions.get('window').height,
                  height = e.nativeEvent.contentSize.height,
                  offset = e.nativeEvent.contentOffset.y;
                if (
                  windowHeight + offset >= height &&
                  isFetchMore === false &&
                  reviews &&
                  reviews.next
                ) {
                  onFetchMore();
                }
              },
            },
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);

                onRefresh();
              }}
            />
          }>
          {/* header placeHolder */}
          <View style={{ height: 50 }} />
          {/* header placeHolder */}

          {storeInfo && <StoreInfo info={storeInfo} withReviews={false} />}

          {storeInfo && (
            <View style={style.reviewInfoContainer}>
              <View style={style.reviewTopChildContainer1}>
                <StarShineGold height={30} width={30} />
                <RText
                  fontName={customFont.axiformaSemiBold}
                  style={style.reviewTopChildContainer1Text}>
                  REVIEWS
                </RText>
                {!storeInfo.comingSoon && (
                  <TouchableOpacity
                    style={style.newReviewButton}
                    onPress={onNewReview}>
                    <StarGreenFilled height={17} width={17} />
                    <RText
                      fontName={customFont.axiformaSemiBold}
                      style={style.newReviewButtonText}>
                      WRITE A REVIEW
                    </RText>
                  </TouchableOpacity>
                )}
              </View>
              {/* star container */}

              <View style={style.reviewTopChildContainer2}>
                <View style={style.reviewStarContainer}>
                  <View style={style.reviewStarContainerInner}>
                    <Stars
                      component={StarRedBox}
                      rating={storeInfo.restaurantRating}
                      containerStyle={style.starContainer}
                      starStyle={style.starStyle}
                      starWidth={18}
                      starHeight={18}
                    />
                    <BoldText style={style.reviewStarContainerRatingText}>
                      {storeInfo.restaurantRating.toFixed(1)}
                    </BoldText>
                  </View>
                  <View style={style.reviewStarLowerTextContainer}>
                    <BoldText style={style.reviewStarRatingLowerText}>
                      Restaurant
                    </BoldText>
                    <RText
                      style={[
                        style.reviewStarRatingLowerText,
                        { color: GS.lightGrey },
                      ]}>
                      Rating
                    </RText>
                  </View>
                </View>
                <View style={style.reviewStarContainer}>
                  <View style={style.reviewStarContainerInner}>
                    <Stars
                      component={StarGreenBox}
                      rating={storeInfo.rating.toFixed(1)}
                      containerStyle={style.starContainer}
                      starStyle={style.starStyle}
                      starWidth={18}
                      starHeight={18}
                    />
                    <BoldText style={style.reviewStarContainerRatingText}>
                      {storeInfo.rating.toFixed(1)}
                    </BoldText>
                  </View>
                  <View style={style.reviewStarLowerTextContainer}>
                    <BoldText style={style.reviewStarRatingLowerText}>
                      Katch!
                    </BoldText>
                    <RText
                      style={[
                        style.reviewStarRatingLowerText,
                        { color: GS.lightGrey },
                      ]}>
                      Pickup Rating
                    </RText>
                  </View>
                </View>
              </View>
            </View>
          )}
          {/* star container */}

          {/*  */}
          {storeInfo && storeInfo.userCustomTags.length > 0 && (
            <View style={style.tagsContainer}>
              <RText style={style.tagsTitle}>
                People say this place is known for
              </RText>
              <View style={style.tagsInnerContainer}>
                {storeInfo.userCustomTags.map((tag, index) => {
                  return index < 10 ? (
                    <View key={tag + index} style={style.tagsStyle}>
                      <RText style={style.tagsText}>{tag}</RText>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          )}
          {/*  */}
          {reviews ? (
            reviews.data.length > 0 ? (
              reviews.data.map((review, index) => {
                const doesReviewBelongToUser = auth().currentUser
                  ? auth().currentUser.uid === review.uid
                    ? true
                    : false
                  : false;

                return (
                  <ReviewCard
                    setSelectedReview={setSelectedReview}
                    onViewReview={onViewReview}
                    key={review._id + index}
                    viewImages={viewImages}
                    likeSelectedReview={likeSelectedReview}
                    unlikeSelectedReview={unlikeSelectedReview}
                    toggleDialog={toggleDialog}
                    doesReviewBelongToUser={doesReviewBelongToUser}
                    review={review}
                    index={index}
                    onCommentButtonClicked={onCommentButtonClicked}
                    navigation={navigation}
                    withAccounts={true}
                  />
                );
              })
            ) : (
              <View style={style.emptyContainer}>
                <Image
                  source={REVIEW_BACKGROUND}
                  style={style.emptyImage}
                  resizeMode="contain"
                />
                <RText style={style.emptyText}>
                  {storeInfo.comingSoon
                    ? "Review's Coming Soon !!"
                    : 'No Reviews'}
                </RText>
              </View>
            )
          ) : (
            <View style={style.loadingContainer}>
              <ShowMore style={style.loadingList} />
            </View>
          )}

          {reviews && reviews.next && (
            <ShowMore
              style={{
                justifyContent: 'center',
                marginHorizontal: 20,
                marginBottom: 20,
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 10,
                marginVertical: 20,
              }}
            />
          )}
        </Animated.ScrollView>
        <ImagesModal images={images} clearImages={clearImages} />
        {viewReview && (
          <ReviewModal
            images={images}
            viewImages={viewImages}
            viewReview={viewReview}
            setViewReview={setViewReview}
            likeSelectedReview={likeSelectedReview}
            unlikeSelectedReview={unlikeSelectedReview}
          />
        )}
        <ReviewOptionsModal
          displayDialog={displayDialog}
          setDisplayDialog={setDisplayDialog}
          setSelectedReview={setSelectedReview}
          deleteSelectedReview={deleteSelectedReview}
          selectedReview={selectedReview}
          reviews={reviews}
          overRideUpdateEvent={() => {
            navigation.navigate('Update Review', {
              ...reviews.data[selectedReview.reviewIndex],
              cameFrom: (args) => {
                refetch();
                navigation.goBack();
                navigation.setParams({ cameFrom: null });
              },
            });
          }}
        />
      </SafeAreaView>
    )
  );
};

export default Restaurant;

const style = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  loadingList: {
    padding: 20,
    borderRadius: 10,
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  reviewInfoContainer: {
    marginTop: 20,
  },
  newReviewButton: {
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
  newReviewButtonText: {
    fontSize: normalizedFontSize(5),
    marginLeft: 10,
    color: GS.logoGreen,
  },
  reviewTopChildContainer1: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  reviewTopChildContainer1Text: {
    fontSize: normalizedFontSize(10),
    marginLeft: 10,
  },
  reviewTopChildContainer2: {
    flexDirection: 'row',
  },
  starContainer: {
    flexDirection: 'row',
  },
  starStyle: {
    marginLeft: 2,
  },
  reviewStarContainer: {
    width: '50%',
    marginVertical: 10,
    padding: 10,
  },
  reviewStarContainerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStarContainerRatingText: {
    fontSize: normalizedFontSize(6),
    marginLeft: 10,
  },
  reviewStarLowerTextContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  reviewStarRatingLowerText: {
    fontSize: normalizedFontSize(5),
    marginRight: 5,
  },
  tagsTitle: {
    color: GS.lightGrey2,
    fontSize: normalizedFontSize(6),
  },
  tagsContainer: {
    backgroundColor: GS.bgGreenLight2,
    marginHorizontal: -15,
    paddingTop: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  tagsInnerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tagsStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 100,
    marginBottom: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
  },
  tagsText: {
    fontSize: normalizedFontSize(5.5),
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    height: 250,
    width: 300,
  },
  emptyText: {
    color: GS.greyColor,
  },
});
