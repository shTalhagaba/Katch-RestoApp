import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000020',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: GS.lightGrey2,
    borderWidth: 2,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 10,
    width: '90%',
    fontFamily: customFont.axiformaBold,
    fontSize: normalizedFontSize(12),
    padding: 0,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: GS.secondaryColor,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: normalizedFontSize(7),
  },
  errorText: {
    marginVertical: 10,
    color: GS.errorRed,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: GS.greyColor,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000020',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  loadingView: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});

export default styles;
