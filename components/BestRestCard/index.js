/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';

//3rd party
import { connect } from 'react-redux';

//others
import {
  DEFAULT_REST_IMG,
  LOCATION_PIN_GREEN_OUTLINE,
  TTP,
  Bookmark,
  BookmarkSelected,
  DELIVERY_FEE,
  MIN_ORDER,
} from '../../assets/images';
import { generateImgScr, getOpensAt } from '../Helpers';
import ProgressiveImage from '../ProgressiveImage';
import GS, {
  BoldText,
  RText,
  normalizedFontSize,
  customFont,
  priceSymbol,
} from '../../GlobeStyle';
import {
  distance as getDistance,
  withBookmarkHook,
  mapBookmarkStateToProps,
  mapBookmarkDispatchToProps,
} from '../Helpers';
import Rating from '../Rating';
import Ribbon from '../Ribbon';
import { Viewport } from '@skele/components';
import moment from 'moment';

const Placeholder = () => (
  <View
    style={{
      minWidth: 110,
      width: '100%',
      height: '100%',
      minHeight: 200,
      maxHeight: '50%',
      backgroundColor: GS.placeHolderColor,
    }}
  />
);

const ViewportAwareImage = Viewport.Aware(
  Viewport.WithPlaceholder(ProgressiveImage, Placeholder),
);
class RestCard extends Component {
  onPress = () => {
    if (this.props.onClick) {
      this.props.onClick();
    } else {
      this.props.navigation.navigate('Rest', {
        screen: this.props?.navigationScreen || 'Menu',
        id: this.props._id,
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const storeId = this.props._id;

    if (
      this.props.user.bookmarks[storeId] !== nextProps.user.bookmarks[storeId]
    ) {
      return true;
    }

    if (nextState.tagsHeight !== null) {
      return true;
    }

    return false;
  }
  state = {
    tagsHeight: null,
  };

  onAddBookMark = () => {
    this.props.onAddBookMark(() => {
      this.props.navigation.navigate('Account');
    });
  };

  render() {
    const {
      _id,
      image,
      ttp,
      shopName,
      address,
      rating,
      reviewsCount,
      category,
      distance,
      isOpen,
      userLoc,
      location,
      tags,
      promoCodes,
      onAddBookMark,
      onRemoveBookMark,
      user,
      onClick,
      deliveryService = null,
      deliveryETA,
      comingSoon,
      busyMode,
      hasCoupons,
      minDeliveryOrderValue,
      deliveryRadius,
      showETA,
      storeHours,
    } = this.props;

    const opening = storeHours?.opening;

    const isDeliveryMode = deliveryService === 'Delivery' || deliveryService === 'delivery';

    return (
      <View style={style.mainCard}>
        <View style={style.saveIcon}>
          <TouchableOpacity
            onPress={
              user.bookmarks[_id] ? onRemoveBookMark : this.onAddBookMark
            }>
            <Image
              style={style.saveImage}
              source={user.bookmarks[_id] ? BookmarkSelected : Bookmark}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.onPress} style={style.cardClick}>
          <ViewportAwareImage
            grayscaleAmount={comingSoon || busyMode ? 1 : isOpen ? 0 : 1}
            source={generateImgScr(_id, image, Dimensions.get('window').width)}
            fallBackImage={DEFAULT_REST_IMG}
            containerStyle={style.restImage}
            resizeMode="cover">
            {(!isOpen || comingSoon || busyMode) && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#00000070',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}>
                <BoldText style={{ fontSize: 30, color: '#fff' }}>
                  {comingSoon
                    ? 'Coming Soon'
                    : busyMode
                    ? 'Busy'
                    : getOpensAt(opening, isOpen)}
                </BoldText>
              </View>
            )}
            {promoCodes && promoCodes.length > 0 ? (
              <Ribbon promos={promoCodes} />
            ) : null}
          </ViewportAwareImage>

          {/* info container*/}
          <View style={style.infoContainer}>
            <View>
              <RText
                fontName={customFont.axiformaMedium}
                style={style.cardTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {shopName}
              </RText>
            </View>
            {/* REST INFO */}
            <View style={{ flexDirection: 'column' }}>
            <View style={style.mainRow}>
                <View style={style.KACol}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 8,
                      height: this.state.tagsHeight
                        ? this.state.tagsHeight
                        : 'auto',
                      flexWrap: 'wrap',
                      overflow: 'hidden',
                    }}>
                    {/* to keep all cards height equal */}
                    {tags.length < 1 && <View style={{ minHeight: 20 }} />}

                    {tags.map((tag, index) => {
                      if (index > 2) return null;
                      return (
                        <View
                          onLayout={({ nativeEvent: { layout } }) => {
                            if (this.state.tagsHeight === null) {
                              this.setState((state) => {
                                if (Platform.OS === 'ios') {
                                  state.tagsHeight = layout.height;
                                } else {
                                  state.tagsHeight = layout.height;
                                }
                                return state;
                              });
                            }
                          }}
                          key={tag + index}
                          style={{
                            backgroundColor: '#f6f6f6',
                            marginRight: 5,
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            borderRadius: 4,
                          }}>
                          <RText
                            style={{
                              color: GS.textColorGreyDark2,
                              fontSize: normalizedFontSize(5.605),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {tag}
                          </RText>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View style={style.KACol2}>
                  {/* rating */}
                  <Rating
                    containerStyle={{
                      height: this.state.tagsHeight
                        ? this.state.tagsHeight
                        : 'auto',
                    }}
                    rating={rating?.toFixed(1)}
                    reviewsCount={`${reviewsCount} Reviews`}
                    dropRating={true}
                  />
                  {/* rating */}
                </View>
              </View>

              <View
                style={[
                  style.infoRow,
                  isDeliveryMode && !showETA
                    ? style.infoRowDelivery
                    : style.infoRowPickup,
                ]}>
                {/* KM */}
                {deliveryService === null && userLoc && (
                  <View style={style.detailsContainer}>
                    <Image
                      source={LOCATION_PIN_GREEN_OUTLINE}
                      style={style.detailsIcon}
                    />
                    <RText
                      fontName={customFont.axiformaBold}
                      style={style.KAText}>
                      {distance
                        ? `${distance.toFixed(1)} KM`
                        : userLoc
                        ? `${getDistance(location, userLoc)} KM`
                        : ''}
                    </RText>
                  </View>
                )}
                {/* KM */}
                {/* ttp */}
                {!isDeliveryMode && (
                  <View style={style.detailsContainer}>
                    <Image source={TTP} style={style.detailsIcon} />
                    <RText
                      fontName={customFont.axiformaBold}
                      style={style.KAText}>
                      {ttp} <RText style={style.KAText}>mins</RText>
                    </RText>
                  </View>
                )}
                {isDeliveryMode && deliveryETA && showETA && (
                  <View style={[style.detailsContainer]}>
                    <Image source={TTP} style={[style.detailsIcon]} />
                    <RText
                      fontName={customFont.axiformaBold}
                      style={style.KAText}>
                      {deliveryETA.min}
                      {deliveryETA.min && deliveryETA.max && ' - '}
                      {deliveryETA.max}
                      <RText style={style.KAText}> mins</RText>
                    </RText>
                  </View>
                )}
                {/* ttp */}
                {isDeliveryMode ? (
                  <>
                    {deliveryRadius && (
                      <View style={style.detailsContainer}>
                        <Image source={DELIVERY_FEE} style={style.deliveryDetailsIcon} />
                        <RText
                          fontName={customFont.axiformaBold}
                          style={style.KAText}>
                          {deliveryRadius[0]?.customerDeliveryCharge !== '0'
                            ? parseFloat(
                                deliveryRadius[0]?.customerDeliveryCharge,
                              ).toFixed(3) + ' KD'
                            : 'Free Delivery'}
                        </RText>
                      </View>
                    )}
                    {!showETA && isDeliveryMode &&
                      minDeliveryOrderValue &&
                      deliveryRadius &&
                      deliveryRadius[0]?.customerDeliveryCharge && (
                        <RText style={{ color: '#ededed' }}> • </RText>
                      )}
                    {minDeliveryOrderValue && (
                      <View style={style.detailsContainer}>
                        <Image source={MIN_ORDER} style={style.deliveryDetailsIcon} />
                        <RText
                          fontName={customFont.axiformaBold}
                          style={style.KAText}>
                          {parseFloat(minDeliveryOrderValue) === 0 ? 'No Min Order': parseFloat(minDeliveryOrderValue).toFixed(3) + priceSymbol}
                        </RText>
                      </View>
                    )}
                  </>
                ) : (
                  <RText
                    style={style.addressText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {address}
                  </RText>
                )}
              </View>

            </View>
            {/* REST INFO */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  mapBookmarkStateToProps,
  mapBookmarkDispatchToProps,
)((props) => withBookmarkHook({ ...props, comp: RestCard }));

const style = StyleSheet.create({
  mainCard: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  saveIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 100,
    overflow: 'hidden',
  },
  saveImage: {
    height: 30,
    width: 30,
  },
  cardClick: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#fff',
    flex: 1,
    borderWidth: 0.2,
    borderColor: 'silver',
  },
  restImage: {
    minHeight: 200,
    maxHeight: '50%',
    width: '100%',
  },
  infoContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  cardTitle: {
    fontSize: normalizedFontSize(9.126),
    paddingVertical: 10,
  },
  mainRow: {
    flexDirection: 'row',
    maxWidth: '100%',
    justifyContent: 'space-between',
  },
  KACol: {
    flexDirection: 'column',
    flex: 1,
  },
  KACol2: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsIcon: {
    maxHeight: 13,
    maxWidth: 13,
    marginRight: 5,
    resizeMode: 'contain',
  },
  deliveryDetailsIcon: {
    maxHeight: 15,
    maxWidth: 15,
    marginRight: 5,
    resizeMode: 'contain',
  },
  KAText: {
    color: 'gray',
    fontSize: normalizedFontSize(5.605),
    fontFamily: customFont.axiformaBold,
  },
  addressText: {
    color: GS.textColorGreyDark,
    fontSize: normalizedFontSize(5.605),
    width: '50%',
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 10,
  },
  infoRowDelivery: {
    justifyContent: 'flex-end',
  },
  infoRowPickup: {
    justifyContent: 'space-between',
  },
});
