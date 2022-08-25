import React from 'react';
import {
  S3_CLOUD_FRONT_URL,
  LOCAL_IMAGE_URL,
  IMAGEKIT_URL,
  S3_SANDBOX_URL,
} from 'react-native-dotenv';
import moment, { now } from 'moment';
import timeDiff from 'timediff';
import { distanceTo, insideBoundingBox } from 'geolocation-utils';
import sort from 'fast-sort';

import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GET_APP_PROPERTIES,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
} from '../../components/GraphQL';
import {
  addBookmarkToState,
  removeBookmarkFromState,
} from '../Redux/Actions/userActions';
import auth from '@react-native-firebase/auth';
import { LayoutAnimation } from 'react-native';

export const generateCouponImgScr = (id, image) => {
  if (!image) {
    return '';
  }
  const imagePath = `${id}/${image}`;
  let imageScr;
  if (image.includes('https://') || image.includes('http://')) {
    imageScr = image.replace(S3_CLOUD_FRONT_URL, S3_CLOUD_FRONT_URL);
  } else {
    imageScr = `${
      __DEV__ ? S3_SANDBOX_URL : S3_CLOUD_FRONT_URL
    }/coupons/${imagePath}`;
  }
  return imageScr;
};

export const generateProductImgScr = (id, image, width, clearCache = true) => {
  const date = moment().format('YYYYMMDD');
  if (!image) {
    return '';
  }
  const imagePath = `${id}/productImages/${image}`;
  let imageScr;
  if (image.includes('https://') || image.includes('http://')) {
    imageScr = image.replace(S3_CLOUD_FRONT_URL, IMAGEKIT_URL);
  } else {
    imageScr = `${
      __DEV__ ? LOCAL_IMAGE_URL : IMAGEKIT_URL
    }/images/${imagePath}`;
  }
  imageScr =
    imageScr +
    `?tr=w-${width ? width : 400}${clearCache ? `&cache=${date}` : ''}`;
  return imageScr;
};

export const generateReviewImgScr = (image) => {
  if (!image) {
    return '';
  }

  let imageScr;
  if (image.includes('https://') || image.includes('http://')) {
    imageScr = image;
  } else {
    imageScr = `${
      __DEV__ ? 'https://katch-sandbox.s3.amazonaws.com' : S3_CLOUD_FRONT_URL
    }/${image}`;
  }

  return imageScr;
};

export const generateImgScr = (id, image, width) => {
  if (!image) {
    return '';
  }

  const imagePath = `${id}/${image}`;
  let imageScr;
  if (image.includes('https://') || image.includes('http://')) {
    imageScr = image.replace(S3_CLOUD_FRONT_URL, IMAGEKIT_URL);
  } else {
    imageScr = `${
      __DEV__ ? LOCAL_IMAGE_URL : IMAGEKIT_URL
    }/images/${imagePath}`;
  }
  imageScr = imageScr + `?tr=w-${width ? width : 400}`;
  return imageScr;
};

export const capitalizeFirstLetter = (string) => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);

  return '';
};

/**
 *
 * @param {String} date Takes in MongoBD time stamp and converts it to local time
 */
export const toLocalTime = (date) => {
  try {
    let ISODate;
    const isNotNumber = isNaN(date);
    if (!isNotNumber) {
      ISODate = new Date(parseInt(date)).toISOString();
    } else {
      let parsed = Date.parse(date);
      ISODate = new Date(parseInt(parsed)).toISOString();
    }
    const utcDate = moment.utc(ISODate).toDate();
    const local = moment(utcDate).local().format('DD/MM/YYYY  HH:mm');
    return local;
  } catch (error) {
    return false;
  }
};

export const getTimeFromNow = (date) => {
  try {
    let ISODate;
    const isNotNumber = isNaN(date);
    if (!isNotNumber) {
      ISODate = new Date(parseInt(date)).toISOString();
    } else {
      let parsed = Date.parse(date);
      ISODate = new Date(parseInt(parsed)).toISOString();
    }
    const utcDate = moment.utc(ISODate).toDate();
    const local = moment(utcDate).local().fromNow();

    return local;
  } catch (error) {
    return false;
  }
};

