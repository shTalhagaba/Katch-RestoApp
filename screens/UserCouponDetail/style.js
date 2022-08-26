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
    borderWidth: 2,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  twrapper: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    minHeight: 180,
    backgroundColor: '#efefef',
    width: '100%',
    paddingHorizontal: 35,
  },
  name: {
    fontSize: normalizedFontSize(18),
    fontFamily: customFont.axiformaBold,
    textAlign: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 30,
    borderBottomWidth: 30,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  topTriangle: {
    borderLeftWidth: 30,
    borderLeftColor: '#fff',
  },
  bottonTriangle: {
    borderRightWidth: 30,
    borderRightColor: '#fff',
  },
  centerView: {
    flexDirection: 'row',
    backgroundColor: '#efefef',
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
  textContainer: {
    backgroundColor: '#efefef',
    flexGrow: 1,
    width: '100%',
    justifyContent: 'flex-start',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    marginTop: -2,
  },
  status: {
    color: GS.logoGreen,
    fontFamily: customFont.axiformaSemiBold,
    textTransform: 'capitalize',
    fontSize: normalizedFontSize(8.2),
    paddingVertical: 10,
  },
  bullet: {
    fontSize: normalizedFontSize(3),
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 13,
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
  logoRed: {
    color: GS.logoRed,
    fontSize: normalizedFontSize(10),
    fontFamily: customFont.axiformaSemiBold,
    paddingVertical: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  desc: {
    color: GS.textColorGreyDark3,
    fontSize: normalizedFontSize(7.2),
    paddingVertical: 10,
  },
  ccLabel: {
    fontSize: normalizedFontSize(9.2),
    textAlign: 'center',
    paddingVertical: 2,
  },
  padding10: {
    paddingVertical: 20,
    justifyContent: 'center',
  },
});
