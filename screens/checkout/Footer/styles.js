/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../../GlobeStyle';

const styles = StyleSheet.create({
  loadingMore: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    flexGrow: 1,
  },
  root: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    alignContent: 'space-between',
    // flex: 1,
  },
  errorWrapper: {
    backgroundColor: '#ffcccc',
    marginBottom: 10,
    borderRadius: 7,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorText: {
    marginLeft: 10,
    color: GS.errorRed,
    fontSize: normalizedFontSize(7),
    paddingRight: 20,
  },
  paymentTitleWrapper: {
    marginRight: 10,
    flex: 1,
  },
  paymentTitleText: {
    fontSize: 15,
    marginBottom: 5,
    color: GS.textColor,
  },
  paymentSummaryWrapper: {
    marginBottom: 10,
    marginLeft: 1,
    marginVertical: 25,
  },
  paymentTotalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  totalText: {
    color: GS.textColorGreyDark2,
    fontSize: normalizedFontSize(6.5),
  },
  useWalletText: {
    color: GS.textColorGreyDark2,
    fontSize: normalizedFontSize(6.5),
    // marginTop: 10,
    flex: 1,
  },
  toggleImage: {
    height: 20,
    width: undefined,
    aspectRatio: 1675 / 767,
    resizeMode: 'contain',
    marginTop: -2,
  },
  walletTotal: {
    fontSize: normalizedFontSize(6.5),
    fontFamily: customFont.axiformaSemiBold,
    color: GS.secondaryColor,
    marginRight: 10,
  },
  total: {
    color: GS.textColorGreyDark3,
    fontSize: normalizedFontSize(7),
  },
  freeDeliveryText: {
    color: GS.logoBlue,
    fontSize: normalizedFontSize(7.2),
    justifyContent: 'flex-end',
  },
  paymentMethodWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 0,
    marginBottom: 10,
  },
  placeOrderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginHorizontal: 20,
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: normalizedFontSize(8),
  },
  paymentListBtnImageWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 10,
  },
  paymentListBtnImage: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    overlayColor: '#000',
  },
  paymentWarningText: {
    color: '#ff5a5a',
    fontSize: normalizedFontSize(6.5),
    marginTop: 5,
  },
});

export default styles;
