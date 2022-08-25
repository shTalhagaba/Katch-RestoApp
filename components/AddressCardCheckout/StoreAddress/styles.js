import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../../GlobeStyle';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  iconWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: 'contain',
  },
  addressWrapper: {
    flex: 1,
    marginHorizontal: 15,
  },
  addressLabel: {
    color: GS.textColorGreyDark3,
    fontSize: normalizedFontSize(6),
    fontFamily: customFont.axiformaSemiBold,
    marginBottom: 5,
  },
  addressText: {
    color: GS.textColorGreyDark2,
    fontSize: normalizedFontSize(6),
    fontFamily: customFont.axiformaRegular,
    lineHeight: 17,
  },
  changeAddressText: {
    fontFamily: customFont.axiformaSemiBold,
    fontSize: normalizedFontSize(7),
    color: GS.secondaryColor,
  },
  noAddressText: {
    color: GS.textColorGreyDark2,
    fontSize: normalizedFontSize(7),
    marginVertical: 3,
  },
  changeAddressWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
