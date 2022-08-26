import React, {useRef, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {VMail as LottieVerifyMail} from '../../assets/Lottie';
import Lottie from 'lottie-react-native';
import GS, {RText, customFont} from '../../GlobeStyle';

const VerifyMail = (props) => {
  const {
    onPressOutSide,
    email,
    onPressOk,
    message = null,
    onPressCancel
  } = props;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        backgroundColor: '#00000070',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        onPress={onPressOutSide}
        activeOpacity={1}
      />
      <View
        style={{
          alignSelf: 'center',
          width: '80%',
        }}>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Lottie
            autoPlay
            loop={false}
            source={LottieVerifyMail}
            style={{height: 150}}
          />
        </View>

        <View
          style={{
            backgroundColor: GS.primaryColor,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 20,
          }}>
          <RText
            fontName={customFont.axiformaMedium}
            style={{fontSize: 20, textAlign: 'center', marginVertical: 20}}>
            {message ? message : 'A verification link has been sent to '}
            <RText
              fontName={customFont.axiformaMedium}
              style={{fontSize: 20, color: GS.secondaryColor}}>
              {email}
            </RText>
          </RText>

          <View style={{flexDirection: 'row'}}>
          {onPressCancel &&
            <TouchableOpacity
							onPress={onPressCancel}
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: GS.secondaryColor,
                borderRadius: 100,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginRight: 10,
              }}>
              <RText style={{color: GS.secondaryColor, fontSize: 16}}>
                Cancel
              </RText>
            </TouchableOpacity>}
            <TouchableOpacity
              onPress={onPressOk}
              style={{
                backgroundColor: GS.secondaryColor,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                borderRadius: 100,
                marginLeft: 10,
              }}>
              <RText style={{color: '#fff', fontSize: 16}}>
                Ok
              </RText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VerifyMail;
