import { Viewport } from '@skele/components';
import React, { Component, createRef } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import withContext from '../../context/cart';
import GS, {
  customFont,
  normalizedFontSize,
  priceSymbol,
  TextBasic,
} from '../../GlobeStyle';
import { showAlert } from '../Alerts';
//others
import { animateLayout, generateProductImgScr } from '../Helpers';
import { clearCouponCart } from '../Redux/Actions/couponcartActions';
import SpinnerInput from '../SpinnerInput';
import { AddTouchable, NumericInputContainer, ProductContainer } from './style';
import Tags from './tags';

const ViewportAware = Viewport.Aware(View);

class ProductsItem extends Component {
  getCartQty = () => {
    const itemQuantity = this.props.cartItems.reduce((acc, item) => {
      if (item.id === this.props.item._id) {
        acc = acc + item.quantity;
      }
      return acc;
    }, 0);

    return itemQuantity;
  };

  state = {
    onDisplayRow: true,
    cartQty: 0,
    imageSrc: {
      uri: generateProductImgScr(this.props.shopId, this.props.item.image),
    },
    showImage: false,
    scrollToDone: false,
    visible: false,
  };

  viewRef = createRef(null);
  qtyRef = createRef(0);

  onChangeLayout = (withAnimation = true) => {
    if (withAnimation) animateLayout();

    this.setState({ onDisplayRow: !this.state.onDisplayRow });
  };

  componentDidMount() {
    // render image for first 5 images
    if (this.props.index < 5) {
      this.onViewportEnter();
    }
    this.setState({ cartQty: this.getCartQty() });
  }

  shouldComponentUpdate(newProps, newState) {
    //when Component is in viewport
    if (newState.visible !== this.state.visible) {
      return true;
    }

    //on change layout
    if (newState.onDisplayRow !== this.state.onDisplayRow) {
      return true;
    }

    //used time out because the condition was checked faster then redux able to apply the changes
    setTimeout(() => {
      // on redux change
      if (
        this.props.context.actions.getCartItem(this.props.item).quantity !==
        this.state.cartQty
      ) {
        this.setState({
          cartQty: this.props.context.actions.getCartItem(this.props.item)
            .quantity,
        });
        return true;
      }
    }, 100);

    //on add, minus and plus
    if (this.state.cartQty !== newState.cartQty) {
      return true;
    }

    //on image error
    if (this.state.showImage !== newState.showImage) {
      return true;
    }

    if (
      this.state.scrollToDone !== newState.scrollToDone &&
      newState.scrollToDone === true
    ) {
      this.onChangeLayout(false);
      return true;
    }

    return false;
  }

  actions = (action) => {
    const state = JSON.parse(JSON.stringify({ ...this.state }));
    let amount;
    if (action === 'plus') {
      const didChange = this.props.context.actions.onPlus(this.props.item);
      if (didChange) {
        amount = state.cartQty + 1;
      }
    } else if (action === 'minus') {
      const didChange = this.props.context.actions.onMinus(this.props.item);
      if (didChange) {
        amount = state.cartQty - 1;
      }
    } else if (action === 'add') {
      if (this.props?.couponCart?.coupons.length) {
        showAlert({
          title: 'Alert',
          message: `There are coupons in your cart. Are you sure you want to clear the cart and add ${this.props.item.name} ?`,
          onConfirm: () => {
            this.props.clearCart();
            const didChange = this.props.context.actions.addToCart(
              this.props.item,
              this.props.shopId,
              this.props.shopName,
            );
            if (didChange) {
              amount = state.cartQty + 1;
            }
          },
        });
      } else {
        const didChange = this.props.context.actions.addToCart(
          this.props.item,
          this.props.shopId,
          this.props.shopName,
        );
        if (didChange) {
          amount = state.cartQty + 1;
        }
      }
    }

    if (amount !== undefined) {
      state.cartQty = amount;
    }

    this.setState(state);
  };

  onViewportEnter = () => {
    if (this.state.imageSrc !== null) {
      this.setState({ visible: true });
    }
  };

  onViewportLeave = () => {
    if (this.state.imageSrc !== null) {
      this.setState({ visible: false });
    }
  };

