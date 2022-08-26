import React from 'react';
import {View, Dimensions, TouchableOpacity, ScrollView,Modal} from 'react-native';

//3rd party
import Toast from 'react-native-simple-toast';
import {connect} from 'react-redux';
import ADIcon from 'react-native-vector-icons/AntDesign';

//others
import {Container} from './style';
import GS, {RText, BoldText} from '../../GlobeStyle';
import {
  subtractQuantity,
  addQuantity,
} from '../../components/Redux/Actions/cartActions';
import SpinnerInput from '../../components/SpinnerInput';
import withContext from '../../context/cart';

const windowHeight = Dimensions.get('window').height;

const CartCustomization = (props) => {
  const context = props.context;

  if(!context.state.cartItems){
    return null;
  }

  const {cartItems} = context.state;
  const {displayCartItems,displayDishOptions} = context.actions;

  const {getItem} = props;

  const _onAddNewItem = () => {
    const itemWithOption = getItem(cartItems[0].id);
    displayDishOptions(itemWithOption);
    displayCartItems(null);
  };

  const toastOnAdded = (message) =>
    Toast.show(message, Toast.SHORT, ['UIAlertController']);

  const _onPlus = (item) => {
    props.addQuantity(item.cartItemNum);
    toastOnAdded('Added to cart');
    displayCartItems(null);
  };

  const _onMinus = (item) => {
    props.subtractQuantity(item.cartItemNum);
    toastOnAdded('Removed from cart');
    displayCartItems(null);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={cartItems !== null}
      onRequestClose={() => displayCartItems(null)}>
      <View style={{flex: 1}}>
        <View style={{flexGrow: 1, backgroundColor: '#00000005'}}>
          <TouchableOpacity
            style={{height: '100%'}}
            onPress={() => displayCartItems(null)}
          />
        </View>

        <Container
          style={{
            backgroundColor: '#fff',
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderBottomWidth: 0.3,
              borderBottomColor: 'silver',
            }}>
            <View style={{marginRight: 10, flex: 1}}>
              <BoldText
                style={{
                  fontSize: 20,
                  color: GS.textColor,
                }}>
                {cartItems[0].name}
              </BoldText>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start',
              }}
              onPress={() => displayCartItems(null)}>
              <ADIcon color="gray" name="close" size={30} />
            </TouchableOpacity>
          </View>

          <ScrollView
            bounces={false}
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              maxHeight: windowHeight / 1.7,
            }}>
            <>
              {cartItems.map((item, index) => {
                return (
                  <View
                    key={item.name + index}
                    style={{marginVertical: 10, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <BoldText
                        style={{
                          flex: 1,
                          paddingHorizontal: 10,

                          textAlign: 'left',
                        }}>
                        {item.name}
                      </BoldText>

                      {item.options.map((option, index) => {
                        const selections = option.optionsList
                          .map((selection) => selection.name)
                          .join(', ');

                        return (
                          <RText
                            key={option.category + index}
                            style={{
                              flex: 1,
                              paddingHorizontal: 10,
                              color: 'gray',
                              marginTop: 10,
                            }}>
                            {option.category}: {selections}
                          </RText>
                        );
                      })}
                    </View>
                    <View style={{marginRight: 10}}>
                      <SpinnerInput
                        onMinus={() => _onMinus(item)}
                        onPlus={() => _onPlus(item)}
                        value={item.quantity}
                        price={item.price}
                      />
                      <View style={{flex: 1}} />
                    </View>
                  </View>
                );
              })}
            </>
          </ScrollView>
          <TouchableOpacity
            onPress={_onAddNewItem}
            style={{
              height: 50,
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <RText style={{color: GS.secondaryColor, fontSize: 17}}>
              {' '}
              + Add new customization
            </RText>
          </TouchableOpacity>
        </Container>
      </View>
    </Modal>
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

export default connect(null, mapDispatchToProps)(withContext(CartCustomization));
