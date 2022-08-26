import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

export default StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1.8,
    marginHorizontal: 20,
    marginVertical: 20,
    marginTop: 5,
    padding: 15,
  },
  loadingContainer: {
    backgroundColor: GS.bgGreenLight2,
    height: 75,
  },
  landingMessage: {
    fontSize: normalizedFontSize(10.168),
    color: '#fff',
    lineHeight: 35,
    fontFamily: customFont.axiformaSemiBold,
    textAlign: 'center',
  },
});
