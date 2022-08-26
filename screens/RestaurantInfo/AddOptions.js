import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { RText } from '../../GlobeStyle';
import {
  withBookmarkHook,
  mapBookmarkStateToProps,
  mapBookmarkDispatchToProps,
} from '../../components/Helpers';
import { StarBlackLine, CameraBlack } from '../../assets/svg';
import { Bookmark, BookmarkSelected } from '../../assets/images';
import ShareButton from '../../components/ShareButton';

const AddOptions = ({
  _id,
  style,
  navigation,
  user,
  comingSoon,
  onAddBookMark,
  onRemoveBookMark,
}) => {
  const bookmarks = user ? user.bookmarks : null;

  const toggleBookmark = () => {
    if (bookmarks && bookmarks[_id]) {
      onRemoveBookMark();
    } else {
      onAddBookMark(() => {
        navigation.navigate('Account');
      });
    }
  };

  return (
    <View style={style.addOptionsContainer}>
      <View style={style.addOptions}>
        {!comingSoon && (
          <AddOptionsButton
            style={style}
            text="Add Review"
            svg={StarBlackLine}
            onPress={() =>
              navigation.navigate('Add Review', {
                id: _id,
              })
            }
          />
        )}
        {!comingSoon && (
          <AddOptionsButton
            style={style}
            text="Add Photo"
            svg={CameraBlack}
            onPress={() =>
              navigation.navigate('Gallery', {
                id: _id,
              })
            }
          />
        )}
        <AddOptionsButton
          style={style}
          text={bookmarks && bookmarks[_id] ? 'Bookmarked' : 'Bookmark'}
          imageSrc={bookmarks && bookmarks[_id] ? BookmarkSelected : Bookmark}
          onPress={toggleBookmark}
        />
        <ShareButton />
      </View>
    </View>
  );
};

const AddOptionsButton = (
  /** @type {{ text: string; style?: any; onPress: any; imageSrc?: any; svg?: any; }} */
  { style, text, svg: SVG, imageSrc, onPress }) => (
  <TouchableOpacity style={style.addOptionsButton} onPress={onPress}>
    {imageSrc && (
      <View
        style={{
          overflow: 'hidden',
          height: 20,
          width: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Image
          source={imageSrc}
          style={[style.addOptionsImage, { marginBottom: 0 }]}
        />
      </View>
    )}
    {SVG && <SVG height={20} width={20} style={style.addOptionsImage} />}
    <RText style={style.addOptionsText}> {text} </RText>
  </TouchableOpacity>
);

export default connect(
  mapBookmarkStateToProps,
  mapBookmarkDispatchToProps,
)((props) => withBookmarkHook({ ...props, comp: AddOptions }));