//will calculate the time between order eta timestamp and current time

export const timeDifference = (futureDateAndTime) => {
  if (futureDateAndTime) {
    try {
      const isNotNumber = isNaN(futureDateAndTime);
      const currentDateAndTime = new Date();

      if (!isNotNumber) {
        futureDateAndTime = new Date(parseInt(futureDateAndTime)).toISOString();
      } else {
        let parsed = Date.parse(futureDateAndTime);
        futureDateAndTime = new Date(parseInt(parsed)).toISOString();
      }

      const diff = timeDiff(currentDateAndTime, futureDateAndTime, 'mS');
      const min = diff.seconds > 0 ? diff.minutes + 1 : diff.minutes;
      return min;
    } catch (error) {
      return false;
    }
  }
};

export const getBoundingBox = (boundaries) => {
  const { northEast, southWest } = boundaries;
  return {
    topLeft: [northEast.longitude, northEast.latitude],
    bottomRight: [southWest.longitude, southWest.latitude],
  };
};

/**
 *
 * @param {array} locations object of store location with lat,lng and _id keys
 * @param {object} userLocation object of current user location with lat,lng keys
 * @param {object} boundaries get northEast and southWest boundaries using getMapBoundaries
 */
export const isInsideBoundingBox = (userLocation, locations, boundaries) => {
  const { northEast, southWest } = boundaries;
  const boundingBox = {
    topLeft: { lat: northEast.latitude, lon: northEast.longitude },
    bottomRight: { lat: southWest.latitude, lon: southWest.longitude },
  };

  const locationsNearBy = locations.reduce((acc, location) => {
    const { _id, latitude, longitude, shopName, isOpen, storeId, services } =
      location;

    const isInBox = insideBoundingBox({ latitude, longitude }, boundingBox);
    if (isInBox) {
      const distance = distanceTo(userLocation, { latitude, longitude });

      const toKm = (distance / 1000).toFixed(1);
      acc.push({
        _id,
        latitude,
        longitude,
        isOpen,
        shopName,
        storeId,
        distance: toKm,
        services,
      });
    }
    return acc;
  }, []);

  const sortedLocations = sort(locationsNearBy).by([
    { asc: [(location) => location.distance, (location) => location.shopName] },
  ]);

  return Promise.resolve(sortedLocations);
};

export const distance = (from, center) =>
  (distanceTo(from, center) / 1000).toFixed(1);

export const nextOpening = (hours) => {
  const opening = getNextOpening(hours);
  const converted = convertOpeningTime(opening);
  const openingOn = dayOpening(converted);
  return openingOn;
};

export const convertOpeningTime = (nextOpening) => {
  let opening = nextOpening;
  if (!opening) {
    return null;
  }
  let hour = parseInt(opening.time.substring(0, 2));
  const min = opening.time.substring(2, 4);

  if (hour < 12) {
    if (hour < 10) {
      opening.time = `0${hour}:${min} AM`;
    } else {
      opening.time = `${hour}:${min} AM`;
    }
  } else {
    hour = hour - 12;
    if (hour < 10) {
      opening.time = hour === 0 ? `12:${min} PM` : `0${hour}:${min} PM`;
    } else {
      opening.time = `${hour}:${min} PM`;
    }
  }

  return opening;
};

export const getOpensAt = (opening, isOpen) => {
  if (!opening) {
    return 'Closed';
  }
  const todaysIndex = (moment().local().day() + 1) % 7;
  const openTime = opening[todaysIndex];
  const isClosedForTheDay = openTime === '';
  const currentTime = moment().local().format('HHmm');
  const openingTime = isClosedForTheDay
    ? ''
    : convertOpeningTime({ time: openTime });

  return isClosedForTheDay || (openTime <= currentTime && !isOpen)
    ? 'Closed'
    : `Opens at: ${openingTime?.time}`;
};

/**
 *
 * @param {*} opening
 */
