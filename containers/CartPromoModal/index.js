/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
//3rd party
import ADIcon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { PROMO } from '../../assets/images';
import { Loading } from '../../assets/Lottie';
import { capitalizeFirstLetter, isValidPromo } from '../../components/Helpers';
import { promos as promoText } from '../../constants/staticText';
//others
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  priceSymbol,
  RText,
  TextBasic,
} from '../../GlobeStyle';

const CartPromoList = (props) => {
  const { toggleModal, promoCodes, applyCode, appliedPromo } = props;

  const [error, setError] = useState('');
  const [inputPromoCode, setInputPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigation = useNavigation();
  const onInputApply = () => {
    if (auth().currentUser && auth().currentUser.uid) {
      if (inputPromoCode !== '') {
        if (appliedPromo && inputPromoCode === appliedPromo.code) {
          setError(
            'You can not apply the same code again or use multi codes on an order.',
          );
        } else {
          const promo = promoCodes.filter(
            (promo) => promo.code === inputPromoCode,
          )[0];
          setIsApplying(true);

          applyCode(inputPromoCode, promo)
            .then((res) => {
              setIsApplying(false);
            })
            .catch((error) => {
              setIsApplying(false);
              setError(error);
            });
        }
      }
    } else {
      toggleModal();
      navigation.navigate('Account', {
        cameFrom: (navigation) => {
          navigation.navigate('Cart', {});
        },
      });
    }
    return;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#00000010' }}>
        <View style={{ flexGrow: 1 }}>
          <TouchableOpacity
            style={{ flexGrow: 1 }}
            onPress={toggleModal}
            disabled={isApplying}
          />
        </View>
        <View
          style={{
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: GS.primaryColor,
            flex: 6,
          }}>
          <View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: 'auto',
              overflow: 'hidden',
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderBottomWidth: 0.3,
                borderBottomColor: 'silver',
                alignItems: 'center',
                backgroundColor: GS.primaryColor,
                overflow: 'hidden',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}>
              <View style={{ marginRight: 10, flex: 1 }}>
                <BoldText
                  fontName={customFont.axiformaMedium}
                  style={{
                    marginTop: 10,
                    fontSize: normalizedFontSize(9),
                    color: GS.textColorGreyDark3,
                  }}>
                  Promo Codes
                </BoldText>
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
          </View>
          <View style={{ flexGrow: 1 }}>
            <View style={{ backgroundColor: GS.primaryColor }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: 'silver',
                  justifyContent: 'center',
                }}>
                <TextInput
                  allowFontScaling={false}
                  placeholder="Enter promo code"
                  placeholderTextColor={GS.textColorGreyDark}
                  onSubmitEditing={onInputApply}
                  style={{
                    flexGrow: 1,
                    color: GS.textColorGreyDark,
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    fontFamily: customFont.axiformaRegular,
                    fontSize: normalizedFontSize(6.5),
                  }}
                  autoCapitalize="characters"
                  value={inputPromoCode}
                  onChangeText={(text) => setInputPromoCode(text.trim())}
                />
                <TouchableOpacity
                  onPress={onInputApply}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingRight: 10,
                  }}>
                  <RText
                    fontName={customFont.axiformaBold}
                    style={{ color: GS.secondaryColor, paddingHorizontal: 10 }}>
                    APPLY
                  </RText>
                </TouchableOpacity>
              </View>
              {error !== '' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    backgroundColor: '#ffcccc',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}>
                  <MIcon name="error-outline" color={GS.errorRed} size={18} />
                  <RText
                    style={{
                      marginLeft: 10,
                      color: GS.errorRed,
                      fontSize: 15,
                      paddingRight: 20,
                    }}>
                    {error}
                  </RText>
                </View>
              )}
            </View>

            {promoCodes ? (
              promoCodes.length > 0 ? (
                <FlatList
                  bounces={false}
                  data={promoCodes.filter(isValidPromo)}
                  renderItem={(props) => (
                    <Card
                      {...props}
                      setError={setError}
                      setIsApplying={setIsApplying}
                      applyCode={applyCode}
                      appliedPromo={appliedPromo}
                    />
                  )}
                  keyExtractor={(item, index) => item._id + index}
                  style={{
                    backgroundColor: GS.primaryColor,
                    flex: 1,
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: GS.primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 50,
                  }}>
                  <RText
                    fontName={customFont.axiformaBold}
                    style={{
                      color: GS.secondaryColor,
                      paddingHorizontal: 10,
                    }}
                  />
                  <RText
                    fontName={customFont.axiformaBold}
                    style={{
                      color: GS.secondaryColor,
                      paddingHorizontal: 10,
                      textAlign: 'center',
                    }}>
                    {promoText.cartEmpty}
                  </RText>
                </View>
              )
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: GS.primaryColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 25,
                    backgroundColor: '#fff',
                  }}>
                  <LottieView
                    source={Loading}
                    autoPlay
                    loop
                    style={{ height: 40, width: 40 }}
                  />
                </View>
              </View>
            )}
          </View>
          {isApplying && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#00000020',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 25,
                  backgroundColor: '#fff',
                }}>
                <LottieView
                  source={Loading}
                  autoPlay
                  loop
                  style={{ height: 40, width: 40 }}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
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

