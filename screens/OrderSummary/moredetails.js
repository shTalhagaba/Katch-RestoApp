import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { ADDRESS_LABEL } from '../../assets/images';
import serviceTypes from '../../constants/serviceTypes';
import { priceSymbol, RText } from '../../GlobeStyle';
import styles from './styles';

const getDeliveryPrice = (price) => {
  if (!price) {
    return false;
  }
  try {
    return parseFloat(price).toFixed(3) + ` ${priceSymbol}`;
  } catch (e) {
    return false;
  }
};

const MoreDetails = ({ order }) => {
  const [cartTotal, setCartTotal] = useState('');
  const calculateCartTotal = (order) => {
    let sum = 0;
    order.items.forEach((x) => {
      sum += parseFloat(x.quantity) * parseFloat(x.price);
    });
    setCartTotal(`${sum.toFixed(3)} ${priceSymbol}`);
  };
  useEffect(() => {
    if (order) {
      calculateCartTotal(order);
    }
  }, [order]);
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.scrollViewWrapper}>
          <View>
            {(order?.items.length ? order?.items : order?.itemsCoupons).map(
              (item, index) => {
                return (
                  <View key={item._id}>
                    <View
                      style={[
                        styles.itemrow,
                        index !== 0 ? styles.borderTop : {},
                        item.description ? styles.pdt15 : styles.pdv15,
                      ]}>
                      <View style={styles.fdrow}>
                        <RText
                          style={[
                            styles.iquantity,
                            styles.semiBoldTextItem,
                            styles.pdr20,
                            styles.pdl20,
                          ]}>
                          {item.quantity}
                        </RText>
                        <RText
                          style={[
                            styles.iquantity,
                            styles.semiBoldTextItem,
                            styles.pdr20,
                          ]}>
                          x
                        </RText>
                      </View>
                      <RText
                        style={[
                          styles.iquantity,
                          styles.semiBoldTextItem,
                          styles.flex1,
                        ]}>
                        {item.name}
                      </RText>
                      <RText
                        style={[
                          styles.iquantity,
                          styles.semiBoldTextItem,
                          styles.logoGreen,
                        ]}>
                        {item.price} {priceSymbol}
                      </RText>
                      {item.options?.length > 0 &&
                        item.options.map((option) => {
                          return (
                            <View key={option.category} style={styles.options}>
                              <RText style={styles.category}>
                                {option.category}
                              </RText>
                              <RText style={styles.optionList}>
                                {option.optionsList
                                  .map((list) => list.name)
                                  .join(', ')}
                              </RText>
                            </View>
                          );
                        })}
                    </View>
                    {item.description && 
                    <View style={[styles.fdrow, styles.pdt3]}>
                        <RText
                        style={[
                          styles.flex1,
                          styles.couponDescription,
                        ]}>
                        {item.description}
                      </RText>
                      </View>}
                  </View>
                );
              },
            )}
          </View>
        </View>
        <View style={[styles.wrapper, styles.flex1]}>
          <DetailContainer
            text={'Cart Total'}
            textBold={true}
            value={cartTotal}
          />

          <View style={styles.wrapperDetails}>
            <DetailContainer
              text={'Payment Method'}
              value={order?.paymentMethod}
            />
            <DetailContainer
              text={`${
                order?.promoInfo?.isCashback ? 'Cash Back' : 'Promo Code'
              } (${order?.promoCode})`}
              value={
                order?.promoInfo?.value
                  ? `${order?.promoInfo?.value} ${priceSymbol}`
                  : false
              }
            />
            {serviceTypes.delivery === order.orderType && (
              <DetailContainer
                text={'Delivery Charge'}
                value={getDeliveryPrice(order?.customerDeliveryCharge)}
              />
            )}
            <DetailContainer
              text={'Wallet Credit Used'}
              value={
                order?.walletdec && parseFloat(order.walletdec)
                  ? `${order?.walletdec} ${priceSymbol}`
                  : false
              }
            />
          </View>
          <DetailContainer
            text={'Total'}
            textBold={true}
            value={`${order?.total} ${priceSymbol}`}
          />
          <AddressCard address={order?.userAddress} />
        </View>
      </ScrollView>
    </View>
  );
};

const AddressCard = ({ address }) => {
  const addressInfo = address
    ? {
        house: `${address.area}, ${address.street}, Block: ${address.block}, House No: ${address.houseNo}`,
        apartment: `${address.area}, ${address.street}, Block: ${address.block}, Building: ${address.building} Floor: ${address.floor}, Apartment No: ${address.apartmentNo}`,
        office: `${address.area}, ${address.building}, ${address.street}, Block: ${address.block}, Floor: ${address.floor}, ${address.office}`,
      }
    : {};
  return (
    address && (
      <View style={styles.viewWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={ADDRESS_LABEL} style={styles.imageIcon} />
        </View>
        <View style={styles.addressLabel}>
          <RText
            style={[
              styles.semiBoldTextItem,
              styles.fontSize8,
              styles.whitetext,
            ]}>
            Delivery Address
          </RText>
          <RText style={[styles.addressTextLabel, styles.whitetext]}>
            {addressInfo[address?.addressType.toLowerCase()]}
          </RText>
        </View>
      </View>
    )
  );
};

const DetailContainer = ({ text, value, textBold = false }) => {
  return text && value ? (
    <View
      style={[styles.detailWrapper, styles.pdl20, textBold ? styles.pv15 : {}]}>
      <RText
        style={[
          styles.detailtext,
          textBold ? styles.semiBoldTextItem : styles.regularDetailText,
          textBold ? styles.textColorDark : styles.textColorGrey,
          textBold ? styles.fontSize8 : {},
        ]}>
        {text}
      </RText>
      <RText
        style={[
          styles.detailtext,
          styles.semiBoldTextItem,
          textBold ? styles.fontSize8 : styles.pv2,
          textBold ? styles.textColorDark : styles.textColorGrey,
          styles.darkerBlack,
        ]}>
        {value}
      </RText>
    </View>
  ) : null;
};

export default MoreDetails;
