/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
const styles = StyleSheet.create({

  mainContainer: {
    flexDirection: 'row',
  },
  logo: {
    height: 75,
    width: 75,
    borderRadius: 15,
  },
  logoContainer: {
    borderRadius: 15,
  },
  container: {
    flex: 1,
    borderRadius: 15,
    minHeight: 75,
    flexDirection: 'row',
    marginHorizontal: 30,
    padding: -10,
  },
  description: {
    color: GS.textColor,
    fontSize: normalizedFontSize(6.8),
    fontFamily: customFont.axiformaSemiBold,
    lineHeight: 18,
  },
  message: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  timerStyle: {
    position: 'absolute',
    top: 0,
  },
  close: {
    position: 'absolute',
    top: -15,
    right: -15,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconContainer: {
    height: 18,
    width: 18,
    textAlign: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ml40: {
    marginLeft: 40,
  },
});

export default styles;
