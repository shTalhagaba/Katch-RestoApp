import { useMutation } from '@apollo/react-hooks';
import React, { useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import RNRestart from 'react-native-restart';
import { ERROR_CUP } from '../../assets/images';
import { LOG_ERROR } from '../../components/GraphQL';
import { RText } from '../../GlobeStyle';
import styles from './styles';
export class ErrorBoundary extends React.Component {
  state = {
    error: false,
    message: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { error: true };
  }

  /**
   * @param {any} error
   * @param {any} errorInfo
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      stacktrace: error,
      screenName: this.props.screenName,
      message: errorInfo,
    });
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.error && this.state.stacktrace) {
      return <ErrorHandler {...this.state} />;
    } else {
      return this.props.children;
    }
  }
}

const ErrorHandler = (props) => {
  const { screenName, stacktrace } = props;
  const [logError, { loading }] = useMutation(LOG_ERROR);
  useEffect(() => {
    logError({
      variables: {
        input: {
          error: { stacktrace: stacktrace.toString(), screenName },
          code: '[katch/Client]',
          message: `Error From ${screenName} Screen`,
        },
      },
    }).catch((x) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isVisible={true}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      animationInTiming={1}
      style={styles.container}>
      <View style={styles.wrapper}>
        <RText style={styles.mainText}>Oops!</RText>
        <RText style={styles.h2}>Something went Wrong</RText>
        <Image source={ERROR_CUP} style={styles.image} />
        <View style={styles.wrapper1}>
          <RText style={styles.desc}>
            We apologize for any inconvenience this has caused!
          </RText>
          <RText style={styles.desc}>
            Press the button below to restart the app
          </RText>
        </View>
        <TouchableOpacity
          onPress={() => RNRestart.Restart()}
          disabled={loading}>
          <View style={styles.buttonWrapper}>
            <RText
              style={[styles.refreshButton, loading ? styles.disable : {}]}>
              Restart
            </RText>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ErrorBoundary;
