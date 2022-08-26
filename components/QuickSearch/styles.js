import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  quickContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#b0e9ff',
    borderWidth: 0.5,
    borderColor: '#2cb4eb',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  textColor: {
    fontSize: normalizedFontSize(6),
    color: '#363946',
    paddingVertical: 5,
    textTransform: 'capitalize',
    width: '100%',
  },
  tagView: {},
  seeMore: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  text: {
    paddingTop: 5,
    paddingBottom: 10,
    fontFamily: customFont.axiformaMedium,
    color: '#363946',
    fontSize: normalizedFontSize(9.126),
  },
  seeMoreText: {
    fontSize: normalizedFontSize(6.126),
    color: GS.logoBlue,
    textAlign: 'right',
  },
  wrapper: {
    paddingHorizontal: 15,
  },
});
