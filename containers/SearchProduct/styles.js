import { Dimensions, StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
const windowHeight = Dimensions.get('window').height;
import { StatusBar } from 'react-native';
import { Platform } from 'react-native';

const style = StyleSheet.create({
  menuButtonContainer: {
    position: 'absolute',
    height: 30,
    width: 40,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: GS.menuButtonColor,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    zIndex: 2,
    marginBottom: Platform.OS === 'android' ? undefined : 5,
  },
  menuButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuText: {
    color: '#fff',
    fontSize: normalizedFontSize(7.136),
    paddingHorizontal: 10,
    paddingVertical: 5,

    fontFamily: customFont.axiformaMedium,
  },

  categoryText: { color: 'gray', fontSize: 14, maxWidth: 200 },
  length: { color: 'gray', fontSize: 14, marginLeft: 'auto' },
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
    padding: 0,
    height: windowHeight - StatusBar.currentHeight,
  },
  header: {
    padding: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: normalizedFontSize(12),
    textAlign: 'center',
    color: GS.textColorGreyDark3,
    fontFamily: customFont.axiformaSemiBold,
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 0,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    minHeight: 250,
    padding: 10,
    flex: 1,
  },
  searchView: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  textInputView: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 0,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 15,
  },
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'android' ? 'auto' : 10,
    minHeight: normalizedFontSize(10),
    fontSize: normalizedFontSize(8),
  },
  searchButton: {
    width: 45,
    height: 45,
    // padding: 10,
    // borderRadius: 10,
    // backgroundColor: '#333',
  },
  noProduct: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noProductText: {
    color: GS.textColorGreyDark3,
    marginVertical: 50,
  },
  image: {
    height: 200,
    width: 200,
    marginTop: 30,
  },
});

export default style;