const dayOpening = (opening) => {
  if (!opening) {
    return null;
  }
  const todaysIndex = (moment().local().day() + 1) % 7;
  const tomorrowIndex = (todaysIndex + 1) % 7;
  const daysOfWeek = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  if (todaysIndex === opening.dayIndex) {
    return opening.time;
  } else if (tomorrowIndex === opening.dayIndex) {
    return `Tomorrow ${opening.time}`;
  } else {
    return `${daysOfWeek[opening.dayIndex]} ${opening.time}`;
  }
};

const getNextOpening = (openingHours) => {
  const todaysIndex = (moment().local().day() + 1) % 7;
  const openingLength = openingHours.length;
  let nextOpening;
  for (let i = 0; i < openingLength; i++) {
    if (i > todaysIndex && openingHours[i] !== '' && nextOpening !== null) {
      nextOpening = {
        dayIndex: i,
        time: openingHours[i],
      };

      break;
    } else if (i + 1 === openingLength && nextOpening !== null) {
      nextOpening = null;
      i = -1;
      continue;
    }

    if (nextOpening === null && openingHours[i] !== '') {
      nextOpening = {
        dayIndex: i,
        time: openingHours[i],
      };
      break;
    }
  }
  return nextOpening;
};

//Round Ratings to the nearest Half
export const roundToNearestHalf = (ratings) => Math.round(ratings * 2) / 2;

export const getGreetings = () => {
  const hours = new Date().getHours();
  switch (true) {
    case hours >= 0 && hours < 12:
      return 'Morning';
    case hours >= 12 && hours < 17:
      return 'Afternoon';
    case hours >= 17 && hours < 24:
      return 'Evening';
  }
};

//Check if it is a valid promo
export const isValidPromo = (item) => {
  return item && item.type && item.type.value && item.type.name;
};

//Check for Valid Price and Greater than Zero
export const isValidPrice = (priceStr) => {
  const price = parseFloat(priceStr);
  return !isNaN(price) && price > 0;
};

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const useAppProperties = () => {
  const { loading, error, data, refetch } = useQuery(GET_APP_PROPERTIES);
  return [loading, error, data, refetch];
};

export const mapBookmarkStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
    user: state.user,
  };
};

export const mapBookmarkDispatchToProps = (dispatch) => {
  return {
    addBookmarkToState: (storeId) => {
      dispatch(addBookmarkToState(storeId));
    },
    removeBookmarkFromState: (storeId) => {
      dispatch(removeBookmarkFromState(storeId));
    },
  };
};
export const withBookmarkHook = (props) => {
  const { addBookmarkToState, removeBookmarkFromState, comp: Comp } = props;
  const [addBookMarkToDb] = useMutation(ADD_BOOKMARK, {
    variables: {
      bookMarkInput: {
        type: 'store',
        storeID: props._id,
      },
    },
  });

  const [removeBookMarkFromDb] = useMutation(REMOVE_BOOKMARK, {
    variables: {
      storeId: props._id,
    },
  });

  //callback for if no user is logged in
  const onAddBookMark = (callback) => {
    try {
      if (auth().currentUser) {
        addBookmarkToState(props._id);

        addBookMarkToDb().catch((error) => {
          removeBookmarkFromState(props._id);
        });
      } else {
        callback && callback();
      }
    } catch (error) {}
  };

  const onRemoveBookMark = () => {
    try {
      removeBookmarkFromState(props._id);

      removeBookMarkFromDb().catch((error) => {
        addBookmarkToState(props._id);
      });
    } catch (error) {}
  };

  return (
    <Comp
      {...props}
      onRemoveBookMark={onRemoveBookMark}
      onAddBookMark={onAddBookMark}
    />
  );
};

export const parseError = (error) => {
  try {
    const hasError = error?.graphQLErrors[0]?.code;
    if (hasError) {
      return error?.graphQLErrors[0]?.message;
    }
  } catch (e) {}
  return false;
};

export const animateLayout = () => {
  LayoutAnimation.configureNext({
    duration: 400,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  });
};
