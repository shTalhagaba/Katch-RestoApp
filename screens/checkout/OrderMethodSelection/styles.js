/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import GS from '../../../GlobeStyle';

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtnContainer: { flex: 1, backgroundColor: '#00000000' },
  backButton: { height: '100%' },
  headerWrapper: {
    justifyContent: 'flex-end',
  },
  orderMethodWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: 'silver',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  orderMethodInnerWrapper: { marginRight: 10, flex: 1 },
  ordermethodText: {
    fontSize: 20,
    marginBottom: 10,
    color: GS.textColor,
  },
  orderMethodButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  orderMethodsListWrapper: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  orderMethodButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
    marginBottom: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  orderMethodImageWrapper: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  orderMethodImage: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    overlayColor: '#000',
  },
  orderMethodText: {
    color: '#000',
    marginRight: 'auto',
  },
});

export default styles;
