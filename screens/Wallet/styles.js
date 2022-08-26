import { StatusBar, StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
const globalPaddingLeft = 30;
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight,

    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  headerInnerContainer: {
    flexGrow: 1,
  },
  walletDetailContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
  },
  walletText: {
    fontSize: normalizedFontSize(12),
    fontFamily: customFont.axiformaExtraBold,
    color: GS.textColorGreen1,
    paddingHorizontal: globalPaddingLeft,
  },
  walletTextSmaller: {
    paddingVertical: 10,
    paddingHorizontal: globalPaddingLeft,
    fontSize: normalizedFontSize(8),
    fontFamily: customFont.axiformaBook,
    color: GS.textColorGreen1,
  },
  translationContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: globalPaddingLeft,
    paddingTop: 25,
    marginVertical: 5,
    flexDirection: 'row',
    // alignItems: 'center',
    borderColor: '#eee',
    borderWidth: 1,
  },
  flex1: {
    flex: 1,
  },
  commentContainer: { paddingBottom: 10 },
  desc: {
    fontFamily: customFont.axiformaSemiBold,
    fontSize: normalizedFontSize(7.2),
    color: GS.textColorGreyDark3,
  },
  orderText: {
    fontSize: normalizedFontSize(5.4),
    marginBottom: 5,
    marginTop: -normalizedFontSize(8),
    color: GS.textColorGrey,
  },
  time: {
    fontFamily: customFont.axiformaRegular,
    color: GS.textColor,
    fontSize: normalizedFontSize(6),
  },
  sectionHeaderContainer: {
    paddingVertical: 15,
    paddingHorizontal: globalPaddingLeft,
    backgroundColor: '#efefef',
  },
  price: {
    fontFamily: customFont.axiformaSemiBold,
    fontSize: normalizedFontSize(8),
    color: GS.textColor,
  },
  tcontainer: {
    marginHorizontal: globalPaddingLeft,
    marginVertical: 10,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },

  bar: {
    borderEndWidth: 5,
    borderRadius: 5,
    borderColor: GS.bgGreenDark1,
    width: 5,
    height: normalizedFontSize(20),
  },
  transactionText: {
    fontFamily: customFont.axiformaExtraBold,
    fontSize: normalizedFontSize(9),
    marginLeft: 15,
  },
  positive: {
    color: GS.textColorGreen,
  },
  negative: {
    color: GS.textColorRed,
  },
  debitCreditImage: { height: 40, width: 40, marginRight: 30 },
  sectionHeaderText: {
    fontSize: normalizedFontSize(8),
    color: '#666',
    fontFamily: customFont.axiformaSemiBold,
  },
  notransaction: {
    height: 200,
    marginBottom: 30,
  },
  notransactiontext: {
    color: GS.textColorGrey,
    fontSize: normalizedFontSize(8),
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingStyle: {
    padding: 15,
    borderRadius: 10,
  },
});