const Card = (props) => {
  const { item, applyCode, appliedPromo, setError, setIsApplying } = props;

  if (item.code === '' || !item || !item.type || !item.type.value) {
    return null;
  }
  const onApply = () => {
    setIsApplying(true);
    applyCode(item.code, item)
      .then((res) => {
        setIsApplying(false);
      })
      .catch((error) => {
        setError(error);
        setIsApplying(false);
      });
  };

  const flatOrDiscount = item.type.name === 'Flat' ? ` ${priceSymbol}` : '%';
  const amount = `${item.type.value}${flatOrDiscount}`;

  return (
    <View>
      <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={PROMO} style={{ height: 28, width: 28 }} />
            <TextBasic
              style={{
                fontSize: normalizedFontSize(8),
                color: GS.textColorGreyDark3,
                fontFamily: customFont.axiformaMedium,
              }}>
              {' ' + capitalizeFirstLetter(item.name)}
            </TextBasic>
          </View>
          <TextBasic
            style={{
              paddingTop: 10,
              fontSize: normalizedFontSize(6.5),
              color: GS.textColorRed,
              fontFamily: customFont.axiformaMedium,
            }}>
            GET {amount} {item.cashback ? 'Cash Back' : 'OFF'}
          </TextBasic>
          <TextBasic
            style={{
              paddingTop: 5,
              fontSize: normalizedFontSize(6),
              color: GS.textColorGreyDark2,
              fontFamily: customFont.axiformaRegular,
            }}>
            {ValidOn(item)}
          </TextBasic>
        </View>
        {item.description !== '' && (
          <View style={{ marginTop: 15 }}>
            <TextBasic
              style={{
                fontSize: normalizedFontSize(5.5),
                color: GS.textColorGreyDark2,
                fontFamily: customFont.axiformaRegular,
              }}>
              {item.description}
            </TextBasic>
          </View>
        )}
      </View>
      <View
        style={{
          marginTop: item.description !== '' ? 20 : 0,
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 25,
          paddingVertical: 10,
          backgroundColor: GS.bgGreen1,
        }}>
        <View
          style={{
            backgroundColor: `${GS.secondaryColor}30`,
            paddingVertical: 5,
            paddingHorizontal: 5,
            minWidth: 85,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: GS.secondaryColor,
            borderRadius: 8,
          }}>
          <TextBasic
            style={{
              color: '#000',
              fontSize: normalizedFontSize(7.5),
              fontFamily: customFont.axiformaBold,
            }}>
            {item.code}
          </TextBasic>
        </View>
        {appliedPromo && appliedPromo.code === item.code ? (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              minWidth: 70,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MCIcon
              name="checkbox-marked-circle-outline"
              size={20}
              color={GS.secondaryColor}
            />
            <TextBasic
              style={{
                color: GS.textColorGreen1,
                fontSize: normalizedFontSize(7.5),
                fontFamily: customFont.axiformaBold,
              }}>
              APPLIED
            </TextBasic>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onApply}
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
              APPLY
            </TextBasic>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CartPromoList;
