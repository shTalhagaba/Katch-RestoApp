/* eslint-disable react-native/no-color-literals */
import { Platform, StatusBar, StyleSheet } from 'react-native';
import GS, { normalizedFontSize } from '../../../GlobeStyle';
const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 40,
    paddingVertical: 300,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 100,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 0,
    left: 0,
    paddingHorizontal: 35,
  },
  backButton: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  goHome: {
    height: 75,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: GS.logoGreen,
    borderRadius: 50,
    marginTop: 50,
    textAlign: 'center',
    zIndex: 99,
    width: '100%',
    borderWidth: 4,
    borderColor: GS.secondaryColor,
  },
  goHomeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: normalizedFontSize(12),
    fontWeight: 'bold',
  },
  noStoreContainer: {
    height: 40,
    // borderRadius: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 35,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  boldtext: {
    fontSize: normalizedFontSize(11),
    fontWeight: '900',
  },
  description: {
    fontSize: normalizedFontSize(8),
    color: GS.greyColor,
    lineHeight: normalizedFontSize(12),
  },
  greencolor: {
    color: GS.bgGreenDark1,
    fontWeight: '900',
  },
  wrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: { marginVertical: 100 },
  image: { height: 300, width: 300 },
  menuContainer: { flex: 1, backgroundColor: '#fff' },
});

export default styles;