  render() {
    const { item, context, route, storeInfo } = this.props;
    const { onDisplayRow, cartQty } = this.state;
    return (
      <>
        <View
          ref={this.viewRef}
          onLayout={() => {
            if (
              route.params?.scrollTo === item._id &&
              !this.state.scrollToDone
            ) {
              this.setState({ scrollToDone: true });
              this.viewRef.current.measure((fx, fy, width, height, px, py) => {
                context.ref.list.current.scrollTo({
                  x: 0,
                  y: py - height,
                  animation: true,
                });
              });
            }
          }}
          style={{
            flex: 1,
            width: '100%',
            flexDirection: onDisplayRow ? 'row-reverse' : 'column',
            backgroundColor: '#fff',
            paddingLeft: 20,
            paddingRight: onDisplayRow ? 10 : 20,
            minHeight: 100,
            marginBottom: 10,
          }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ marginBottom: onDisplayRow ? 5 : 0 }}>
              <TouchableOpacity
                onPress={this.state.visible ? this.onChangeLayout : () => null}>
                <ViewportAware
                  onViewportEnter={this.onViewportEnter}
                  onViewportLeave={this.onViewportLeave}
                  style={{
                    width: onDisplayRow ? 80 : '100%',
                    height: onDisplayRow ? 80 : 200,
                  }}>
                  {this.state.visible && (
                    <Image
                      style={styles.productImage}
                      source={this.state.imageSrc}
                      onLoad={() => {
                        animateLayout();
                        this.setState({ showImage: true });
                      }}
                      onError={() =>
                        this.setState({ visible: false, onDisplayRow: true })
                      }
                    />
                  )}
                </ViewportAware>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 5, zIndex: -1 }}>
              {onDisplayRow &&
                (cartQty > 0 ? (
                  <NumericInputContainer>
                    <SpinnerInput
                      onMinus={() => this.actions('minus')}
                      onPlus={() => this.actions('plus')}
                      value={cartQty}
                      price={item.price}
                      onDisplayRow={onDisplayRow}
                    />
                  </NumericInputContainer>
                ) : (
                  <View style={styles.addContainer}>
                    <AddTouchable onPress={() => this.actions('add')}>
                      <TextBasic
                        fontName={customFont.axiformaMedium}
                        style={styles.addBtn}>
                        ADD
                      </TextBasic>
                    </AddTouchable>
                  </View>
                ))}
            </View>
          </View>

          <ProductContainer
            style={{
              marginTop: onDisplayRow ? 0 : 10,
              marginBottom: onDisplayRow ? 0 : 25,
              paddingLeft: 5,
            }}>
            <View style={{ flex: 1.5, flexGrow: 1, paddingRight: 5 }}>
              <TouchableOpacity
                style={{ height: '100%' }}
                onPress={this.state.visible ? this.onChangeLayout : () => null}>
                <TextBasic
                  ellipsizeMode="tail"
                  numberOfLines={!onDisplayRow ? 3 : 1}
                  style={{
                    fontFamily: customFont.axiformaBold,
                    fontSize: normalizedFontSize(6.8),
                  }}>
                  {item.name}
                </TextBasic>
                <TextBasic
                  ellipsizeMode="tail"
                  numberOfLines={onDisplayRow ? 2 : 0}
                  style={styles.itemDescription}>
                  {item.description}
                </TextBasic>
                <Tags tags={item.tags}></Tags>
                <View>
                  <View style={styles.priceTag}>
                    <TextBasic
                      style={{
                        color: GS.textColorGreen,
                        fontSize: normalizedFontSize(5.361),
                        fontFamily: customFont.axiformaMedium,
                      }}>
                      {item.price} {priceSymbol}
                    </TextBasic>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {!storeInfo.comingSoon && (
              <View style={{ minWidth: 100 }}>
                {!onDisplayRow &&
                  (cartQty > 0 ? (
                    <NumericInputContainer>
                      <SpinnerInput
                        onMinus={() => this.actions('minus')}
                        onPlus={() => this.actions('plus')}
                        value={cartQty}
                        price={item.price}
                        onDisplayRow={onDisplayRow}
                      />
                    </NumericInputContainer>
                  ) : (
                    <View style={styles.addContainer}>
                      <AddTouchable onPress={() => this.actions('add')}>
                        <TextBasic
                          fontName={customFont.axiformaMedium}
                          style={styles.addBtn}>
                          ADD
                        </TextBasic>
                      </AddTouchable>
                    </View>
                  ))}
              </View>
            )}
          </ProductContainer>
        </View>
        {this.props.showDivider && <View style={styles.divider} />}
      </>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: GS.lightGrey2,
    marginBottom: 21,
    width: '90%',
    alignSelf: 'center',
  },
  addBtn: {
    fontSize: normalizedFontSize(5.5),
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    color: GS.textColorBlue,
    fontFamily: customFont.axiformaBold,
  },
  addContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  priceTag: {
    backgroundColor: GS.bgGreen,
    borderRadius: 20,
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 10,
    marginRight: 'auto',
  },
  itemDescription: {
    fontFamily: customFont.axiformaRegular,
    color: GS.textColorGrey,
    fontSize: normalizedFontSize(5.5),
    lineHeight: 15,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    zIndex: 1,
    resizeMode: 'cover',
  },
});

const mapStateToProps = (state) => {
  return {
    cartItems: state.cart.addedItems,
    couponCart: state.couponCart,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(clearCouponCart()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withContext(ProductsItem));
