import React, { useContext, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useOtpHook from '../../../components/hooks/otp.hook';
import { Context as GLoadingContext } from '../../../context/gLoading';
import GS, {
  BoldText,
  normalizedFontSize,
  RText,
  customFont,
} from '../../../GlobeStyle';
import { Header } from '../../../Navigation/SignUpNav';

const PhoneAuth = (props) => {
  const { goBack, navigation, route } = props;
  const { reqOtp, error } = useOtpHook();
  const [phoneNum, setPhoneNum] = useState('');
  const gLoading = useContext(GLoadingContext);
  const onSubmit = async () => {
    try {
      gLoading.actions.toggleGLoading(true, '#ffffff99');
      Keyboard.dismiss();
      const res = await reqOtp(`+965${phoneNum}`);
      if (res) {
        navigation.navigate('Otp', {
          data: {
            phoneNum: `${phoneNum}`,
            otpUuid: res,
          },
        });
      }
      gLoading.actions.toggleGLoading(false);
    } catch {}
  };

  return (
    <View style={styles.container}>
      <Header onBack={goBack} />
     <View style={styles.container2}>
     <BoldText style={styles.header}>Phone Number</BoldText>
      <Message />
      <PhoneInput phoneNum={phoneNum} setPhoneNum={setPhoneNum} />
      <SubmitBtm onSubmit={onSubmit} disabled={phoneNum.length <= 7} />
      <ErrorMessage error={error} />
     </View>
    </View>
  );
};

const ErrorMessage = (props) => {
  const { error } = props;
  return error && <RText style={styles.errorMessage}>{error}</RText>;
};

const Message = () => {
  return <RText style={styles.message}>Please enter your phone number</RText>;
};

const SubmitBtm = (props) => {
  const { onSubmit, disabled } = props;
  return (
    <TouchableOpacity
      style={[styles.submitBtn, disabled ? styles.disabledSubmitBtn : {}]}
      onPress={onSubmit}
      disabled={disabled}>
      <BoldText style={styles.submitText}>Continue</BoldText>
    </TouchableOpacity>
  );
};

const PhoneInput = (props) => {
  const { phoneNum, setPhoneNum } = props;

  return (
    <View style={[styles.inputContainer]}>
      <View style={styles.prefixContainer}>
        <Text style={[styles.inputText, styles.prefix]}>+965</Text>
      </View>
      <TextInput
        style={[styles.inputText, styles.input]}
        keyboardType="number-pad"
        maxLength={8}
        underlineColorAndroid="transparent"
        value={phoneNum}
        onChangeText={(text) => setPhoneNum(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GS.primaryColor,
    paddingHorizontal: 10,
  },
  container2: {
    marginHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 30,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  prefixContainer: {
    borderRightWidth: 1,
    borderColor: GS.greyColor,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  prefix: {
    paddingLeft: 10,
    paddingRight: 5,
    fontWeight: 'bold',
    color: GS.textColorGrey,
  },
  inputText: {
    fontSize: normalizedFontSize(10),
    fontFamily: customFont.axiformaBold,
    letterSpacing: 5,
  },
  input: {
    paddingHorizontal: 20,
    minWidth: 222,
  },
  submitBtn: {
    marginTop: 40,
    backgroundColor: GS.logoGreen,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledSubmitBtn: {
    backgroundColor: GS.greyColor,
  },
  submitText: {
    color: '#fff',
    fontSize: normalizedFontSize(8),
  },
  message: {
    fontSize: normalizedFontSize(8),
    marginTop: 10,
    marginBottom: 40,
    color: GS.textColorGrey,
    lineHeight: 40,
  },
  header: {
    fontSize: normalizedFontSize(13),
    marginTop: 20,
    color: '#000',
  },
  errorMessage: {
    color: GS.errorRed,
    alignSelf: 'center',
    marginTop: 40,
    lineHeight: 25,
    textAlign: 'center',
  },
});

export default PhoneAuth;
