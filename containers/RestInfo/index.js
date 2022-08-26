import React, { memo, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

//3rd party

//others
import { BoldText } from '../../GlobeStyle';
import { generateImgScr } from '../../components/Helpers';
import ProgressiveImage from '../../components/ProgressiveImage';
import { DEFAULT_REST_IMG } from '../../assets/images';
import PromoList from '../RestPromoList';
import StoreInfo from '../../components/StoreInfo';
import withContext, {
  Provider as RestaurantProvider,
  Context
} from '../../context/restaurant';

const ListHeaderComponent = (props) => {
  const { storeInfo, promoCodes } = props;
  const { preloadProductImages } = useContext(Context);

  return (
    <>
      <View style={{ marginBottom: 10 }}>
        <View>
          <View style={{ height: 175 }} />
          <ProgressiveImage
            onImageCallBack={preloadProductImages}
            grayscaleAmount={
              storeInfo.comingSoon ? 1 : storeInfo.isOpen ? 0 : 1
            }
            containerStyle={style.mainImage}
            fallBackImage={DEFAULT_REST_IMG}
            source={generateImgScr(storeInfo._id, storeInfo.image)}>
            {(!storeInfo.isOpen ||
              storeInfo.comingSoon ||
              storeInfo.busyMode) && (
              <View style={style.closedMessageContainer}>
                <BoldText style={{ fontSize: 30, color: '#fff' }}>
                  {storeInfo.comingSoon
                    ? 'Coming Soon'
                    : storeInfo.busyMode
                    ? 'Busy'
                    : 'Closed'}
                </BoldText>
              </View>
            )}
          </ProgressiveImage>
          <View style={style.infoContainer}>
            <StoreInfo withReviews={true} info={storeInfo} />
          </View>
        </View>
      </View>
      {!storeInfo.comingSoon && (
        <PromoList promoCodes={promoCodes} showNotUseable={true} />
      )}
    </>
  );
};

const style = StyleSheet.create({
  mainImage: {
    width: '100%',
    height: '70%',
    maxHeight: 300,
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: -20,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoContainer: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 75,
  },
  closedMessageContainer: {
    flex: 1,
    backgroundColor: '#00000040',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});



export default memo(ListHeaderComponent);
