import React from 'react';
import { DEFAULT_REST_IMG } from '../../assets/images';
import ProgressiveImage from '../../components/ProgressiveImage';
import { generateImgScr } from '../../components/Helpers';
import { View } from 'react-native';
import StoreInfo from '../../components/StoreInfo';
import { BoldText } from '../../GlobeStyle';

const RestaurantHeader = ({ storeInfo, style }) => (
  <View>
    <View style={{ height: 175 }} />
    <ProgressiveImage
      grayscaleAmount={storeInfo.comingSoon ? 1 : storeInfo.isOpen ? 0 : 1}
      containerStyle={style.mainImage}
      fallBackImage={DEFAULT_REST_IMG}
      source={generateImgScr(storeInfo._id, storeInfo.image)}>
      {(!storeInfo.isOpen || storeInfo.comingSoon) && (
        <View style={style.closedMessageContainer}>
          <BoldText style={{ fontSize: 30, color: '#fff' }}>
            {storeInfo.comingSoon ? 'Coming Soon' : 'Closed'}
          </BoldText>
        </View>
      )}
    </ProgressiveImage>
    <View style={[style.infoContainer, { marginTop: 75 }]}>
      <StoreInfo withReviews={true} info={storeInfo} />
    </View>
  </View>
);

export default RestaurantHeader;
