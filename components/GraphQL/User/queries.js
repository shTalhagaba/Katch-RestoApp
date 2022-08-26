import { gql } from 'graphql-tag';

export const GET_USER_REVIEWS = gql`
  query GetReviewsByUserID($filter: GetReviewsInput) {
    getReviewsByUserID(filter: $filter) {
      data {
        _id
        uid
        displayName
        sellerId
        review
        tags {
          name
          sentiment
          type
        }
        images
        rating
        reviewType
        status
        rejectReason
        createdDate
        lastModifiedDate
        comments {
          _id
        }
        likes {
          userId
        }
        edited
      }
      nextCursor
      next
    }
  }
`;

export const GET_COMMENTS_BY_REVIEWID = gql`
  query getCommentsByReviewID($reviewId: String) {
    getCommentsByReviewID(reviewId: $reviewId) {
      _id
      comment
      status
      uid
      displayName
    }
  }
`;

export const GET_USER_ADDRESS = gql`
  query {
    getUserAddresses {
      _id
      addressType
      area
      block
      street
      building
      floor
      apartmentNo
      houseNo
      office
      landmark
      label
      location {
        type
        coordinates
        _id
      }
    }
  }
`;

export const GET_USER_ORDER = gql`
  query GetUserOrder($orderId: String) {
    getUserOrder(orderId: $orderId) {
      _id
      timeStamp
      timeStampEta
      storeId
      storeName
      customerId
      total
      orderNumber
      orderStatus
      orderCategory
      paymentMethod
      orderRating
      address
      phone
      orderType
      deliveryEta
      location {
        longitude
        latitude
      }
      isDeliveryDelayed
      customerDeliveryCharge
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
      promoInfo {
        isCashback
        value
      }
      orderNotes
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
      itemsCoupons {
        name
        description
        price
        quantity
      }
      vendor
      deliveryOrderID
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

export const GET_USER_ORDERS = gql`
  query GetUserOrders($orderStatus: [String]) {
    getUserOrders(orderStatus: $orderStatus) {
      _id
      timeStamp
      timeStampEta
      storeId
      storeName
      address
      orderNumber
      orderStatus
      total
      logo
      address
      orderType
      location {
        longitude
        latitude
      }
      deliveryOrderID
      deliveryInfo {
        driverName
        driverMobile
        deliveryTrackingLink
        deliveryCompletedAt
        vendor
        deliveryOrderStatus {
          status
          timeStamp
        }
      }
    }
  }
`;

export const GET_USER_WALLET = gql`
  query wallet {
    wallet {
      _id
      uid
      walletTotal
    }
  }
`;

export const GET_USER_WALLET_TRANSACTION = gql`
  query getTransaction {
    walletTransactions {
      transId
      amount
      transDate
      type
      title
    }
  }
`;

export const GET_USER_REFERRAL_CODE = gql`
  query GetUserReferralCode {
    getUserReferralCode {
      userId
      referralCode
      createdDate
    }
  }
`;

export const IS_LANG_SELECTED = gql`
  query IsUserLanguageUpdated {
    isUserLanguageUpdated
  }
`;