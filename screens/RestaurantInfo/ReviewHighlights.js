import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {BoldText, RText} from '../../GlobeStyle';
import SellerTag from './Tag';

const ReviewHighlights = ({tags, storeId, style,navigation}) => {
  return (
    <View style={style.reviewHighlightsOuter}>
      <View style={style.reviewHighlightsInner}>
        <View style={style.reviewHighlightsHeader}>
          <BoldText>Review Highlights</BoldText>
          <TouchableOpacity onPress={()=>navigation.navigate('AllReviews', {id: storeId})}>
            <RText style={style.reviewHighlightsHeaderText}>
              See all &gt;&gt;
            </RText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...style.reviewHighlightsHeader,
            ...style.reviewHighlightsBestSellingHeader,
          }}>
          <RText style={style.reviewHighlightsBestSellingText}>
            People say this place is known for
          </RText>
          <View style={style.reviewHighlightsTagsContainer}>
            {tags
              ? tags
                  .slice(0, 10)
                  .map((tag) => (
                    <SellerTag
                      key={tag}
                      text={tag}
                      tagContainer={style.tagContainer}
                      tagText={style.tagText}
                    />
                  ))
              : null}
          </View>
        </View>
      </View>
    </View>
  );
};
export default ReviewHighlights;
