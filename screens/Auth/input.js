import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import GS, { RText, customFont } from '../../GlobeStyle';
import ADIcon from 'react-native-vector-icons/AntDesign';

const Input = (props) => {
  let {
    SvgColor = 'silver',
    errorMessage = '',
    secureTextEntry = false,
    placeHolder = '',
    value = '',
    keyboardType = 'default',
    Svg,
    IconCorrect = null,
    IconWrong = null,
    onChangeText,
    maxLength,
    editable = true,
    textColor = '#000',
    textInputHeight = true,
    marginBottom = 20,
    pointerEvent = null,
    forwardedRef = null,
    onChange = null,
    blurOnSubmit = null,
    textAlign = null,
    dropDown,
  } = props;
  const [prevText, setPrevText] = useState(secureTextEntry);
  if (errorMessage === null) {
    errorMessage = '';
  }
  return (
    <View style={[styles.container, { marginBottom }]}>
      <View style={styles.innerContainer}>
        {Svg && (
          <View style={styles.svgContainer}>
            <Svg
              stroke={errorMessage !== '' ? GS.errorRed : SvgColor}
              height={25}
            />
          </View>
        )}
        <TextInput
          placeholder={placeHolder}
          placeholderTextColor="silver"
          secureTextEntry={prevText}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          pointerEvents={pointerEvent}
          keyboardType={keyboardType}
          ref={forwardedRef}
          onSubmitEditing={onChange}
          blurOnSubmit={blurOnSubmit}
          style={[
            styles.input,
            {
              textAlign: textAlign,
              height:
                textInputHeight === true
                  ? Platform.OS === 'android'
                    ? 40
                    : 35
                  : Platform.OS === 'android'
                  ? null
                  : 35,
              color: textColor,
            },
          ]}
          allowFontScaling={false}
          editable={editable}
          returnKeyType="done"
        />

        {IconCorrect && value.length >= 5 && errorMessage === '' && (
          <IconCorrect />
        )}
        {IconWrong && errorMessage !== '' && <IconWrong />}
        {placeHolder.toLowerCase().includes('password') && (
          <TouchableOpacity
            onPress={() => setPrevText(!prevText)}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FAIcon
              name={!prevText ? 'eye-slash' : 'eye'}
              color={GS.greyColor}
              size={20}
            />
          </TouchableOpacity>
        )}
        {dropDown && (
     <View style={styles.dropDownContainer}>
          <ADIcon
        name="down"
        color={GS.greyColor}
        size={20}
      />
     </View>
        )}
      </View>
      <RText
        style={{
          fontFamily: customFont.axiformaMedium,
          fontSize: 15,
          color: GS.errorRed,
          marginHorizontal: 20,
          textAlign: 'right',
          paddingTop: 5,
        }}>
        {errorMessage}
      </RText>
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownContainer: {
    marginRight: 20,
  },
  container: {
    width: '100%',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: `${GS.greyColor}70`,
    minHeight: 45,
  },
  svgContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: GS.greyColor,
    // backgroundColor: 'red',
    paddingLeft: 20,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 20,
    fontFamily: customFont.axiformaRegular,
    flex: 1,
  },
});

export default Input;
