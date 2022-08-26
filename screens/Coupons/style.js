import { Platform, StatusBar, StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

export default StyleSheet.create({
  safeView: { flex: 1, backgroundColor: '#fff' },
  wrapper: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: 30,
  },
  contentContainerStyle: { paddingHorizontal: 0 },
  mainImage: {
    width: '100%',
    height: 160,
    maxHeight: 160,
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: -20,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    marginTop: -15,
    padding: 15,
    paddingTop: 0,
  },
  discountLabelWrapper: {
    backgroundColor: GS.logoRed,
    maxWidth: 50,
    maxHeight: 50,
    minHeight: 50,
    minWidth: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    top: -25,
    right: 25,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  shareButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    minHeight: 60,
    marginRight: 15,
  },
  discountLabel: {
    fontFamily: customFont.axiformaSemiBold,
    fontSize: normalizedFontSize(8.2),
    color: '#fff',
  },
  textWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: -15,
    minHeight: 110,
    paddingBottom: 10,
  },
  name: {
    fontSize: normalizedFontSize(10),
    fontFamily: customFont.axiformaExtraBold,
    paddingTop: 30,
  },
  description: {
    fontSize: normalizedFontSize(6.5),
    paddingVertical: 5,
    fontFamily: customFont.axiformaRegular,
    color: GS.textColorGrey,
    lineHeight: normalizedFontSize(9.5),
  },
  expireText: {
    color: GS.logoGreen,
    fontFamily: customFont.axiformaSemiBold,
    fontSize: normalizedFontSize(6.0),
  },
  pv2: {
    paddingVertical: 5,
  },
  expireLabel: {
    fontFamily: customFont.axiformaBold,
    fontSize: normalizedFontSize(6.5),
    color: '#000',
  },
  cprice: {
    fontSize: normalizedFontSize(8.5),
    fontFamily: customFont.axiformaExtraBold,
    paddingVertical: 2,
    color: GS.logoGreen,
  },
  cpricel: {
    fontSize: normalizedFontSize(8),
    fontFamily: customFont.axiformaSemiBold,
    paddingVertical: 10,
  },
  strikeprice: {
    textDecorationLine: 'line-through',
  },
  flexRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  justifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    minHeight: 60,
  },
  mh60: {
    minHeight: 60,
    flex: 1,
  },
  smallThumb: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    margin: 8,
    borderRadius: 10,
  },
  bullet: {
    fontSize: normalizedFontSize(3.4),
  },
  logoGreen: {
    color: GS.logoGreen,
  },
  logoRed: {
    color: GS.logoRed,
  },
  padding5: {
    padding: 5,
  },
  storeAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    fontFamily: customFont.axiformaRegular,
    color: GS.secondaryColor,
    fontSize: normalizedFontSize(5.126),
    marginLeft: 10,
  },
  twoThird: {
    flex: 2,
  },
  oneThird: {
    flex: 1,
  },
});
