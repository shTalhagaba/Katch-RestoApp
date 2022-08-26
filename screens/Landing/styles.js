import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  serviceButton: {
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: normalizedFontSize(12),
    fontFamily: customFont.axiformaRegular,
    marginHorizontal: 1.7,
  },
  activeServiceButton: {
    color: '#fff',
    backgroundColor: GS.secondaryColor,
    fontFamily: customFont.axiformaBold,
  },
  inactiveServiceButton: {
    backgroundColor: '#f6f6f6',
    color: GS.textColorGreyDark2,
  },
  wrapper: {
    paddingRight: 10,
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  serviceButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  viewport: { flex: 1, backgroundColor: GS.secondaryColor },
  fg1: { flexGrow: 1 },
  contentContainer: {
    flex: 1,
    // borderTopRightRadius: 15,
    // borderTopLeftRadius: 15,
    overflow: 'visible',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 30,
  },
  padding10: {
    marginBottom: 15,
  },
  container: {
    flex: 1,
    backgroundColor: GS.secondaryColor,
  },
  animatedView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 10000,
  },
  newIcon: { flex: 1, width: undefined, height: undefined },
  imgWrap: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: -11,
    right: 20,
    marginTop: 0,
    zIndex: 1,
  },
  whatsappContainer: {
    height: 60,
    width: 60,
    backgroundColor: GS.secondaryColor,
    position: 'absolute',
    zIndex: 3,
    right: 10,
    borderRadius: 60,
  },
  supportIMageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  supportImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  supportText: { color: 'white', fontSize: normalizedFontSize(4.5) },
});
