import Clipboard from '@react-native-community/clipboard';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
//3rd party
import ADIcon from 'react-native-vector-icons/AntDesign';
import Ioicon from 'react-native-vector-icons/Ionicons';
import { PROMO } from '../../assets/images';
import { capitalizeFirstLetter, toLocalTime } from '../../components/Helpers';
//others
import GS, {
  customFont,
  normalizedFontSize,
  priceSymbol,
  TextBasic,
} from '../../GlobeStyle';

const windowHeight = Dimensions.get('window').height;

const RestPromoList = (props) => {
  const { toggleModal, promo } = props;

  const flatOrDiscount = promo.type.name === 'Flat' ? ` ${priceSymbol}` : '%';
  const amount = `${promo.type.value}${flatOrDiscount}`;

  const copyToClipboard = () => {
    Clipboard.setString(promo.code);
    Toast.show('Copied to Clipboard', Toast.SHORT);
  };

  const staticTerms = [
    `Valid before ${toLocalTime(promo.expiry)}.`,
    'Other Terms may apply.',
  ];

  if (promo.type.maxLimit)
    staticTerms.unshift(
      `Up to ${promo.type.maxLimit} KD ${promo.cashback ? 'Cash Back' : 'OFF'}`,
    );
  if (promo.type.minOrder)
    staticTerms.unshift(`Applicable on orders above ${promo.type.minOrder} KD`);
  if (promo.perUserApply)
    staticTerms.unshift(`Applicable up to ${promo.perUserApply} time(s)`);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexGrow: 1, backgroundColor: '#00000005' }}>
        <TouchableOpacity style={{ flexGrow: 1 }} onPress={toggleModal} />
      </View>
      <View>
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 'auto',
            backgroundColor: GS.primaryColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderBottomWidth: 0.3,
              borderBottomColor: 'silver',
              alignItems: 'center',
            }}>
            <View style={{ marginRight: 10, flex: 1 }}>
              <TextBasic
                style={{
                  fontSize: normalizedFontSize(10),
                  color: GS.textColor,
                  fontFamily: customFont.axiformaMedium,
                }}>
                Promo Details
              </TextBasic>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start',
              }}
              onPress={toggleModal}>
              <ADIcon color="gray" name="close" size={30} />
            </TouchableOpacity>
          </View>

          <ScrollView
            bounces={false}
            style={{
              backgroundColor: GS.primaryColor,
              maxHeight: windowHeight / 1.25,
            }}>
            <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
              <View onPress={() => copyToClipboard(promo.code)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={PROMO} style={{ height: 28, width: 28 }} />
                  <TextBasic
                    style={{
                      fontSize: normalizedFontSize(8),
                      color: GS.textColorGreyDark,
                      fontFamily: customFont.axiformaMedium,
                    }}>
                    {' ' + capitalizeFirstLetter(promo.name)}
                  </TextBasic>
                </View>
                <TextBasic
                  style={{
                    paddingTop: 10,
                    fontSize: normalizedFontSize(6.5),
                    color: GS.textColorRed,
                    fontFamily: customFont.axiformaMedium,
                  }}>
                  GET {amount} {promo.cashback ? 'Cash Back' : 'OFF'}
                </TextBasic>
                <TextBasic
                  style={{
                    paddingTop: 5,
                    fontSize: normalizedFontSize(6),
                    color: GS.textColorGreyDark2,
                    fontFamily: customFont.axiformaRegular,
                  }}>
                  {ValidOn(promo)}
                </TextBasic>
              </View>
              {promo.description !== '' && (
                <View style={{ marginTop: 15 }}>
                  <TextBasic
                    style={{
                      fontSize: normalizedFontSize(5.5),
                      color: GS.textColorGreyDark2,
                      fontFamily: customFont.axiformaRegular,
                    }}>
                    {promo.description}
                  </TextBasic>
                </View>
              )}
            </View>
            {promo.code !== '' && (
              <View
                style={{
                  marginTop: promo.description === '' ? 20 : 0,
                  borderTopWidth: 0.2,
                  borderTopColor: 'silver',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  backgroundColor: GS.bgGreen1,
                }}>
                <View
                  style={{
                    backgroundColor: GS.bgGreenDark,
                    paddingVertical: 7,
                    paddingHorizontal: 20,
                    minWidth: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: GS.bgGreenDark1,
                    borderRadius: 8,
                  }}>
                  <TextBasic
                    style={{
                      color: '#000',
                      fontSize: normalizedFontSize(7.5),
                      fontFamily: customFont.axiformaBold,
                    }}>
                    {promo.code}
                  </TextBasic>
                </View>

                <TouchableOpacity
                  onPress={copyToClipboard}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    minWidth: 70,
                  }}>
                  <TextBasic
                    style={{
                      color: GS.textColorGreen1,
                      fontSize: normalizedFontSize(7.5),
                      fontFamily: customFont.axiformaBold,
                    }}>
                    COPY CODE
                  </TextBasic>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                paddingVertical: 10,
                borderTopWidth: 0.3,
                borderColor: 'silver',
                paddingHorizontal: 20,
              }}>
              {[...promo.terms, ...staticTerms].map((term, index) => {
                return term !== '' ? (
                  <View
                    key={term + index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Ioicon
                      name="shield-checkmark"
                      color="#96DBDA"
                      size={normalizedFontSize(6)}
                    />
                    <TextBasic
                      style={{
                        marginLeft: 10,
                        marginVertical: 5,
                        marginRight: 'auto',
                        fontSize: normalizedFontSize(5.5),
                        fontFamily: customFont.axiformaLight,
                      }}>
                      {term}{' '}
                    </TextBasic>
                  </View>
                ) : null;
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const ValidOn = (props) => {
  const { name, minOrder } = props.type;

  let message;

  if ((name === 'Flat' || name === 'Discount') && minOrder === null) {
    message = 'Applicable on all orders';
  } else if ((name === 'Flat' || name === 'Discount') && minOrder !== null) {
    message = `Valid on orders above ${minOrder} ${priceSymbol}`;
  }

  return message;
};

export default RestPromoList;
