import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 0,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  image: {
    resizeMode: 'contain',
    width: '90%',
    height: '45%',
    marginTop: 50,
  },
  refreshButton: {
    fontSize: normalizedFontSize(9),
    padding: 10,
    backgroundColor: GS.logoGreen,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 30,
    fontFamily: customFont.axiformaSemiBold,
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  desc: {
    fontSize: normalizedFontSize(6),
    color: GS.textColorGrey,
    fontWeight: '400',
    paddingVertical: 2,
    fontFamily: customFont.axiformaBook,
  },
  mainText: {
    fontSize: normalizedFontSize(13),
    color: GS.textColorGreyDark,
    fontFamily: customFont.axiformaBold,
    paddingBottom: 10,
  },
  h2: {
    fontSize: normalizedFontSize(10),
    color: GS.textColorGrey,
    fontFamily: customFont.axiformaBook,
    fontWeight: '900',
  },
  wrapper1: {
    marginVertical: 50,
    alignItems: 'center',
  },
  disable: {
    backgroundColor: GS.greyColor,
  },
});
