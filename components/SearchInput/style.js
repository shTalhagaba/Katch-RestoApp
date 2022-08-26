import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  wrapper: {
    backgroundColor: '#fff',
    height: 40,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#b3b3b380',
    paddingVertical: 20,
    overflow: 'hidden',
  },
  image: { height: 20, width: 20, marginRight: 20 },
  inputBox: {
    flex: 1,
    alignItems: 'stretch',
    height: 50,
    color: GS.textColorGreyDark3,
    fontFamily: customFont.axiformaRegular,
    fontWeight: 'normal',
    fontSize: normalizedFontSize(6.5),
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3b3b380',
    borderRadius: 8,
    overflow: 'hidden',
  },
  filterIcon: { height: 40, width: 40 },
});

export default style;
