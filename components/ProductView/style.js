import { StyleSheet } from 'react-native';
import { normalizedFontSize } from '../../GlobeStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingRight: 10,
    minHeight: 110,
  },
  viewport: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    position: 'absolute',
    zIndex: 1,
    resizeMode: 'cover',
  },
  productContainer: {
    marginTop: 10,
    marginBottom: 25,
    paddingLeft: 20,
    flexGrow: 1,
    flexDirection: 'row',
  },
  category: {
    color: 'gray',
    fontSize: normalizedFontSize(4.5),
    marginBottom: 5,
  },
  shopName: {
    color: 'gray',
    fontSize: normalizedFontSize(4.5),
    marginBottom: 5,
    marginTop: 5,
  },
  wrapperView: {
    backgroundColor: '#d9f7d9',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginRight: 5,
  },
  closedStyle: {
    backgroundColor: '#faaaac',
  },
  wraps: {
    flexDirection: 'row',
    marginTop: 10,
  },
  price: {
    fontSize: normalizedFontSize(4.5),
    color: '#079107',
  },
  storeClosed: {
    fontSize: normalizedFontSize(4.5),
    color: '#a81b20',
  },
  pcontainer: {
    flex: 1.5,
    flexGrow: 1,
    paddingRight: 5,
  },
  h100: { height: '100%' },
});

export { styles };
