import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Swiper from 'react-native-swiper';
import { generateCouponImgScr } from '../../components/Helpers';
//3rd party
//others
import GS from '../../GlobeStyle';
import More from '../../components/Loading/More';

const screenWidth = Dimensions.get('window').width;

const CouponSidler = (props) => {
  const { couponId, couponsImages, showImagesModal } = props;
  const [images, setImages] = useState(null);
  const _timer = useRef(null);
  const _activeSlide = useRef(null);

  const onSnapToItem = (index) => {
    _activeSlide.current && _activeSlide.current(index);
  };

  useEffect(() => {
    setImages(
      couponsImages?.map((image) => {
        return generateCouponImgScr(
          couponId,
          image ? `subImage/${image}` : null,
        );
      }),
    );

    onSnapToItem(0);
  }, [couponsImages]);

  useEffect(() => {
    () => {
      if (_timer.current) {
        clearTimeout(_timer.current);
      }
    };
  }, []);

  const _render = useCallback(() => {
    return images.map((image, index) => {
      const onShowImagesModal = () => {
        showImagesModal(index);
      };
      return (
        <Card key={image} image={image} showImagesModal={onShowImagesModal} />
      );
    });
  }, [images]);

  return images && images.length > 0 ? (
    <View>
      <Swiper
        key="Swiper"
        style={styles.slideStyle}
        height={250}
        autoplayTimeout={5}
        autoplay
        loop
        alwaysBounceHorizontal={false}
        onIndexChanged={onSnapToItem}
        containerStyle={styles.slideStyle}
        showsButtons={false}
        showsPagination={false}>
        {_render()}
      </Swiper>
      {images.length > 1 ? (
        <CarouselPagination list={images} activeSlide={_activeSlide} />
      ) : (
        <View style={styles.height10} />
      )}
    </View>
  ) : (
    <View style={styles.height40} />
  );
};

const Card = ({ image, showImagesModal }) => {
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };
  return (
    <TouchableOpacity onPress={showImagesModal} style={{ height: '100%' }}>
      <ImageBackground
        source={{ uri: image }}
        resizeMode="cover"
        style={{}}
        blurRadius={5}>
        <Image source={{ uri: image }} style={styles.image} onLoad={onLoad} />
      </ImageBackground>
      {loading && (
        <View style={styles.imageLoadingContainer}>
          <More style={styles.imageLoading} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const CarouselPagination = (props) => {
  const { list, activeSlide } = props;
  const [state, setState] = useState();
  useEffect(() => {
    activeSlide.current = (index) => {
      setState(index);
    };
  }, []);
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
        currentIndex={state || 0}
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
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageLoading: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    width: 50,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  height10: {
    height: 10,
  },
  height40: {
    height: 40,
  },
  slideStyle: {},
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
    position: 'absolute',
    bottom: 20,
    zIndex: 201,
  },
});

export default memo(CouponSidler);
