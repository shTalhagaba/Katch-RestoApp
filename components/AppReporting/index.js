import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import shortid from 'shortid';
import moment from 'moment';

if(!__DEV__){
  crashlytics().setCrashlyticsCollectionEnabled(true);
  analytics().setAnalyticsCollectionEnabled(true);
}

export const analyticsOnLogin = async (userObject) => {
  const {displayName, phoneNumber, uid} = userObject;
  await Promise.all([
    analytics().setUserId(uid),
    analytics().setUserProperty('name', displayName),
    analytics().setUserProperty('phone number', phoneNumber),
    crashlytics().setUserId(uid),
    crashlytics().setAttribute('name', displayName),
    crashlytics().setAttribute('phone number', phoneNumber),
  ]);
};

export const analyticsOnSignUp = async (userObject) => {
 try{
  const {displayName, phoneNumber, uid} = userObject;
  await Promise.all([
    analytics().setUserId(uid),
    analytics().setUserProperty('name', displayName),
    analytics().setUserProperty('phone number', phoneNumber),
    analytics().setUserProperty('created_at', moment().local().toISOString()),
    crashlytics().setUserId(uid),
    crashlytics().setAttribute('name', displayName),
    crashlytics().setAttribute('phone number', phoneNumber),
    crashlytics().setAttribute('created_at', moment().local().toISOString()),
  ]);
 }catch{}
};

export const logEvent = async (eventName, propertyObject = {}) => {
  try{
    propertyObject.id = shortid.generate();
    await analytics().logEvent(eventName, propertyObject);
  }catch{}
};

export const analyticsOnSignOut = async () => {
  try{
    await analytics().resetAnalyticsData();
  }catch{}
};

export const LogJsError = async (error) => {
  try{
    await crashlytics().recordError(error)
  }catch{}
}

export const LogError = async (error) => {
  try{
    await crashlytics().log(error)
  }catch{}
}