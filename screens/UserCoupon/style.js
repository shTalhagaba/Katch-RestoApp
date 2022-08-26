import { Platform, StatusBar, StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

export default StyleSheet.create({
  safeView: { flex: 1, backgroundColor: '#fff' },
  wrapper: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainerStyle: { paddingHorizontal: 15, flexGrow: 1 },
  usercardcontainer: {
    marginVertical: 10,
    borderRadius: 15,
    minHeight: 150,
    borderColor: GS.textColorGrey1,
    backgroundColor: '#efefef',
    flexDirection: 'row',
  },
  couponWrap: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  justifyC: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 80,
    minWidth: 80,
  },
  couponIcon: {
    width: 80,
    height: 80,
  },
  name: {
    fontFamily: customFont.axiformaSemiBold,
    fontSize: normalizedFontSize(9),
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  topTriangle: {
    borderTopWidth: 15,
    borderBottomColor: 'transparent',
    borderTopColor: '#fff',
  },
  bottonTriangle: {
    borderBottomWidth: 15,
    borderBottomColor: '#fff',
    borderTopColor: 'transparent',
  },
  desc: {
    color: GS.greyColor,
    fontSize: normalizedFontSize(6.8),
    paddingVertical: 4,
  },
  dashLine: {
    flex: 1,
    width: 1,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  logoRed: {
    color: GS.logoRed,
    fontSize: normalizedFontSize(8),
    fontFamily: customFont.axiformaSemiBold,
    paddingVertical: 5,
  },
  status: {
    color: GS.logoGreen,
    fontFamily: customFont.axiformaSemiBold,
    textTransform: 'capitalize',
  },
  bullet: {
    fontSize: normalizedFontSize(3),
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  logoGreenColor: {
    color: GS.logoGreen,
  },
  logoRedColor: {
    color: GS.logoRed,
  },
  flexRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  noCouponsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  noCoupons: {
    fontSize: normalizedFontSize(9),
    fontFamily: customFont.axiformaSemiBold,
    color: GS.greyColor1,
  },
});
