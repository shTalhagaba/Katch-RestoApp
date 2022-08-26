import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInfo: {
    backgroundColor: GS.logoGreen + 20,
    borderWidth: 0.5,
    borderColor: GS.logoGreen + 50,
  },
  containerWarning: {
    backgroundColor: GS.logoRed + 20,
    borderWidth: 0.5,
    borderColor: GS.logoRed + 50,
  },
  infoText: {
    fontSize: normalizedFontSize(9),
    color: GS.logoGreen,
    fontFamily: customFont.axiformaBook,
  },
  warningText: {
    fontSize: normalizedFontSize(9),
    color: GS.logoRed,
    fontFamily: customFont.axiformaBook,
  },
});
export default styles;
