import moment from 'moment';
//3rd party
import converter from 'number-to-words';
import React, { memo, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import call from 'react-native-phone-call';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { useStore } from 'react-redux';
import { DELIVERY_FEE, MIN_ORDER, SHOP_TIMIMG, STORE_HOURS } from '../../assets/images';
import { StarGreenBox, StarRedBox } from '../../assets/svg';
import { convertOpeningTime, getOpensAt } from '../../components/Helpers';
import Stars from '../../components/Stars';
//others
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  priceSymbol,
  RText,
  TextBasic,
} from '../../GlobeStyle';
import { RestInfoContainer } from './style';

const getStoreHours = (storeHours) => {
  const opening = storeHours.opening;
  const closing = storeHours.closing;

  return [...Array(7)].reduce((acc, _, i) => {
    const openTime = opening[i];
    const closeTime = closing[i];
    const isClosedForTheDay = openTime === '' || closeTime === '';
    if (!isClosedForTheDay) {
      const daysOfWeek = [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ];
      const todaysIndex = (moment().local().day() + 1) % 7;
      const openingTime = !isClosedForTheDay
        ? convertOpeningTime({ time: openTime })
        : { time: '' };
      const closingTime = !isClosedForTheDay
        ? convertOpeningTime({ time: closeTime })
        : { time: '' };
      const isToday = todaysIndex === i;

      acc.push({
        isToday,
        day: daysOfWeek[i],
        time: `${openingTime.time} - ${closingTime.time}`,
      });
    }
    return acc;
  }, []);
};

const StoreInfo = (props) => {
  const store = useStore();
  const { user } = store.getState();
  const { info, withReviews = false } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const numOfCustomers =
    info.estimatedCost && converter.toWords(info.estimatedCost.customerInteger);
  const cost = info.estimatedCost?.cost;
  const estimatedCost =
    info.estimatedCost && `${cost} ${priceSymbol} for ${numOfCustomers}`;
  const todaysIndex = (moment().local().day() + 1) % 7;
  const todayStoreHours = getStoreHours(info.storeHours)[todaysIndex];

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const placeCall = () => {
    call({
      number: info.phone, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
    });
  };

  return (
    <>
      <RestInfoContainer style={style.container}>
        <View style={style.topHeader}>
          <TextBasic
            style={{
              fontFamily: customFont.axiformaMedium,
              fontSize: normalizedFontSize(9.126),
            }}>
            {info.shopName}
          </TextBasic>
          <TouchableOpacity onPress={placeCall}>
            <FAIcon name="phone" size={25} color={GS.logoGreen} />
          </TouchableOpacity>
        </View>

        <RText style={style.storeAddress}>{info.address}</RText>

        {/* Rating */}

        {withReviews && (
          <View style={style.reviewStar}>
            <StarsRestReview info={info} />
            <StarsPickUpReview info={info} />
          </View>
        )}

        <View style={style.divider} />
        {/* Rating */}

        {/* other Info */}
        <View style={style.mt10}>
          <View style={style.infoContainer}>
            <View style={style.infoBox}>
              <RText style={style.infoText}>{info.category}</RText>
            </View>
            {todayStoreHours && (
              <View style={style.infoBox}>
                <RText style={style.infoText}>
                  {info.isOpen
                    ? info.busyMode
                      ? 'Busy'
                      : 'Open'
                    : getOpensAt(info.storeHours.opening, info.isOpen)}
                </RText>
              </View>
            )}
            {estimatedCost && (
              <View style={style.infoBox}>
                <RText style={style.infoText}>{estimatedCost}</RText>
              </View>
            )}
          </View>
          {!info.comingSoon &&
            (todayStoreHours ? (
              <TouchableOpacity
                onPress={toggleDialog}
                style={style.iconsContainer}>
                <Image source={STORE_HOURS} style={style.detailsIcon} />
                <RText style={[style.KAText]}>
                  {`${todayStoreHours.time} ${
                    todayStoreHours.isToday ? '(Today)' : ''
                  }`}
                </RText>
                <FAIcon
                  name="caret-down"
                  color="gray"
                  size={15}
                  style={style.storeHoursCaret}
                />
              </TouchableOpacity>
            ) : (
              <View style={style.iconsContainer}>
                <Image source={STORE_HOURS} style={style.detailsIcon} />
                <RText style={[style.KAText, style.grayColor]}>
                  Closed for the day
                </RText>
              </View>
            ))}
          {user.selectedService === 'Delivery' && (
            <>
              {info.deliveryRadius && (
                <View style={style.iconsContainer}>
                  <Image source={DELIVERY_FEE} style={style.detailsIcon} />
                  <View>
                    {info.deliveryRadius[0]?.customerDeliveryCharge === '0' ? (
                      <RText style={style.KAText}>Free Delivery</RText>
                    ) : (
                      <RText style={style.KAText}>
                        Delivery Charge -{' '}
                        {parseFloat(
                          info.deliveryRadius[0]?.customerDeliveryCharge,
                        ).toFixed(3) + ' KD'}
                      </RText>
                    )}
                  </View>
                </View>
              )}
              {info.minDeliveryOrderValue && (
                <View style={style.iconsContainer}>
                  <Image source={MIN_ORDER} style={style.detailsIcon} />
                  <RText style={style.KAText}>
                    {parseFloat(info.minDeliveryOrderValue) !== 0
                      ? 'Min. Order - ' +
                        parseFloat(info.minDeliveryOrderValue).toFixed(3) +
                        priceSymbol
                      : 'No Min. Order'}
                  </RText>
                </View>
              )}
            </>
          )}
        </View>

        {/* other Info */}
      </RestInfoContainer>
      <StoreHoursDialog
        openDialog={openDialog}
        toggleDialog={toggleDialog}
        storeHours={info.storeHours}
      />
    </>
  );
};

