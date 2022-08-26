/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import GS, { normalizedFontSize } from '../../../GlobeStyle';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: -5,
    marginBottom: 10,
    alignItems: 'center',
  },
  rootView: { flexGrow: 1 },
  leftWrapper: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  paymentMethodText: {
    color: GS.textColorGreyDark2,
    fontSize: normalizedFontSize(6.5),
  },
  paymentImageWrapper: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  paymentMethodImage: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    overlayColor: '#000',
  },
  paymentWarningText: {
    color: '#ff5a5a',
    fontSize: normalizedFontSize(6),
    marginTop: 5,
  },
  modalRoot: { flex: 1 },
  modalButtonWrapper: { flex: 1, backgroundColor: '#00000000' },
  modalButton: { height: '100%' },
  modalPaymentSelectRoot: {
    justifyContent: 'flex-end',
  },
  selectPaymentWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: 'silver',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  selectPaymentTextWrapper: { marginRight: 10, flex: 1 },
  selectPaymentText: {
    fontSize: 20,
    marginBottom: 10,
    color: GS.textColor,
  },
  selectPaymentBtn: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  paymentListWrapper: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  paymentListBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
    marginBottom: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  paymentListBtnImageWrapper: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  paymentListBtnImage: {
    height: 30,
    width: 60,
    resizeMode: 'contain',
    overlayColor: '#000',
  },
  paymentListText: { color: '#000', marginRight: 'auto' },
});

export default styles;
