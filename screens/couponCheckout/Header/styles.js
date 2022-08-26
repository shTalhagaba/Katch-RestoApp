import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../../GlobeStyle';

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GS.textColorGrey1,
    borderRadius: 7,
    marginBottom: 15,
  },
  shopText: {
    fontSize: normalizedFontSize(9),
    fontFamily: customFont.axiformaMedium,
    color: GS.textColorGreyDark3,
  },
  backButton: {
    paddingLeft: 0,
    paddingRight: 15,
  },
  deleteIcon: {
    textAlign: 'right',
    marginLeft: 'auto',
  },
});

export default styles;