export default memo(StoreInfo);

const StarsPickUpReview = ({ info }) => {
  return (
    <View style={style.starContainer}>
      <View style={style.starInnerContainer}>
        <Stars
          withTextRating={false}
          rating={info.rating?.toFixed(1)}
          component={StarGreenBox}
          starStyle={style.starsStyle}
          starHeight={15}
          starWidth={15}
          containerStyle={style.starsContainer}
        />
        <TextBasic style={style.boldText}> {info.rating.toFixed(1)}</TextBasic>
        <TextBasic style={style.reviewCountText}>
          {' '}
          ({info.reviewsCount} Ratings)
        </TextBasic>
      </View>
      <View style={style.starsTextContainer}>
        <BoldText style={style.starsPickupReviewTextBold}>Katch!</BoldText>
        <RText style={style.starsPickupReviewText}>Pickup Rating</RText>
      </View>
    </View>
  );
};

const StarsRestReview = ({ info }) => {
  return (
    <View style={style.starContainer}>
      <View style={style.starInnerContainer}>
        <Stars
          withTextRating={false}
          rating={info.restaurantRating.toFixed(1)}
          component={StarRedBox}
          starStyle={style.starsStyle}
          starHeight={15}
          starWidth={15}
          containerStyle={style.starsContainer}
        />
        <TextBasic style={style.boldText}>
          {' '}
          {info.restaurantRating.toFixed(1)}
        </TextBasic>
        <TextBasic style={style.reviewCountText}>
          {' '}
          ({info.restaurantReviewsCount} Ratings)
        </TextBasic>
      </View>
      <View style={style.starsTextContainer}>
        <RText style={style.starsRestReviewText}>Restaurant Rating</RText>
      </View>
    </View>
  );
};
const StoreHoursDialog = (props) => {
  const { openDialog, toggleDialog, storeHours } = props;

  const text = getStoreHours(storeHours);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openDialog}
      onRequestClose={toggleDialog}>
      <View style={style.modalContainer}>
        <TouchableOpacity
          onPress={toggleDialog}
          style={style.modalBackButton}
        />
        <View style={style.wrapper}>
          <View style={style.imgContainer}>
            <Image source={SHOP_TIMIMG} style={style.img} />
          </View>
          <View style={style.horLine} />
          <View style={style.storeHoursDialogContainer}>
            {text.map(({ day, time, isToday }) => {
              return (
                <View key={day} style={style.storeHoursDialogInnerContainer}>
                  <RText
                    style={[
                      style.storeHoursDialogText,
                      isToday ? style.logoGreen : style.grayColor,
                    ]}>
                    {day}
                  </RText>
                  <RText style={style.storeHoursDialogText}> - </RText>
                  <RText style={style.storeHoursDialogText}>{time}</RText>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  imgContainer: {
    padding: 10,
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  img: { height: 80, width: 80 },

  horLine: {
    width: 1.5,
    backgroundColor: '#718e9c',
    height: 80,
    marginTop: 35,
    marginLeft: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  starContainer: {
    flex: 1,
    marginTop: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  starsTextContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 5,
  },
  starsRestReviewText: {
    fontSize: normalizedFontSize(4),
  },
  starsPickupReviewText: {
    fontSize: normalizedFontSize(4),
  },
  starsPickupReviewTextBold: {
    fontSize: normalizedFontSize(4),
    marginRight: 3,
  },
  starsStyle: {
    marginRight: 2,
  },
  storeAddress: {
    marginBottom: 7,
    marginTop: 1,
    color: 'gray',
    fontSize: normalizedFontSize(5.605),
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  storeHoursCaret: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000020',
  },
  modalBackButton: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  storeHoursDialogContainer: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    paddingHorizontal: 25,
  },
  storeHoursDialogInnerContainer: {
    marginVertical: 3,
    flexDirection: 'row',
  },
  storeHoursDialogText: {
    fontSize: normalizedFontSize(5.605),
    color: 'gray',
    flexGrow: 1,
  },
  boldText: { fontWeight: 'bold' },
  reviewCountText: {
    fontWeight: '400',
    fontSize: normalizedFontSize(4),
    color: GS.greyColor,
  },
  mt10: {
    marginTop: 10,
  },
  container: {
    borderWidth: 0.1,
    borderColor: GS.lightGrey2,
  },
  reviewStar: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoBox: {
    borderRadius: 5,
    paddingTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginRight: 7,
    borderColor: GS.secondaryColor,
    backgroundColor: '#f6f6f6',
  },
  infoText: {
    fontSize: normalizedFontSize(5.605),
    fontFamily: customFont.axiformaMedium,
    color: GS.textColorGreyDark2,
  },
  detailsIcon: {
    maxHeight: 15,
    maxWidth: 15,
    marginRight: 5,
    resizeMode: 'contain',
  },
  KAText: {
    fontSize: normalizedFontSize(5.605),
    fontFamily: customFont.axiformaMedium,
    color: 'gray',
  },
  infoContainer: { flexDirection: 'row', marginBottom: 14 },
  divider: {
    height: 10,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
