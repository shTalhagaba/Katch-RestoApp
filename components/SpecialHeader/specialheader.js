import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { RAMADAN_BANNER } from '../../assets/images';
import {
  BoldText,
  customFont,
  normalizedFontSize,
  RText,
} from '../../GlobeStyle';
import LandingGreeting from '../LandingGreeting';

const SpecialHeader = ({
  marketingData,
  navigation,
  statusBarHeight,
  minHeight,
  showGreeting = true,
}) => {
  const [iftar, setIftar] = useState('');
  const [suhoor, setSuhoor] = useState('');

  useEffect(() => {
    if (marketingData.ramadan) {
      setIftar(marketingData.ramadan.iftar);
      setSuhoor(marketingData.ramadan.suhoor);
    }
  }, [marketingData]);
  return (
    <View
      style={{
        width: '100%',
      
      }}>
      <Image
        style={{
          zIndex: -1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: 213,
          width: '100%',
        }}
        source={RAMADAN_BANNER}
      />
      {showGreeting && <LandingGreeting navigation={navigation} />}

      <View
        style={{
          flex: 1,
          height: '100%',
          flexDirection: 'row',
          paddingHorizontal: 15,
          marginTop: 30 
        }}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <RText
              style={{
                color: 'white',
                fontSize: normalizedFontSize(18),
                fontFamily: customFont.sketsaRamadhan,
                marginBottom: 1,
                minWidth: 75,
                overflow: 'hidden',
              }}>
              Suhoor
            </RText>
            <RText style={{ color: 'white', fontSize: normalizedFontSize(10) }}>
              {' : '}
            </RText>
            <BoldText
              style={{
                color: 'white',
                fontSize: normalizedFontSize(13),
                fontFamily: customFont.oldEnglishGothic,
              }}>
              {suhoor}
              <BoldText style={{ fontFamily: customFont.sketsaRamadhan }}>
                {'  '}am
              </BoldText>
            </BoldText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <RText
              style={{
                color: 'white',
                fontSize: normalizedFontSize(18),
                fontFamily: customFont.sketsaRamadhan,
                marginBottom: 1,
                minWidth: 75,
              }}>
              Iftar
            </RText>
            <RText style={{ color: 'white', fontSize: normalizedFontSize(10) }}>
              {' : '}
            </RText>
            <BoldText
              style={{
                color: 'white',
                fontSize: normalizedFontSize(13),
                fontFamily: customFont.oldEnglishGothic,
              }}>
              {iftar}
              <BoldText
                style={{
                  fontFamily: customFont.sketsaRamadhan,
                }}>
                {'  '}pm
              </BoldText>
            </BoldText>
          </View>
        </View>
        <View
          style={{
            height: '100%',

            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <RText
            style={{
              color: 'white',
              fontSize: normalizedFontSize(22),
              paddingRight: 25,
              fontFamily: customFont.sketsaRamadhan,
              height: 40,
              marginBottom: 0,
            }}>
            Ramadan
          </RText>
          <RText
            style={{
              color: 'white',
              fontSize: normalizedFontSize(22),
              fontFamily: customFont.sketsaRamadhan,
              height: 40,
              marginBottom: 20,
            }}>
            Kareem
          </RText>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(SpecialHeader);
