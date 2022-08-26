//react
import React, { useState } from 'react';
import { View, Image } from 'react-native';

//3rd party
import { connect } from 'react-redux';

//others
import  {
  RText,
  normalizedFontSize,
  customFont,
  TextBasic,
} from '../../GlobeStyle';
import { DishInfo } from './style';
import { addQuantity, subtractQuantity } from '../Redux/Actions/cartActions';
import SpinnerInput from '../../components/SpinnerInput';
import { animateLayout } from '../Helpers';

const Card = (props) => {
  const {
    name,
    quantity,
    imageScr,
    price,
    addQuantity,
    subtractQuantity,
    cartItemNum,
    options,
  } = props;
  const [showImage, setShowImage] = useState(false);
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          paddingRight: 0,
          borderBottomColor: 'gray',
          borderBottomWidth: 0.2,
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: showImage ? 80 : 0.5,
            height: showImage ? 80 : 0.5,
            borderRadius: 10,
            marginLeft: -10,
            zIndex: 1,
          }}
          source={{ uri: imageScr }}
          onLoad={() => {
            animateLayout()
            setShowImage(true);
          }}
        />
        <DishInfo style={{ justifyContent: 'center' }}>
          <View style={{ justifyContent: 'center', paddingLeft: 20, flex: 1 }}>
            <RText
              style={{
                fontFamily: customFont.axiformaMedium,
                fontSize: normalizedFontSize(6.8),
                maxWidth: 150,
              }}>
              {name}
            </RText>
            {options.length > 0 && (
              <View
                style={{
                  backgroundColor: '#fff',
                  paddingBottom: 10,
                  paddingHorizontal: 0,
                  marginTop: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}>
                {options.map((option, index) => {
                  const list = option.optionsList
                    .map((item) => item.name)
                    .join(', ');

                  return (
                    <View
                      style={{
                        marginBottom: 10,
                      }}
                      key={option.category + index}>
                      <TextBasic
                        style={{
                          fontFamily: customFont.axiformaRegular,
                          marginBottom: 2,
                          color: '#333333',
                          fontSize: normalizedFontSize(5),
                        }}>
                        {option.category}
                      </TextBasic>
                      <TextBasic
                        style={{
                          fontFamily: customFont.axiformaRegular,
                          color: '#738392',
                          marginLeft: 10,
                          fontSize: normalizedFontSize(4),
                        }}>
                        {list}
                      </TextBasic>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <View style={{ justifyContent: 'flex-start', marginTop: 0 }}>
            <SpinnerInput
              onMinus={() => subtractQuantity(cartItemNum)}
              onPlus={() => addQuantity(cartItemNum)}
              value={quantity}
              price={price}
            />
          </View>
        </DishInfo>
      </View>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addQuantity: (cartItemNum) => {
      dispatch(addQuantity(cartItemNum));
    },
    subtractQuantity: (cartItemNum) => {
      dispatch(subtractQuantity(cartItemNum));
    },
  };
};

export default connect(null, mapDispatchToProps)(Card);
