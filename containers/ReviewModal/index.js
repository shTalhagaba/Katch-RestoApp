/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  FlatList,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from 'react-native';

//3rd party
import { useMutation,useQuery } from '@apollo/client'
import auth from '@react-native-firebase/auth';
import IIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import SIIcon from 'react-native-vector-icons/SimpleLineIcons';

//others
import GS, {RText, normalizedFontSize, customFont} from '../../GlobeStyle';
import {StarRedBox, LikeButton, PositiveLikeGray} from '../../assets/svg';
import {generateReviewImgScr, getTimeFromNow} from '../../components/Helpers';
import {
  UPDATE_COMMENT,
  GET_STORE_REVIEWS,
  DELETE_COMMENT,
  GET_COMMENTS_BY_REVIEWID,
  ADD_COMMENT
} from '../../components/GraphQL';
import Stars from '../../components/Stars';
import {Tags} from '../../components/ReviewCard';
import Loading from '../../components/Loading/More';

const windowWidth = Dimensions.get('window').width;

//show seller tags as selectable tags on both sides of the field
//if selected in positive remove from negative
const ReviewModal = (props) => {
  const navigation = useNavigation();
  const {
    viewImages,
    viewReview,
    setViewReview,
    unlikeSelectedReview,
    likeSelectedReview,
    images,
  } = props;
  const _review = viewReview;
  const [comments, setComments] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [isLikeInProgress, setIsLikeInProgress] = useState(false);
  const [isCommentInProgress, setIsCommentInProgress] = useState(false);
  const [openDialogProp, setOpenDialogProp] = useState(null);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const [submitComment] = useMutation(ADD_COMMENT);

  const ScrollRef = useRef();

  const saveComment = async (comment) => {
    try {
      const review = await submitComment({
        variables: {
          reviewCommentInput: {
            rid: _review._id,
            comment: comment,
          },
        },
      });
      if (!review) {
        throw new Error('comment not saved');
      }
      return review.data.addReviewComment;
    } catch (err) {
    }
  };

  const [updateComment] = useMutation(UPDATE_COMMENT, {
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

  const [deleteComment] = useMutation(DELETE_COMMENT);
  const {loading, data, refetch} = useQuery(GET_COMMENTS_BY_REVIEWID, {
    notifyOnNetworkStatusChange: true,
    variables: {reviewId: _review._id},
  });

  useEffect(() => {
    if (data && data.getCommentsByReviewID) {
      setComments([...data.getCommentsByReviewID]);
    }
  }, [data, loading]);

  const onUpdateComment = async (comment) => {
    try {
      Keyboard.dismiss();

      setIsCommentInProgress(true);
      await updateComment({
        variables: {
          reviewCommentInput: {
            _id: selectedComment._id,
            rid: _review._id,
            comment: commentInput,
          },
        },
      });
      setComments((state) => {
        state[selectedComment.index].comment = commentInput;
        return state;
      });
      refetch({
        reviewId: _review._id,
      });
      setCommentInput('');
      setSelectedComment(null);
    } finally {
      setIsCommentInProgress(false);
    }
  };

  const addComment = async () => {
    try {
      Keyboard.dismiss();
      setIsCommentInProgress(true);
      const newComments = await saveComment(commentInput, _review._id);
      setCommentInput('');
      if (_review._id === newComments._id) {
        refetch({
          reviewId: _review._id,
        });
        setTimeout(() => {
          ScrollRef.current.scrollToEnd();
        }, 100);
      }
    } finally {
      setIsCommentInProgress(false);
    }
  };

  const onDeleteComment = async (cid, index) => {
    try {
      await deleteComment({
        variables: {
          deleteReviewInput: {
            _id: cid,
            rid: _review._id,
          },
        },
      });
      setCommentInput('');
      setComments([...comments.slice(0, index), ...comments.slice(index + 1)]);
      setOpenDialogProp(null);
    } catch (error) {}
  };

  const userId = auth().currentUser;

  const closeModal = () => {
    setViewReview(null);
  };

  const timeFromNow = getTimeFromNow(_review.createdDate);

  const didUserLikeReview = userId
    ? _review.likes.findIndex((like) => like.userId === userId.uid) !== -1
    : false;
  const likeAction = async () => {
    try {
      setIsLikeInProgress(true);

      if (userId) {
        if (didUserLikeReview) {
          await unlikeSelectedReview(_review);
        } else {
          await likeSelectedReview(_review);
        }
      } else {
        navigation.navigate('Account');
      }
    } finally {
      setIsLikeInProgress(false);
    }
  };

  const toggleCommentDialog = (comment, index) => {
    if (comment) {
      setOpenDialogProp({...comment, index});
    } else {
      setOpenDialogProp(null);
    }
  };

  const cancelUpdate = () => {
    setIsUpdateInProgress(false);
    setSelectedComment(null);
    setCommentInput('');
  };

  return (
    <Modal
      onShow={() => {
        refetch();
      }}
      animationType="slide"
      transparent={true}
      visible={!!viewReview && !images}
      onRequestClose={closeModal}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          behavior={Platform.OS === 'ios' ? "padding" : null}>
          {!!viewReview && (
            <>
              <TouchableOpacity
                activeOpacity={1}
                onPress={closeModal}
                style={style.backgroundBackButton}
              />
              <View style={style.container}>
                <TouchableOpacity
                  onPress={closeModal}
                  style={style.closeButton}>
                  <IIcon name="close" size={30} color="#000" />
                </TouchableOpacity>
                <ScrollView
                  scrollEventThrottle={16}
                  ref={ScrollRef}
                  contentContainerStyle={style.reviewInnerContainer}>
                  <View style={style.reviewHeader}>
                    <RText>
                      {_review.displayName} wrote a {_review.rating} star review
                    </RText>
                    <Stars
                      rating={_review.rating}
                      component={StarRedBox}
                      starHeight={20}
                      starWidth={20}
                      withTextRating={true}
                      containerStyle={style.starContainerStyle}
                      starStyle={style.starStyle}
                      textStyle={style.starTextStyle}
                    />
                  </View>
                  <Tags list={_review.tags} sentiment="positive" />
                  <Tags list={_review.tags} sentiment="negative" />
                  <RText>{_review.review}</RText>
                  <Images list={_review.images} viewImages={viewImages}/>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <RText style={style.timeFromNow}>{timeFromNow}</RText>
                    {_review.likes.length > 0 && (
                      <RText style={style.timeFromNow}>
                        {_review.likes.length} likes
                      </RText>
                    )}
                  </View>

                  <View style={style.actionsContainer}>
                    <TouchableOpacity
                      disabled={isLikeInProgress}
                      style={[style.actionsButton, {opacity: 1}]}
                      onPress={likeAction}>
                      {didUserLikeReview ? (
                        <PositiveLikeGray height={18} width={18} />
                      ) : (
                        <LikeButton height={18} width={18} />
                      )}

                      {isLikeInProgress ? (
                        <ActivityIndicator
                          color={GS.logoYellow}
                          style={{marginLeft: 5}}
                        />
                      ) : (
                        <RText style={style.actionsButtonText}>
                          {didUserLikeReview ? 'Liked' : 'Like'}
                        </RText>
                      )}
                    </TouchableOpacity>
                  </View>
                  {comments ? (
                    <Comments
                      list={comments}
                      toggleCommentDialog={toggleCommentDialog}
                    />
                  ) : (
                    <Loading style={style.commentsLoading} />
                  )}
                </ScrollView>
                <View
                  enabled
                  behavior="padding"
                  style={[style.commentContainer]}>
                  <View style={style.textInputContainer}>
                    <TextInput
                      autoFocus={_review.focusInput}
                      editable={isCommentInProgress === false || isUpdateInProgress === false}
                      onChangeText={(text) => {
                        setCommentInput(text);
                      }}
                      value={commentInput}
                      style={style.textInput}
                      placeholder="Comment"
                      multiline={true}
                      maxLength={1000}
                    />
                  </View>
                  <View style={style.sendButton}>
                    <TouchableOpacity
                      onPress={
                        selectedComment ? onUpdateComment : addComment
                      }
                      disabled={isCommentInProgress || isUpdateInProgress}>
                      {isCommentInProgress ? (
                        <ActivityIndicator color={GS.logoYellow} />
                      ) : (
                        <IIcon name="send" size={20} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {selectedComment && <View style={style.sendButton}>
                    <TouchableOpacity
                      onPress={cancelUpdate}
                      disabled={isCommentInProgress || isUpdateInProgress}>
                      <IIcon name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>}
                </View>
              </View>
              {openDialogProp && (
                <OptionDialog
                  selectedComment={selectedComment}
                  setSelectedComment={setSelectedComment}
                  setCommentInput={setCommentInput}
                  toggleCommentDialog={toggleCommentDialog}
                  setOpenDialogProp={setOpenDialogProp}
                  openDialog={openDialogProp}
                  onDeleteComment={onDeleteComment}
                  updateComment={updateComment}
                />
              )}
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const Comments = (props) => {
  const {list, toggleCommentDialog} = props;
  const user = auth().currentUser;
  return list && list.length > 0 ? (
    <View style={style.commentContainer2}>
      {list.map((comment, index) => {
        const belongsToUser = user ? user.uid === comment.uid : false;

        return (
          <View key={comment._id}>
            <RText style={style.commentDisplayName}>
              {comment.displayName}{' '}
              <RText
                fontName={customFont.axiformaBook}
                style={{
                  fontSize: normalizedFontSize(5),
                  color: '#999',
                }}>
                {' '}
                (Commented)
              </RText>
            </RText>
            <RText style={style.comment}>{comment.comment}</RText>
            {belongsToUser && (
              <TouchableOpacity
                onPress={() => {
                  toggleCommentDialog(comment, index);
                }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 10,
                  padding: 5,
                }}>
                <SIIcon name="options-vertical" size={15} />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  ) : (
    <View style={style.noCommentsContainer}>
      <RText>No Comments</RText>
    </View>
  );
};

const Images = ({list, viewImages}) => {
  return (
    list.length > 0 && (
      <FlatList
        horizontal
        data={list}
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
                  viewImages({list, index});
                }}>
                <Image
                  source={{uri: generateReviewImgScr(image)}}
                  style={style.imageReview}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    )
  );
};

const OptionDialog = (props) => {
  const {
    openDialog,
    setOpenDialogProp,
    onDeleteComment,
    setCommentInput,
    setSelectedComment,
    toggleCommentDialog,
  } = props;

  const [deleteInProgress, setDeleteInProgress] = useState(false);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        disabled={deleteInProgress}
        activeOpacity={1}
        onPress={() => setOpenDialogProp(null)}
        style={style.backgroundBackButton}
      />
      <View
        style={{
          padding: 10,
          backgroundColor: '#fff',
          borderRadius: 10,
        }}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            minWidth: '80%',
          }}>
          <TouchableOpacity
            disabled={deleteInProgress}
            onPress={() => {
              setCommentInput(openDialog.comment);
              setSelectedComment(openDialog);
              toggleCommentDialog();
            }}
            style={{
              width: '100%',
              backgroundColor: '#fff',
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              borderRadius: 7,
            }}>
            <RText>Update</RText>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={deleteInProgress}
            onPress={() => {
              setDeleteInProgress(true);
              onDeleteComment(openDialog._id, openDialog.index)
                .catch((_) => {
                  setDeleteInProgress(false);
                });
            }}
            style={{
              width: '100%',
              backgroundColor: GS.logoRed,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 7,
            }}>
            {deleteInProgress ? (
              <ActivityIndicator color={GS.logoYellow} />
            ) : (
              <RText style={{color: '#fff'}}>Delete</RText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReviewModal;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '20%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingTop: 35,
  },
  backgroundBackButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000020',
  },
  closeButton: {
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 10,
  },
  commentContainer: {
    // marginTop: 'auto',
    flexDirection: 'row',
    maxWidth: windowWidth,
    backgroundColor: GS.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textInputContainer: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  sendButton: {
    flex: 0.1,
    marginLeft: 10,
    backgroundColor: GS.logoGreen,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    height: 40,
    width: 40,
    borderRadius: 25,
  },
  starContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  starStyle: {
    marginRight: 3,
  },
  starTextStyle: {
    marginLeft: 4,
  },
  reviewHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#cccccc',
  },
  reviewInnerContainer: {
    marginHorizontal: 30,
  },
  imageContainer: {
    marginTop: 15,
    paddingVertical: 2,
  },
  imageButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 10,
  },
  imageReview: {
    height: 70,
    width: 70,
    borderRadius: 10,
  },
  actionsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#cccccc',
    marginTop: 10,
    flexDirection: 'row',
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
  commentContainer2: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  commentDisplayName: {
    fontSize: normalizedFontSize(8),
  },
  comment: {
    marginVertical: 10,
    fontSize: normalizedFontSize(6),
    marginLeft: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 5,
    borderColor: '#cccccc',
    marginRight: 20,
    lineHeight: 18,
  },
  timeFromNow: {
    fontSize: normalizedFontSize(5),
    marginTop: 15,
  },
  commentsLoading: {
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  noCommentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
});
