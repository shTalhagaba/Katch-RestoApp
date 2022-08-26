import { StyleSheet } from 'react-native';

//others
import GS, {
  normalizedFontSize,
  customFont,
} from '../../GlobeStyle';


const styles = StyleSheet.create({
  modalStyle: {
    padding: 0,
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  innerContainer: {
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 400,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: normalizedFontSize(7),
    color: GS.greyColor,
    textAlign: 'center',
    lineHeight: 20,
  },
  langButtonContainer: {
    flexDirection: 'row',
  },
  langButton: {
    borderWidth: 2,
    borderColor: GS.secondaryColor,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    marginVertical: 20,
    color: GS.secondaryColor,
  },
  langButtonText: {
    color: GS.secondaryColor,
    fontSize: normalizedFontSize(7),
    fontFamily: customFont.axiformaSemiBold,
  },
  langButtonNotSelected: {
    borderColor: GS.greyColor,
  },
  langButtonTextNotSelected: {
    color: GS.greyColor,
  },
  saveButton: {
    backgroundColor: GS.secondaryColor,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 15,
  },
  cancelButton: {
    backgroundColor: GS.logoRed,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: normalizedFontSize(8.5),
    fontFamily: customFont.axiformaBold,
  },
  saveButtonDisabled: {
    backgroundColor: GS.greyColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


export default styles;