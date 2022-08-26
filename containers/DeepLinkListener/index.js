/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Linking } from 'react-native';
import url from 'url';

const DeepLinkListener = (props) => {
  const { navigation } = props;

  const handleDynamicLink = (link) => {
    if (link) {
      try {
        const parsedUrl = parseLink(link);
        if (parsedUrl) {
          // check if there is coupon in parsed url
          if (parsedUrl.path.indexOf('coupon') !== -1) {
            const [, couponId] = parsedUrl.path.split('/').filter((x) => x);
            navigation.navigate('CouponDetail', {
              _id: couponId,
            });
          } else {
            const [storeId] = parsedUrl.path.split('/').filter((x) => x);
            if (storeId) {
              navigation.navigate('Rest', {
                screen: 'Info',
                id: storeId,
              });
            }
          }
        }
      } catch (ignored) {}
    }
  };

  //GET STOREID FROM DEEPLINK
  const parseLink = (link) => {
    return url.parse(link);
  };

  useEffect(() => {
    // Get the deep link used to open the app

    const onDeepLink = (event) => {
      const deepLink = event.url;
      if (deepLink) {
        handleDynamicLink(deepLink);
      }
    };

    Linking.addEventListener('url', onDeepLink);

    Linking.getInitialURL().then((urlLink) => {
      onDeepLink({ url: urlLink });
    });

    return () => Linking.removeEventListener('url', onDeepLink);
  }, []);

  return props.children;
};

export default DeepLinkListener;
