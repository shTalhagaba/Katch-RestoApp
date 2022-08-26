/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import { Platform, StatusBar } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  rootWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 3,
    marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  backButton: {
    paddingLeft: 0,
    paddingRight: 5,
  },
  footerWrapper: {
    marginTop: 10,
    bottom: 0,
  },
  placeOrderWrapper: {
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeOrderButtonText: { color: 'white', fontSize: normalizedFontSize(8) },
  emptyCartWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartImage: {
    width: 300,
    height: 300,
  },
  emptyCartText: { fontSize: 35, color: GS.secondaryColor },
  serviceTextContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  serviceText: {
    fontSize: normalizedFontSize(8),
    marginHorizontal: 20,
    marginBottom: 10,
    fontFamily: customFont.axiformaSemiBold,
  },
  opacity: {
    backgroundColor: '#00000099',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWrapper: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    width: '75%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionFailed: {
    fontSize: normalizedFontSize(12),
    fontFamily: customFont.axiformaBold,
    paddingTop: 20,
    paddingBottom: 10,
    color: GS.textColorGreyDark3,
  },
  tryText: {
    fontSize: normalizedFontSize(6.5),
    paddingBottom: 10,
    color: GS.textColorGreyDark2,
  },
  buttonTouchable: {
    backgroundColor: '#678c6b',
    width: '90%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  okText: {
    fontFamily: customFont.axiformaBold,
    color: '#fff',
  },
  imageWrapper: {
    width: '100%',
  },
  exclamation: {
    resizeMode: 'contain',
    height: 175,
    width: 175,
    marginVertical: 10,
  },
  dots: {
    justifyContent: 'center',
    alignItems: 'center',
   
  },
});

export default styles;
