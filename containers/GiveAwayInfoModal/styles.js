import GS, { normalizedFontSize, customFont } from '../../GlobeStyle';
import { StatusBar, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 0,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    position: 'absolute',
    backgroundColor: '#ffffff40',
    borderRadius: 100,
    padding: 7,
    zIndex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  detailsContainer: {
    // padding: 20,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  bannerStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  detailsBanner: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '100%',
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    bottom: 0,
  },
  loadingContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles;
