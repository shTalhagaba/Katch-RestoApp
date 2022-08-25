import React, { memo, useRef, useState, Fragment, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
//3rd party

//others
import GS from '../../GlobeStyle';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import BannerCard from '../../components/BannerCard';
import Swiper from 'react-native-swiper';
import More from '../../components/Loading/More';
import { useCallback } from 'react';

const screenWidth = Dimensions.get('window').width;
const autoplayInterval = 5;

const LandingBanner = (props) => {
  const { isLoading, marketingData } = props;
  const [banners, setBanners] = useState(null);
  const _timer = useRef(null);
  const _activeSlide = useRef(null);

  const onSnapToItem = (index) => {
    _activeSlide.current && _activeSlide.current(index);
  };

  useEffect(() => {
    if (marketingData && marketingData.banners) {
      setBanners(marketingData.banners || []);
    }
    onSnapToItem(0);
  }, [marketingData]);

  useEffect(() => {
    () => {
      if (_timer.current) {
        clearTimeout(_timer.current);
      }
    };
  }, []);

  const _render = useCallback(() => {
    return banners.map((banner, index) => {
      return <BannerCard key={index} item={banner} />;
    });
  }, [banners]);

  return banners && isLoading ? (
    <Fragment>
      <Swiper
        key="Swiper"
        onLayout={() => onSnapToItem(0)}
        style={styles.slideStyle}
        height={175}
        autoplay
        loop
        autoplayTimeout={autoplayInterval}
        alwaysBounceHorizontal={false}
        activeDotStyle={styles.activeIndicatorConfig}
        dotStyle={styles.inactiveIndicatorConfig}
        onIndexChanged={onSnapToItem}
        containerStyle={styles.slideStyle}
        activeDotColor={GS.logoGreen}
        showsButtons={false}
        showsPagination={false}>
        {_render()}
      </Swiper>
      {banners.length > 1 ? (
        <CarouselPagination list={banners} activeSlide={_activeSlide} />
      ) : (
        <View style={{ height: 10 }} />
      )}
    </Fragment>
  ) : (
    <View style={styles.loading} />
  );
};

const CarouselPagination = (props) => {
  const { list, activeSlide } = props;
  const [state, setState] = useState();
  useEffect(() => {
    activeSlide.current = (index) => {
      setState(index)
    }
  },[])
  const decreasingDots = [
    {
      config: { color: GS.textColorGrey1, margin: 3, opacity: 1, size: 6 },
      quantity: 1,
    },
    {
      config: { color: GS.textColorGrey1, margin: 3, opacity: 1, size: 4 },
      quantity: 1,
    },
  ];
  return (
    <View style={styles.dotsCarouselContainer}>
      <AnimatedDotsCarousel
        length={list.length}
        currentIndex={state  || 0}
        maxIndicators={4}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{ ...styles.activeIndicatorConfig, size: 8 }}
        inactiveIndicatorConfig={{ ...styles.inactiveIndicatorConfig, size: 6 }}
        decreasingDots={decreasingDots}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    overflow: 'hidden',
    borderRadius: 5,
  },
  buttonStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  bannerStyle: {
    width: '100%',
    minHeight: 120,
    aspectRatio: 2.7709,
  },
  doubleContainer: {
    flex: 1,
    justifyContent: 'space-around',
    overflow: 'hidden',
    borderRadius: 5,
  },
  doubleButtonStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: 'pink',
  },
  doubleBannerStyle: {
    width: '100%',
    height: '100%',
    minHeight: 120,
  },
  loading: {
    width: '95%',
    height: 125,
    borderRadius: 15,
    backgroundColor: GS.placeHolderColor,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  slideStyle: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIndicatorConfig: {
    transform: [{ scale: 0.6 }],
    color: GS.textColorGrey,
    margin: 3,
    opacity: 0.7,
  },
  activeIndicatorConfig: {
    color: GS.secondaryColor,
    margin: 3,
    opacity: 1,
  },
  dotsCarouselContainer: {
    width: screenWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    height: 10,
  },
  doubleCardContainer: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(memo(LandingBanner));
