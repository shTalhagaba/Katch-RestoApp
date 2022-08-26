import { gql } from 'graphql-tag';
export const ORDER_STATUS_CHANGE = gql`
  subscription OrderStatusChanged($customerId: String) {
    orderStatusChanged(customerId: $customerId) {
      _id
      timeStamp
      timeStampEta
      storeId
      storeName
      customerId
      total
      orderNumber
      orderStatus
      paymentMethod
      orderRating
      orderType
      items {
        _id
        name
        quantity
        price
        options {
          _id
          category
          optionsList {
            _id
            name
            price
          }
        }
      }
      vendor
      deliveryOrderID
      isDeliveryDelayed
      deliveryEta
      walletdec
      userAddress {
        addressType
        area
        block
        street
        building
        floor
        apartmentNo
        houseNo
        office
        location {
          coordinates
        }
        landmark
        label
      }
      promoCode
      orderNotes
      deliveryInfo {
        driverName
        driverMobile
        deliveryTrackingLink
        deliveryCompletedAt
        deliveryOrderStatus {
          status
          timeStamp
        }
      }
    }
  }
`;
