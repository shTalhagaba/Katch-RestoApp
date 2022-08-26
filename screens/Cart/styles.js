import { StyleSheet } from 'react-native';
import GS, { normalizedFontSize } from '../../GlobeStyle';
const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', marginBottom: 15 },
  deliveryOptionText: { fontSize: normalizedFontSize(8.1) },
  button: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingRight: 25,
    alignItems: 'center',
    flex: 1,
  },
  mr15: { marginRight: 15 },
  text: { color: GS.textColorGrey, fontSize: normalizedFontSize(7) },
  modalWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  serviceButton: {
    marginVertical: 5,
    marginRight: 'auto',
    fontSize: normalizedFontSize(8.5),
  },
  opacityStyle: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  lottieContainer: {
    width: 45,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  lottieContainerMini: {
    width: 45,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 'auto',
  },
  lottiePickup: {
    width: 65,
    height: 65,
  },
  lottieDelivery: {
    width: 65,
    height: 65,
  },
  flex1: { flex: 1 },
  lottieStyle: {
    height: 65,
    width: 65,
  },
  pv10: { paddingVertical: 10 },
  deliveryErrorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffcccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  deliveryErrorText: {
    marginLeft: 10,
    color: GS.errorRed,
    fontSize: normalizedFontSize(7),
    paddingRight: 20,
  },
});

export default styles;
