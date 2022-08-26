import LottieView from 'lottie-react-native';
import queryString from 'query-string';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { Loading } from '../../assets/Lottie';
import Header from '../../components/AccountHeader';
import { Context as GLoadingContext } from '../../context/gLoading';

const KatchWebView = (props) => {
  const { uri, onSuccess, hideDialog } = props;
  const RESPONSE_URL = queryString.parseUrl(uri).query.responseUrl;
  const gLoading = useContext(GLoadingContext);
  const [loading, setIsLoading] = useState(true);
  const detectSuccessURL = (url) => {
    if (url) {
      const parsedUrl = queryString.parseUrl(url);
      // @ts-ignore
      if (parsedUrl.url.includes(RESPONSE_URL)) {
        onSuccess(parsedUrl);
      }
    }
  };

  return uri ? (
    <SafeAreaView style={styles.f1}>
      <Header
        title="Payment Gateway"
        goBack={() => hideDialog(false)}
        icon={null}
      />

      {loading && <PageLoading />}
      <View style={[loading ? styles.o0 : { ...styles.o1, ...styles.f1 }]}>
        <WebView
          source={{ uri }}
          onLoad={() => {
            setIsLoading(false);
          }}
          onLoadEnd={() => {
            gLoading.actions.toggleGLoading(false);
          }}
          onNavigationStateChange={({ url, canGoBack }) => {
            detectSuccessURL(url);
          }}
          onError={() => {
            setIsLoading(false);
            onSuccess(null, true);
          }}
          onHttpError={() => {
            setIsLoading(false);
            onSuccess(null, true);
          }}
        />
      </View>
    </SafeAreaView>
  ) : null;
};

export default KatchWebView;

const PageLoading = () => {
  return (
    <SafeAreaView style={styles.loadingWrapper}>
      <View style={styles.view}>
        <LottieView source={Loading} autoPlay loop />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  o0: {
    opacity: 0,
  },
  o1: {
    opacity: 1,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: '100%',
  },
  view: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});
