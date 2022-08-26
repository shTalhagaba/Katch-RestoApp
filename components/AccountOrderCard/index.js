import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ONGOING_ORDER, ONGOING_ORDER_BUTTON } from '../../assets/images';
//others
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  RText,
  statusColor,
} from '../../GlobeStyle';
import Icon from '../Icon';

const OrderCard = ({ order, navigation }) => {
  const { storeName, orderStatus } = order;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('OrderSummary', { orderId: order._id })
      }
      style={{
        width: '100%',
        marginVertical: 5,
        backgroundColor: GS.bgGreenLight,
        borderRadius: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        paddingVertical: 10,
        alignItems: 'center',
        paddingLeft: 25,
      }}>
      <Icon
        source={ONGOING_ORDER}
        style={{
          height: 35,
          width: 35,
          resizeMode: 'contain',
        }}
      />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <BoldText
          style={{
            marginBottom: 2,
            color: GS.textColorGreenDark,
            fontSize: normalizedFontSize(8),
          }}>
          Order No. {order.orderNumber}
        </BoldText>
        <RText style={{ fontSize: normalizedFontSize(6) }} numberOfLines={1}>
          {storeName}
        </RText>
      </View>
      <View
        style={{
          backgroundColor: statusColor[orderStatus],
          paddingVertical: 3,
          paddingHorizontal: 10,
          borderRadius: 5,

          marginLeft: 30,
          alignItems: 'center',
        }}>
        <RText
          fontName={customFont.axiformaSemiBold}
          style={{ color: '#fff', fontSize: normalizedFontSize(4) }}>
          {orderStatus.toUpperCase()}
        </RText>
      </View>

      <Icon
        source={ONGOING_ORDER_BUTTON}
        style={{
          height: 30,
          width: 30,
          resizeMode: 'contain',
          marginHorizontal: 10,
        }}
      />
    </TouchableOpacity>
  );
};

const NoOrder = ({ navigation }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        backgroundColor: '#e9fae8',
        borderRadius: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 25,
      }}>
      <RText
        fontName={customFont.axiformaSemiBold}
        style={{ color: '#000', fontSize: normalizedFontSize(8) }}>
        Hungry ? Place an{' '}
      </RText>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{}}>
        <RText
          fontName={customFont.axiformaSemiBold}
          style={{ color: GS.secondaryColor, fontSize: normalizedFontSize(8) }}>
          Order Now
        </RText>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;

export { NoOrder };
