import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';

//3rd party
import Toast from 'react-native-simple-toast';
import {connect} from 'react-redux';
import ADIcon from 'react-native-vector-icons/AntDesign';
import CB from 'react-native-check-box';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import currencyJs from 'currency.js';

//others
import {askToClearCart} from '../../components/Alerts';
import {Container} from './style';
import {CartGray} from '../../assets/svg';
import GS, {
  priceSymbol,
  customFont,
  normalizedFontSize,
  TextBasic
} from '../../GlobeStyle';
import {generateProductImgScr} from '../../components/Helpers';
import {addToCart, clearCart} from '../../components/Redux/Actions/cartActions';
import withContext from '../../context/cart';
import {isValidPrice} from '../../components/Helpers';

const windowHeight = Dimensions.get('window').height;

const DishOptions = (props) => {
  const context = props.context;

  if (!context.state.dishOptions) {
    return null;
  }

  const item = context.state.dishOptions;

  const {navigation, shopId, shopName} = props;

  const currency = useRef(
    currencyJs(item.price, {
      precision: 3,
      pattern: `# !`,
      formatWithSymbol: true,
      symbol: priceSymbol,
    }),
  ).current;
  const makeSelections = () => {
    const state = {};
    for (let i = 0; i < item.options.length; i++) {
      const categoryName = item.options[i].category;
      state[categoryName] = [];
    }
    return state;
  };

  const [disableAddButton, setDisableAddButton] = useState(true);
  const [selections, setSelections] = useState(makeSelections());
  const [total, setTotal] = useState(currency);

  //TODO : CLEANUP CODE AND CHECK context.state
  useEffect(() => {optionsMeetMinRequirements(selections);}, []);
  const optionsMeetMinRequirements = (selected) => {
    for (let i = 0; i < item.options.length; i++) {
      const minAmount = item.options[i].minSelect;
      const maxAmount = item.options[i].maxSelect;
      const categoryName = item.options[i].category;
      let valid = true;
      if (maxAmount === -1) {
        if (selected[categoryName].length < minAmount) {
          valid = false;
          setDisableAddButton(!valid);
          break;
        }
      } else if (maxAmount >= 0) {
        if (
          selected[categoryName].length < minAmount ||
          selected[categoryName].length > maxAmount
        ) {
          valid = false;
          setDisableAddButton(!valid);
          break;
        }
      }
      setDisableAddButton(!valid);
    }
  };

  const cartInfo = {
    id: item._id,
    imageScr: generateProductImgScr(shopId, item.image),
    name: item.name,
    price: total.value,
    shopId: shopId,
    shopName: shopName,
  };

  const toastOnAdded = () =>
    Toast.show('Added to cart', Toast.SHORT, ['UIAlertController']);

  const _onCartAdd = () => {
    const options = Object.keys(selections).reduce((acc, key) => {
      if (selections[key].length > 0) {
        acc.push({
          _id: item.options.filter((i) => i.category === key)[0]._id,
          category: key,
          optionsList: selections[key].map((selected) => ({
            _id: selected._id,
            name: selected.name,
            price: selected.price,
          })),
        });
      }

      return acc;
    }, []);

    cartInfo.options = options;

    if (props.items.length > 0 && props.items[0].shopId !== shopId) {
      askToClearCart({
        title: 'Replace cart ?',
        fromName: props.items[0].shopName,
        toName: shopName,
        onConfirm: () => {
          props.clearCart();
          context.actions.storeRestarurantInfoInRedux(props.storeInfo)
          props.addToCart(cartInfo);
          toastOnAdded();
          navigation.setParams({itemId: null});
          context.actions.displayDishOptions(null);
        },
      });
    } else {
      context.actions.storeRestarurantInfoInRedux(props.storeInfo);
      props.addToCart(cartInfo);
      navigation.setParams({itemId: null});
      context.actions.displayDishOptions(null);
      toastOnAdded();
    }
  };

  const accumulateTotal = (toggle, price) => {
    if (toggle) {
      const newTotal = total.add(price);
      if (newTotal.value !== total.value) {
        setTotal(newTotal);
      }
    } else {
      const newTotal = total.subtract(price);
      if (newTotal.value !== total.value) {
        setTotal(newTotal);
      }
    }
  };

  const accumulateTotalRadio = (prevPrice, currentPrice) => {
    const remove = total.subtract(prevPrice);
    const add = remove.add(currentPrice);
    setTotal(add);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={context.state.dishOptions !== null}
      onRequestClose={() => context.actions.displayDishOptions(null)}
      onDismiss={() => navigation.setParams({itemId: null})}>
      <View style={{flex: 1}}>
        <View style={{flexGrow: 1, backgroundColor: '#00000005'}}>
          <TouchableOpacity
            style={{height: '100%'}}
            onPress={() => {
              navigation.setParams({itemId: null});
              context.actions.displayDishOptions(null);
            }}
          />
        </View>

        <Container>
          {/* head */}
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
              borderBottomWidth: 0.3,
              borderBottomColor: 'silver',
            }}>
            <View style={{marginRight: 10, flex: 1}}>
              <TextBasic
                style={{
                  fontFamily: customFont.axiformaMedium,
                  fontSize: normalizedFontSize(7),
                }}>
                {item.name}
              </TextBasic>
              <TextBasic
                style={{
                  fontFamily: customFont.axiformaRegular,
                  fontSize: normalizedFontSize(5),
                  color: GS.textColorGreyDark2,
                }}>
                {item.description}
              </TextBasic>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start',
              }}
              onPress={() => context.actions.displayDishOptions(null)}>
              <ADIcon color="gray" name="close" size={30} />
            </TouchableOpacity>
          </View>
          {/* body */}

          <ScrollView bounces={false} style={{maxHeight: windowHeight / 1.7}}>
            {item.options.map((option, index) => {
              const minAmount = option.minSelect;
              const maxAmount = option.maxSelect;
              if (maxAmount == minAmount && minAmount == 1) {
                return (
                  <Radios
                    key={option.category + index}
                    option={option}
                    selections={selections}
                    accumulateTotalRadio={accumulateTotalRadio}
                    setSelections={setSelections}
                    optionsMeetMinRequirements={optionsMeetMinRequirements}
                  />
                );
              } else {
                return (
                  <CheckBox
                    key={option.category + index}
                    option={option}
                    selections={selections}
                    optionsMeetMinRequirements={optionsMeetMinRequirements}
                    accumulateTotal={accumulateTotal}
                    setSelections={setSelections}
                  />
                );
              }
            })}
          </ScrollView>
          {/* foot */}
          <View style={{margin: 10, flexGrow: 1, justifyContent: 'flex-start'}}>
            <View
              style={{marginTop: 'auto', borderRadius: 10, overflow: 'hidden'}}>
              <TouchableOpacity
                disabled={disableAddButton}
                onPress={_onCartAdd}
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  paddingTop: 12,
                  backgroundColor: disableAddButton
                    ? GS.bgGreenButtonDisabled
                    : GS.bgGreenButtonEnabled,
                  alignItems: 'center',
                  zIndex: 10,
                }}>
                <TextBasic
                  style={{
                    fontSize: normalizedFontSize(7),
                    color: GS.buttonTextColor,
                    marginRight: 'auto',
                    marginBottom: -8,
                    fontFamily:customFont.axiformaMedium,
                  }}>
                  {total.format()}
                </TextBasic>
                <TextBasic
                  style={{
                    fontSize: normalizedFontSize(7),
                    marginRight: 8,
                    marginBottom: -8,
                    color: GS.buttonTextColor,
                    fontFamily:customFont.axiformaMedium,
                  }}>
                  ADD TO CART
                </TextBasic>
                <CartGray height={25} width={25} stroke="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </View>
    </Modal>
  );
};
const mapStateToProps = (state) => {
  return {
    items: state.cart.addedItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => {
      dispatch(addToCart(product));
    },
    clearCart: () => {
      dispatch(clearCart());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withContext(DishOptions));

const CheckBox = (props) => {
  const {
    option,
    selections,
    setSelections,
    accumulateTotal,
    optionsMeetMinRequirements,
  } = props;

  const minAmount = option.minSelect;
  const maxAmount = option.maxSelect;

  let selectMessage;

  const optionMethod = (toggled, obj) => {
    setSelections((state) => {
      const categoryName = option.category;
      accumulateTotal(toggled, obj.price);
      const newState = {...state};

      if (toggled) {
        newState[categoryName].push(obj);

        optionsMeetMinRequirements(newState);

        return newState;
      } else {
        newState[categoryName] = newState[categoryName].filter(
          (option) => option._id !== obj._id,
        );

        optionsMeetMinRequirements(newState);

        return newState;
      }
    });
  };

  if (maxAmount === -1) {
    if (minAmount === 0) {
      selectMessage = 'Select Any';
    } else {
      selectMessage = `Select Atleast ${minAmount}`;
    }
  } else if (maxAmount > 0) {
    selectMessage = `Select Any Between ${minAmount} and ${maxAmount}`;
  }

  return (
    <View style={{padding: 10, paddingHorizontal: 20}}>
      <TextBasic
        style={{
          fontFamily: customFont.axiformaSemiBold,
          fontSize: normalizedFontSize(6.5),
        }}>
        {option.category}
      </TextBasic>
      <TextBasic
        style={{
          fontFamily: customFont.axiformaRegular,
          fontSize: normalizedFontSize(5.5),
          color: GS.textColorGrey,
        }}>
        {selectMessage}
      </TextBasic>
      <CheckBoxOptions
        maxAmount={maxAmount}
        selections={selections}
        category={option.category}
        options={option.optionsList}
        optionMethod={optionMethod}
      />
    </View>
  );
};

const CheckBoxOptions = (props) => {
  const {options, optionMethod, selections, category, maxAmount} = props;

  const selectedLength = selections[category] ? selections[category].length : 0;

  const isSelectable = (id) => {
    const selectionsId = selections[category].map((selection) => selection._id);
    return selectedLength === maxAmount && !selectionsId.includes(id);
  };

  return options.map((option, index) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    return (
      <View
        key={option._id}
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onStartShouldSetResponder={() => {
          if(!isSelectable(option._id)){
            setToggleCheckBox((state) => {
              optionMethod(!state, option);
              return !state;
            });
          }
        }}>
        <TextBasic
          style={{
            fontFamily: customFont.axiformaMedium,
            fontSize: normalizedFontSize(6),
          }}>
          {option.name}
        </TextBasic>
        <TextBasic
          style={{
            marginLeft: 'auto',
            marginRight: 10,
            fontFamily: customFont.axiformaMedium,
            fontSize: normalizedFontSize(6),
          }}>
          {
            isValidPrice(option.price) ?
              `${option.price} ${priceSymbol}` :
              ''
          }
        </TextBasic>
        <CB
          disabled={isSelectable(option._id)}
          onClick={() => {
            setToggleCheckBox((state) => {
              optionMethod(!state, option);
              return !state;
            });
          }}
          style={{
            borderColor: 'black',
            borderColor: toggleCheckBox ? GS.textColorBlue : GS.textColorGrey,
            borderWidth: 2,
          }}
          isChecked={toggleCheckBox}
          uncheckedCheckBoxColor={'#00000005'}
          checkedCheckBoxColor={GS.textColorBlue}
        />
      </View>
    );
  });
};

const Radios = ({
  option,
  setSelections,
  accumulateTotalRadio,
  optionsMeetMinRequirements,
}) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelections((state) => {
      state[option.category] = [
        {
          _id: option.optionsList[selected]._id,
          name: option.optionsList[selected].name,
          price: option.optionsList[selected].price,
        },
      ];
      optionsMeetMinRequirements(state);
      return state;
    });
  }, [selected]);

  useEffect(() => {
    accumulateTotalRadio('0', option.optionsList[selected].price);
  }, []);

  const _onSelect = (index) => {
    accumulateTotalRadio(
      option.optionsList[selected].price,
      option.optionsList[index].price,
    );
    setSelected(index);
  };

  return (
    <View
      style={{
        marginTop: 20,
        paddingHorizontal: 20,
      }}>
      <TextBasic
        style={{
          fontFamily: customFont.axiformaSemiBold,
          fontSize: normalizedFontSize(6.5),
        }}>
        {option.category}
      </TextBasic>
      <TextBasic
        style={{
          fontFamily: customFont.axiformaRegular,
          fontSize: normalizedFontSize(5.5),
          color: GS.textColorGrey,
        }}>
        Select Any One
      </TextBasic>
      <RadioForm formHorizontal={false} animation={true}>
        {option.optionsList.map((obj, i) => (
          <View key={`${obj.name}-${i}`} onStartShouldSetResponder={() =>_onSelect(i)}>
            <RadioButton
              labelHorizontal={true}
              key={obj + i}
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <TextBasic
                style={{
                  fontFamily: customFont.axiformaRegular,
                  fontSize: normalizedFontSize(6),
                }}>
                {obj.name}
              </TextBasic>
              <TextBasic
                style={{
                  marginLeft: 'auto',
                  marginRight: 10,
                  fontFamily: customFont.axiformaRegular,
                  fontSize: normalizedFontSize(6),
                }}>
                  {
                    isValidPrice(obj.price) ?
                      `${obj.price} ${priceSymbol}` :
                      ''
                  }
              </TextBasic>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={selected === i}
                onPress={() => _onSelect(i)}
                borderWidth={2}
                buttonInnerColor={selected === i ? GS.textColorBlue : '#fff'}
                buttonOuterColor={
                  selected === i ? GS.textColorBlue : GS.textColorGreyDark
                }
                buttonSize={15}
                buttonOuterSize={25}
                buttonStyle={{}}
                buttonWrapStyle={{marginLeft: 10}}
              />
            </RadioButton>
          </View>
        ))}
      </RadioForm>
    </View>
  );
};
