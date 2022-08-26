import { Viewport } from '@skele/components';
import moment from 'moment';
import React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { DEFAULT_REST_IMG } from '../../assets/images';
import {
  BoldText,
  customFont,
  normalizedFontSize,
  RText,
} from '../../GlobeStyle';
import { generateCouponImgScr } from '../Helpers';
import ProgressiveImage from '../ProgressiveImage';
import styles from './style';

const screenWidth = Dimensions.get('window').width - 30;

const Placeholder = () => <View style={styles.placeholder} />;

const ViewportAwareImage = Viewport.Aware(
  Viewport.WithPlaceholder(ProgressiveImage, Placeholder),
);
const CouponCard = (props) => {
  const { coupon, navigation } = props;
  const onPress = () => {
    navigation.navigate('CouponDetail', {
      _id: coupon._id,
      coupon,
      headerTitle: coupon.name || 'Coupon',
    });
  };
  const calculatePercent = (a, b) => {
    return Math.floor(((a - b) / a) * 100) + '%';
  };
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.flex1}>
          <View style={[styles.imageWrapper, styles.maxH110]}>
            <ViewportAwareImage
              removeOnError={false}
              source={generateCouponImgScr(
                coupon._id,
                coupon.mainImage,
              )}
              preTriggerRatio={0.5}
              retainOnceInViewport={false}
              fallBackImage={DEFAULT_REST_IMG}
              containerStyle={[styles.containerStyle]}
              resizeMode="cover"
            />
          </View>
          <View style={styles.textWrapper}>
            <View style={styles.discountLabelWrapper}>
              <RText style={styles.discountLabel}>
                {calculatePercent(coupon.beforePrice, coupon.afterPrice)}
              </RText>
              <RText
                style={[
                  styles.discountLabel,
                  { fontSize: normalizedFontSize(5) },
                ]}>
                OFF
              </RText>
            </View>
            <View style={[styles.flexRow]}>
              <RText style={styles.cpricel}>{'Coupon Price: '}</RText>
              <BoldText style={styles.strikeprice}>
                {coupon.beforePrice} {'KD'}
              </BoldText>
              <BoldText style={styles.cprice}>
                {coupon.afterPrice} {'KD'}
              </BoldText>
            </View>

            <RText
              fontName={customFont.axiformaBold}
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail">
              {coupon.name}
            </RText>

            <RText
              style={styles.description}
              numberOfLines={2}
              ellipsizeMode="tail">
              {coupon.shortDescription || coupon.description}
            </RText>
            {coupon.endDate && (
              <View style={styles.pv2}>
                <RText style={styles.expireLabel}>
                  Expires:{' '}
                  <RText
                    style={[styles.expireText, styles.pv2]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {moment(coupon.endDate).format('DD MMM YYYY')}
                  </RText>
                </RText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CouponCard;
