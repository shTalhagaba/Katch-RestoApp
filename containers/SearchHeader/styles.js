import { StyleSheet } from 'react-native';
import { normalizedFontSize, customFont } from '../../GlobeStyle';
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  clickable: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  toggleImage: {
    height: normalizedFontSize(9),
    width: undefined,
    aspectRatio: 1675 / 767,
    resizeMode: 'contain',
    marginTop: -2,
    marginHorizontal: 5,
  },
  text: {
    fontSize: normalizedFontSize(6),
    color: '#000',
    fontFamily: customFont.axiformaRegular,
  },
});
