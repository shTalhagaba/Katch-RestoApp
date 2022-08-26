import { StyleSheet } from 'react-native';
import GS, { customFont, normalizedFontSize } from '../../GlobeStyle';
export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    flex: 1,
    paddingTop: 15,
  },
  itemrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderTop: {
    borderTopWidth: 0.8,
    borderTopColor: '#dedede',
  },
  fdrow: { flexDirection: 'row' },
  iquantity: {},
  pdr20: {
    paddingRight: 20,
  },
  pdl20: {
    paddingLeft: 20,
  },
  pdt15: {
    paddingTop: 15,
  },
  pdt3: {
    paddingTop: 3,
  },
  pdv15: {
    paddingVertical: 15,
  },
  semiBoldTextItem: {
    fontFamily: customFont.axiformaBold,
    fontSize: normalizedFontSize(7.4),
    color: GS.textColorGreyDark3,
  },
  regularDetailText: {
    fontFamily: customFont.axiformaSemiBold,
  },
  green: {
    backgroundColor: 'green',
  },
  flex1: {
    flex: 1,
  },
  textColorGreen: {
    color: GS.textColorGreen,
  },
  logoGreen: {
    color: GS.logoGreen,
  },
  scrollView: {},
  scrollViewWrapper: {
    borderBottomColor: GS.logoGreen,
    borderBottomWidth: 3,
    paddingBottom: 15,
  },
  wrapper: {},
  detailtext: {
    color: GS.textColorGreyDark3,
    fontSize: normalizedFontSize(7),
  },
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textColorGrey: {
    color: '#666',
  },
  darkerBlack: {
    color: '#333',
  },
  textColorDark: {
    color: '#000',
  },
  fontSize8: {
    fontSize: normalizedFontSize(8),
  },
  pv15: {
    paddingVertical: 15,
  },
  pv2: {
    paddingVertical: 2,
  },
  wrapperDetails: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    borderTopWidth: 1,
    borderTopColor: '#dedede',
  },
  viewWrapper: {
    minHeight: 90,
    backgroundColor: GS.textColorGreen,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 25,
    flexDirection: 'row',
  },
  addressLabel: {
    flex: 1,
    alignItems: 'flex-end',
  },
  whitetext: {
    color: '#fff',
  },
  imageIcon: { height: 60, width: 60, resizeMode: 'contain' },
  imageWrapper: {
    paddingLeft: 25,
    paddingRight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  addressTextLabel: {
    textAlign: 'right',
    lineHeight: normalizedFontSize(10),
    paddingTop: 8,
  },
  category: {
    color: GS.textColorGreyDark3,
    paddingBottom: 2,
  },
  options: { marginLeft: 78 },
  optionList: {
    marginLeft: 10,
    color: GS.textColorGrey,
    paddingBottom: 10,
  },
  couponDescription: {
    marginLeft: 76,
    fontSize: normalizedFontSize(6),
    lineHeight: 18,
    color: '#888',
    fontFamily: customFont.axiformaMedium,
  }
});
