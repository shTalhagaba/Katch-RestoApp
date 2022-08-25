import { Dimensions, StyleSheet } from 'react-native';
import GS from '../../GlobeStyle';

const windowWidth = Dimensions.get('window').width;

const style = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 30,
    paddingRight: 10,
  },
  wrapper: { backgroundColor: '#fff', paddingBottom: 20 },
  mt10: { marginTop: 10 },
  pl10: { paddingLeft: 10 },
  pl0: { paddingLeft: 0 },
  loadingWrapper: { marginTop: 30, flexDirection: 'row' },
  loadingContainer: { width: windowWidth - 50, paddingLeft: 20 },
  loading: {
    height: 110,
    minWidth: '80%',
    borderRadius: 20,
    backgroundColor: GS.placeHolderColor,
  },
  loadingMore: {
    justifyContent: 'center',
    marginRight: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    flexGrow: 1,
  },
});

export default style;
