/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  RefreshControl,
  Animated,
  Image,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { MENU_BACKGROUND } from '../../assets/images';

//3rd party

//others
import ProductsItem from '../../components/RestProduct';
import ListHeader from '../../components/RestProduct/listHeader';
import withContext from '../../context/cart';
import GS, { RText } from '../../GlobeStyle';
import RestInfo from '../RestInfo';
import ViewportNotifier from '../ViewportNotifier';

class RestProductList extends Component {
  spaceTransition = this.props.translateY.interpolate({
    inputRange: [171, 342],
    outputRange: [
      0,
      Platform.OS === 'ios' ? 95 : 75 + (StatusBar.currentHeight - 24),
    ],
    extrapolate: 'clamp',
  });

  state = {
    refreshing: false,
    viewportWidth: 0,
    viewportHeight: 0,
    shouldMeasureLayout: true,
    position: 0,
  };

  onRefresh = () => {
    this.setState({ refreshing: !this.state.refreshing });
    this.props.refresh(() =>
      this.setState({ refreshing: !this.state.refreshing }),
    );
  };

  componentWillUnmount() {
    this.props.navigation.setParams({
      scrollTo: null,
      category: null,
    });
  }

  renderProducts = () =>
    this.props.productList.map((item, index) => {
      const { translateY, storeInfo, setCartItems, navigation, route } =
        this.props;
      return item.hasOwnProperty('title') ? (
        <ListHeader
          index={index}
          route={route}
          navigation={navigation}
          key={`${item.title} ${index}`}
          title={item.title}
          translateY={translateY}
        />
      ) : (
        <ProductsItem
          route={route}
          index={index}
          navigation={navigation}
          key={`${item._id} ${index}`}
          shopName={storeInfo.shopName}
          shopId={storeInfo._id}
          item={item}
          storeInfo={storeInfo}
          setCartItems={setCartItems}
          showDivider={index < this.props.productList.length - 1}
        />
      );
    });

  render() {
    const {
      translateY,
      storeInfo,
      promoCodes,
      headersIndex,
      context,
      _onViewportChange,
    } = this.props;
    return (
      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        stickyHeaderIndices={headersIndex}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
        ref={context.ref.list}
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          flexGrow: 1,
          transform: [{ translateY: this.spaceTransition }],
        }}
        onLayout={(event) => {
          //removing this helps out with layoutanimation not washing out the initial shown items in android
          // this.props._onViewportChange({
          //   viewportWidth: event.nativeEvent.layout.width,
          //   viewportHeight: event.nativeEvent.layout.height,
          //   viewportOffsetX: 0,
          //   viewportOffsetY: 0,
          //   shouldMeasureLayout: true,
          // });

          this.setState({
            viewportWidth: event.nativeEvent.layout.width,
            viewportHeight: event.nativeEvent.layout.height,
            shouldMeasureLayout: true,
          });
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: translateY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
            listener: ({ nativeEvent: { contentOffset } }) => {
              context.ref.menuCurrentScrollY.current = contentOffset.y;

              _onViewportChange({
                viewportWidth: this.state.viewportWidth,
                viewportHeight: this.state.viewportHeight,
                viewportOffsetX: contentOffset.x,
                viewportOffsetY: contentOffset.y,
                shouldMeasureLayout: this.state.shouldMeasureLayout,
              });
            },
          },
        )}>
        <RestInfo storeInfo={storeInfo} promoCodes={promoCodes} />

        {storeInfo.comingSoon ? (
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
              padding: 20,
            }}>
            <Image
              source={MENU_BACKGROUND}
              style={{ height: 200, width: 200 }}
              resizeMode="contain"
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <RText
                style={{
                  marginTop: 30,
                  color: GS.greyColor,
                  justifyContent: 'center',
                  marginHorizontal: 'auto',
                }}>
                {storeInfo.comingSoon
                  ? "Menu's Coming Soon !!"
                  : 'No Menu Item'}
              </RText>
            </View>
          </View>
        ) : (
          this.renderProducts()
        )}
      </Animated.ScrollView>
    );
  }
}

class ViewportProvider extends Component {
  render() {
    return (
      <ViewportNotifier>
        <RestProductList {...this.props} />
      </ViewportNotifier>
    );
  }
}

export default withContext(ViewportProvider);
