import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

//3rd party
// import {TouchableOpacity} from 'react-native-gesture-handler';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import auth from '@react-native-firebase/auth';

//others
import {capitalizeFirstLetter, generateReviewImgScr, getTimeFromNow} from '../Helpers';
import {normalizedFontSize, RText} from '../../GlobeStyle';
import {
  LikeButton,
  PositiveLikeGray,
  NegativeLikeGray,
  CommentBlackLine,
  StarRedBox,
} from '../../assets/svg';
import Stars from '../Stars';

const ReviewCard = (props) => {
  const {
    review,
    index,
    doesReviewBelongToUser,
    toggleDialog,
    unlikeSelectedReview,
    likeSelectedReview,
    viewImages,
    onCommentButtonClicked,
    navigation,
    onViewReview,
    withActions = true,
    withUserName = true
  } = props;
  const [like, setLike] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    const {likes} = review;
    if (currentUser) {
      setLike(
        currentUser
          ? likes.findIndex((_like) => _like.userId === currentUser.uid) !== -1
          : false,
      );
      setLoadingLike(false);
    }
  }, [review]);

  const commentAction = () => {
    onCommentButtonClicked(review);
  };

  const likeAction = () => {
    setLoadingLike(true);
    if (like) {
      unlikeSelectedReview(review);
    } else {
      likeSelectedReview(review);
    }
   
  };

  const viewReviewAction = () => {
    onViewReview(review)
  };

  const timeFromNow = getTimeFromNow(review.createdDate);

  return (
    <View style={style.container}>
      <TouchableOpacity onPress={viewReviewAction}>
        <RText style={style.displayName}>
          {withUserName && `${review.displayName} wrote a ${review.rating} star review`}
          {review.edited && (
            <RText style={{color: 'gray', fontSize: normalizedFontSize(5)}}>
              {' '}
              (edited)
            </RText>
          )}
          {review.status !== 'Approved' && (
            <RText style={{color: 'gray', fontSize: normalizedFontSize(5)}}>
              {' '}
              {withUserName && '-'} {review.status}
            </RText>
          )}
        </RText>
        <Stars
          withTextRating={true}
          textStyle={style.starText}
          rating={review.rating}
          component={StarRedBox}
          starStyle={style.starStyle}
          starHeight={18}
          starWidth={18}
          containerStyle={style.starContainer}
        />
        <View style={style.reviewContainer}>
          <Tags list={review.tags} sentiment="positive" />
          <Tags list={review.tags} sentiment="negative" />
          <RText style={style.reviewText}>{review.review}</RText>
          {review.images.length > 0 && (
            <FlatList
              horizontal
              data={review.images}
              keyExtractor={(item, index) => item + index}
              contentContainerStyle={style.imageContainer}
              contentOffset={{x: 10, y: 20}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                const image = item;
                return (
                <View style={style.imageButton}>
                    <TouchableOpacity
                      onPress={() => {
                        viewImages({list: review.images, index});
                      }}>
                      <Image
                        source={{uri: generateReviewImgScr(image)}}
                        style={style.imageReview}
                        onError={({nativeEvent}) => {

                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      </TouchableOpacity>

      {doesReviewBelongToUser && (
        <TouchableOpacity
          style={style.optionsButton}
          disabled={!doesReviewBelongToUser}
          onPress={() => {
            toggleDialog(review, index);
          }}>
          <SLIcon name="options-vertical" size={20} />
        </TouchableOpacity>
      )}

   
      <View style={{
         flexDirection:'row',
         justifyContent:'space-between'
      }}>
      <RText style={style.timeFromNow}>{timeFromNow}</RText>
        {review.likes.length > 0 && <RText style={style.timeFromNow}>{review.likes.length} likes</RText>}
      </View>
      {withActions && <View style={style.actionsContainer}>
        <TouchableOpacity
          disabled={loadingLike}
          style={[style.actionsButton, {opacity: loadingLike ? 0.7 : 1}]}
          onPress={likeAction}>
          {like ? (
            <PositiveLikeGray height={18} width={18} />
          ) : (
            <LikeButton height={18} width={18} />
          )}
          <RText style={style.actionsButtonText}>
            {like ? 'Liked' : 'Like'}
          </RText>
        </TouchableOpacity>
        <TouchableOpacity style={style.actionsButton} onPress={commentAction}>
          <CommentBlackLine height={18} width={18} />
          <RText style={style.actionsButtonText}>Comment</RText>
        </TouchableOpacity>
      </View>}
    </View>
  );
};

export const Tags = ({list, sentiment = 'negative'}) => {
  const tagsList = list.filter((tag) => tag.sentiment === sentiment);

  const Icon = sentiment === 'negative' ? NegativeLikeGray : PositiveLikeGray;
  return (tagsList.length > 0 &&
    <View style={style.tagsContainer}>
      <View style={style.tagsHeader}>
        <Icon height={20} width={20} />
        <RText style={style.tagsTitle}>
          {capitalizeFirstLetter(sentiment)}
        </RText>
      </View>
      <View style={style.tagsInnerContainer}>
        {tagsList.map((tag, index) => {
          return (
            <View key={tag.name + index} style={style.tagsParentContainer}>
              <RText style={style.tagsText}>{tag.name}</RText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#ccc',
    marginHorizontal: -15,
  },
  displayName: {
    fontSize: normalizedFontSize(6),
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  starStyle: {
    marginRight: 2,
  },
  starText: {
    marginLeft: 5,
    fontSize: normalizedFontSize(6),
  },
  reviewContainer: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#cccccc',
  },
  reviewText: {
    fontSize: normalizedFontSize(5.5),
    lineHeight: 15,
  },
  imageContainer: {
    paddingVertical: 10,
  },
  imageButton: {
    height: 70,
    width: 70,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imageReview: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#cccccc',
    marginHorizontal: -25,
  },
  actionsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionsButtonText: {
    marginLeft: 10,
    fontSize: normalizedFontSize(6),
  },
  optionsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 20,
  },
  tagsContainer: {
    marginTop: 10,
    marginBottom: 15
  },
  tagsInnerContainer: {
    flexDirection:'row',
    flexWrap: 'wrap',
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsTitle: {
    fontSize: normalizedFontSize(6),
    color: '#666',
    marginLeft: 10,
  },
  tagsParentContainer: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666'
  },
  tagsText: {
    fontSize: normalizedFontSize(6),
  },
  timeFromNow: {
    fontSize: normalizedFontSize(5),
    marginBottom: 10
  }
});

export default ReviewCard;
