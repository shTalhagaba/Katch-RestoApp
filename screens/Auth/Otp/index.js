import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  RText,
} from '../../../GlobeStyle';
import { Context as GLoadingContext } from '../../../context/gLoading';
import useOtpHook from '../../../components/hooks/otp.hook';

const retryTime = 30;

const Otp = (props) => {
  const { navigation, route } = props;
  const { phoneNum, otpUuid: _otpUuid } = route.params.data;
  const [otpCode, setOtpCode] = useState('');
  const [otpUuid, setOtpUuid] = useState(_otpUuid);
  const [resendButtonDisabledTime, setResendButtonDisabledTime] =
    useState(retryTime);
  const gLoading = useContext(GLoadingContext);
  const { reqOtp, verifyOtp, error } = useOtpHook();

  let resendOtpTimerInterval;

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  useEffect(() => {
    startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const onCancel = () => {
    navigation.pop();
  };

  const onOtpConfirm = async (code) => {
    try {
      gLoading.actions.toggleGLoading(true, '#ffffff99');
      const res = await verifyOtp(code, otpUuid);
      if (res) {
        navigation.replace('Register', {
          data: {
            phoneNum,
          },
        });
      }
      gLoading.actions.toggleGLoading(false);
    } catch {}
  };

  const onReqCode = async () => {
    try {
      gLoading.actions.toggleGLoading(true, '#ffffff99');
      const data = await reqOtp(`+965${phoneNum}`);
      setOtpUuid(data);
      gLoading.actions.toggleGLoading(false);
      setResendButtonDisabledTime(retryTime);
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <BoldText style={styles.title}>Verify Phone</BoldText>
        <RText style={styles.sendTo}>
          Code sent to <BoldText>+965 {phoneNum}</BoldText>{' '}
        </RText>
        <View style={styles.inputContainer}>
          <OTPInputView
            selectionColor={GS.secondaryColor}
            style={styles.otpInputContainer}
            keyboardAppearance="dark"
            pinCount={6}
            // @ts-ignore
            returnKeyType="done"
            keyboardType="number-pad"
            autoFocusOnLoad={false}
            code={otpCode}
            onCodeChanged={(code) => setOtpCode(code)}
            codeInputFieldStyle={styles.otpInputStyle}
            codeInputHighlightStyle={{
              borderColor: GS.secondaryColor,
            }}
            onCodeFilled={(code) => {
              setOtpCode(code);
              onOtpConfirm(code);
            }}
          />
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <RText style={styles.errorText}>{error}</RText>
          </View>
        )}

        <View style={[styles.retryContainer]}>
          <RText style={{ color: 'gray', marginRight: 10, marginBottom: 3 }}>
            Didn't receive code ?
          </RText>

          <TouchableOpacity
            disabled={!!resendButtonDisabledTime}
            onPress={onReqCode}>
            <RText style={styles.reqCodeText}>
              Request code{' '}
              {resendButtonDisabledTime > 0 && `in ${resendButtonDisabledTime}`}
            </RText>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.footerBtns, styles.cancelBtn]}
            onPress={onCancel}>
            <RText style={styles.cancelBtnText}>Cancel</RText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.footerBtns,
              {
                backgroundColor:
                  otpCode.length < 6
                    ? `${GS.secondaryColor}70`
                    : GS.secondaryColor,
              },
            ]}
            disabled={otpCode.length < 6}
            onPress={() => onOtpConfirm(otpCode)}>
            <RText style={styles.verifyBtnText}>Verify</RText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    padding: 20,
    textAlign: 'center',
    fontSize: normalizedFontSize(13),
    marginTop: 20,
    color: '#000',
  },
  sendTo: {
    textAlign: 'center',
    fontFamily: customFont.axiformaMedium,
    fontSize: normalizedFontSize(8),
    color: GS.textColorGrey,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  errorText: {
    color: GS.errorRed,
  },
  otpInputStyle: {
    backgroundColor: '#e2e2e280',
    color: '#000',
    maxHeight: 50,
    margin: 5,
    padding: 0,
    flex: 1,
    borderRadius: 10,
    textAlign: 'center',
  },
  footerBtns: {
    margin: 20,
    marginTop: 'auto',
    backgroundColor: '#00b800',
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00B800',
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelBtnText: {
    color: '#00B800',
    fontSize: 18,
  },
  retryContainer: {
    justifyContent: 'center',
    marginBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerContainer: {
    flexDirection: 'row',
    marginBottom: 'auto',
  },
  otpInputContainer: {
    width: '80%',
    height: 200,
  },
  reqCodeText: {
    color: '#000',
    fontFamily: customFont.axiformaMedium,
  },
});

export default Otp;
