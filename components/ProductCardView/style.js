import { Dimensions, StyleSheet } from 'react-native';
import GS, { normalizedFontSize } from '../../GlobeStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: GS.greyColor,
    borderRadius: 10,
    marginVertical: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: GS.bgGreen,
    overflow: 'hidden',
  },
  viewport: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    minHeight: 110,
    maxHeight: 110,
    minWidth: Dimensions.get('window').width * 0.9,
    zIndex: 1,
  },
  productContainer: {
    paddingLeft: 10,
    paddingTop: 5,
    flexGrow: 1,
    flexDirection: 'column',
    borderTopWidth: 0.2,
    borderTopColor: '#ddd',
    paddingRight: 75,
  },
  shopNametext: {
    fontSize: normalizedFontSize(7),
    marginTop: 10,
    marginBottom: 10,
    color: GS.logoRed,
  },
  tagContainer: {
    paddingTop: 5,
    flexDirection: 'row',
  },
  tagText: {
    marginRight: 3,
    fontSize: normalizedFontSize(5),
  },
  category: {
    color: 'gray',
    fontSize: normalizedFontSize(4.5),
    marginBottom: 5,
    marginTop: 5,
  },
  itemCategory: {
    color: 'gray',
    fontSize: normalizedFontSize(4.5),
    marginBottom: 5,
  },
  wrapperView: {
    backgroundColor: GS.logoGreen,
    borderRadius: 10,
    height: 50,
    width: 50,
    margin: 'auto',
    flex: 1,
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // textAlignVertical: 'center',
    // textAlign: 'center',
  },
  wraps: {
    position: 'absolute',
    right: 20,
    top: -25,
    zIndex: 1000,
  },
  price: {
    fontSize: normalizedFontSize(7),
    color: '#fff',
    textAlign: 'center',
  },
  pcontainer: {
    flex: 1.5,
    flexGrow: 1,
    paddingRight: 5,
  },
  h100: { height: '100%' },
});

export { styles };
