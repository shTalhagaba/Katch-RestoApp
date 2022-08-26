import { StyleSheet } from 'react-native';
import GS, { normalizedFontSize } from '../../../GlobeStyle';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  btnContainer: {
    paddingRight: 5,
    justifyContent: 'flex-end',
  },
  btnTextStyle: ({ clicked }) => ({
    borderWidth: 1,
    borderColor: clicked ? GS.secondaryColor : GS.textColorGreyDark,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 5,
    color: clicked ? GS.secondaryColor : GS.textColorGreyDark,
    fontSize: normalizedFontSize(clicked ? 9 : 8),
  }),
});

export default styles;
