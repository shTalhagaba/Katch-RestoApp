/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import GS, { normalizedFontSize } from '../../../GlobeStyle';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    // paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: normalizedFontSize(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  lottieContainer: {
    width: 45,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lottiePickup: {
    width: 65,
    height: 65,
  },
  lottieDelivery: {
    width: 65,
    height: 65,
  },
});

export default styles;
