import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
const style = StyleSheet.create({
  addressList: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  container: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    right: 0,
  },
  locationContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  locationButtonText: {
    marginLeft: 10,
    color: GS.secondaryColor,
    fontSize: normalizedFontSize(6.5),
    fontFamily: customFont.axiformaMedium,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000050',
  },
  modalBackgroundToucable: {
    flexGrow: 0.6,
  },
  modalInnderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  modalHeaderText: {
    fontSize: normalizedFontSize(9),
    color: GS.textColorGreyDark3,
  },
  modalCloseButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  selectableAddress: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 35,
    marginTop: 15,
  },
  selectableAddressText: {
    fontSize: normalizedFontSize(8.5),
    marginRight: 'auto',
    paddingHorizontal: 10,
  },
  selectableAddressIcon: {
    marginRight: 20,
  },
  addAddressContainer: {
    backgroundColor: '#fff',
  },
  addAddressText: {
    fontSize: normalizedFontSize(7),
    marginLeft: 10,
    marginTop: 5,
    marginHorizontal: 10,
    color: GS.secondaryColor,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    marginHorizontal: 0,
    backgroundColor: '#fff',
  },
  ph5: { paddingHorizontal: 5 },
});

export default style;
