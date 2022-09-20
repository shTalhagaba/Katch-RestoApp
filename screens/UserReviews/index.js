//react
import React, {useEffect, useState} from 'react';
import {View, ScrollView, SafeAreaView, RefreshControl} from 'react-native';

//3rd party
import { useQuery ,useMutation} from '@apollo/client'
import {Viewport} from '@skele/components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
//others
import {
  GET_USER_REVIEWS,
  DELETE_REVIEW,
  LIKE_REVIEW,
  UNLIKE_REVIEW,
} from '../../components/GraphQL';
import Header from '../../components/AccountHeader';
import ReviewCard from '../../components/ReviewCard';
import {deepClone} from '../../components/Helpers';
import ShowMore from '../../components/Loading/More';
import GS, {RText} from '../../GlobeStyle';
import Loading from './Loading';
import {userReviews as userReviewsText} from '../../constants/staticText';
import ReviewOptionsModal from '../../containers/ReviewOptionsModal';
import ReviewModal from '../../containers/ReviewModal';
import ImagesModal from '../../containers/ImagesModal';

const ViewportAware = Viewport.Aware(ShowMore);

const UserReviews = ({navigation, route, ...props}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [viewReview, setViewReview] = useState(null);
  const [images, setImages] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState({
    doFetchMore: false,
    isFetchingMore: false,
  });

  const {refetch, fetchMore} = useQuery(GET_USER_REVIEWS, {
    variables: {
      filter: {
        cursor: null,
        limit: 10,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {     
      setReviews(data.getReviewsByUserID);
    },
    onError: (err) => {},
  });

  const [deleteReview] = useMutation(DELETE_REVIEW);
  const [likeReview] = useMutation(LIKE_REVIEW);
  const [unlikeReview] = useMutation(UNLIKE_REVIEW);

  const fetchMoreBookmarks = () => {
    const updateQuery = (previousResult, {fetchMoreResult}) => {
      const newCursor = fetchMoreResult.getReviewsByUserID.nextCursor;
      const newNext = fetchMoreResult.getReviewsByUserID.next;
      const newData = fetchMoreResult.getReviewsByUserID.data;
      const clonedState = deepClone(reviews);
      const newList = clonedState.data.concat(newData);

      clonedState.data = newList;
      clonedState.nextCursor = newCursor;
      clonedState.next = newNext;
      setReviews(clonedState);

      setState({
        doFetchMore: false,
        isFetchingMore: false,
      });

      return {
        getReviewsByUserID: {
          data: previousResult.getReviewsByUserID.data.concat(newData),
          nextCursor: newNext,
          next: newNext,
        },
      };
    };

    const filter = {
      cursor: reviews.nextCursor,
      limit: 4,
    };

    fetchMore({variables: {filter}, updateQuery});
  };

  useEffect(() => {
    if (
      state.doFetchMore &&
      state.isFetchingMore === false &&
      reviews &&
      reviews.next
    ) {
      setState({
        ...state,
        isFetchingMore: true,
      });
      fetchMoreBookmarks();
    }
  }, [state]);

  const updateReviewOnList = async (reviewId, reviewIndex, newData) => {
    try {
      //TODO: fins a better way to render the images, we need to wait for s3 to upload them first before we can show it else it will error and not render
      setReviews((state) => {
        const clonedState = deepClone(state);

        clonedState.data[reviewIndex] = {
          ...clonedState.data[reviewIndex],
          ...newData,
        };

        return clonedState;
      });
    } catch (err) {}
  };

  const removeReviewFromList = (reviewId, reviewIndex) => {
    setReviews((state) => {
      const clonedState = deepClone(state);
      clonedState.data.splice(reviewIndex, 1);
      return clonedState;
    });
  };

  const deleteSelectedReview = async () => {
    try {
      await deleteReview({
        variables: {
          reviewID: selectedReview._id,
        },
      });
      removeReviewFromList(selectedReview._id, selectedReview.reviewIndex);
    } catch (err) {}
  };

  const viewImages = (images) => {
    setImages(images);
  };

  const clearImages = () => {
    setImages(null);
  };
  
  const likeSelectedReview = async (rid) => {
    try {
      const reviewId = rid ? rid : selectedReview._id;
      const userId = auth().currentUser.uid;

      const {data} = likeReview({
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
        userId: userId,
      });
      setReviews(clonedState);
      if (viewReview && viewReview._id === clonedState.data[reviewIndex]._id) {
        const reviewClone = deepClone(viewReview);
        reviewClone.likes.push({
          userId: userId,
        });
        setViewReview(reviewClone);
      }
      return true;
    } catch (err) {
    }
  };

  const unlikeSelectedReview = async (rid) => {
    try {
      const reviewId = rid ? rid : selectedReview.id;
      const userId = auth().currentUser.uid;
      const {data} = unlikeReview({
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
    } catch (err) {
    }
  };

  const toggleDialog = (review, reviewIndex) => {
    setOpenDialog(true);
    setSelectedReview({...review, reviewIndex});
  };

  const onRefresh = async () => {
    try{
      await refetch();
    }catch(error){
    }
  };

  const renderReviews =
    reviews &&
    reviews.data.length > 0 &&
    reviews.data.map((review, index) => {
      return (
        <ReviewCard
          withUserName={false}
          key={review._id}
          index={index}
          review={review}
          doesReviewBelongToUser={true}
          toggleDialog={toggleDialog}
          viewImages={viewImages}
          onViewReview={setViewReview}
          withActions={false}
        />
      );
    });

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;



  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: statusBarHeight,
        backgroundColor: '#fff',
      }}>
      <Header goBack={() =>navigation.goBack()} title="My Reviews" />
      <Viewport.Tracker>
        <ScrollView
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);

                onRefresh()
                .finally(() => {
                  setRefreshing(false);
                });
              }}
            />
          }
          contentContainerStyle={{paddingHorizontal: 15, flexGrow: 1}}>
          {renderReviews}
          {reviews && reviews.next && (
            <ViewportAware
              onViewportEnter={() => {
                if (state.isFetchingMore === false) {
                  setState({
                    ...state,
                    doFetchMore: true,
                  });
                }
              }}
              style={{
                justifyContent: 'center',
                marginHorizontal: 20,
                marginBottom: 20,
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 10,
              }}
            />
          )}
          {!reviews && <Loading />}
          {reviews && reviews.data.length <= 0 && <Empty />}
        </ScrollView>
      </Viewport.Tracker>
      <ImagesModal images={images} clearImages={clearImages} />

      {openDialog && (
        <ReviewOptionsModal
          displayDialog={openDialog}
          setDisplayDialog={setOpenDialog}
          setSelectedReview={setSelectedReview}
          deleteSelectedReview={deleteSelectedReview}
          selectedReview={selectedReview}
          reviews={reviews}
          overRideUpdateEvent={() => {
            navigation.navigate('Update Review', {
              ...reviews.data[selectedReview.reviewIndex],
                cameFrom: (args) => {
                updateReviewOnList(null, selectedReview.reviewIndex, args.data.updateReview);
                navigation.goBack();
                navigation.setParams({cameFrom: null});
              },
            });
          }}
         
        />
      )}
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
    </SafeAreaView>
  );
};

export default UserReviews;

const Empty = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <RText>{userReviewsText.empty.title}</RText>
      <RText>{userReviewsText.empty.message}</RText>
    </View>
  );
};
