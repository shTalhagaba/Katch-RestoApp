import { gql } from 'graphql-tag';


export const USER_SIGNUP = gql`
  mutation CreateUser($input: SignUpInput) {
    createUser(input: $input) {
      success
      message
      fieldErrors {
        field
        message
      }
      data {
        _id
      }
    }
  }
`;

export const CHECK_USER = gql`
  mutation DoesUserExist($phoneNumber: String, $email: String) {
    doesUserExist(phoneNumber: $phoneNumber, email: $email) {
      email
      phoneNumber
    }
  }
`;

export const GET_USER_EMAIL = gql`
  mutation GetUserEmail($phoneNumber: String) {
    getUserEmail(phoneNumber: $phoneNumber)
  }
`;

export const REVIEW_STORE = gql`
  mutation ReviewStore($review: StoreRatingInput) {
    reviewStore(review: $review)
  }
`;

export const GET_ADDRESSES = gql`
  mutation GetAddresses($ids: [String]) {
    getAddresses(ids: $ids) {
      _id
      phone
      address
      location {
        longitude
        latitude
      }
    }
  }
`;

export const GET_APP_CONFIGS = gql`
  mutation GetAppConfigs {
    appConfigs {
      paymentKey
    }
  }
`;

export const REFUND_ORDER = gql`
  mutation RefundOrder($refundForm: RefundOrderInputs) {
    refundOrder(refundForm: $refundForm)
  }
`;

export const REGISTER_TOKEN = gql`
  mutation RegisterFcmToken($fcmToken: String) {
    registerFcmToken(fcmToken: $fcmToken)
  }
`;

export const CHANGE_ORDER_STATUS = gql`
  mutation ChangeOrderStatus($OrderStatusInput: OrderStatusInput) {
    changeOrderStatus(OrderStatusInput: $OrderStatusInput)
  }
`;

export const VERIFY_PROMO_CODE = gql`
  mutation VerifyPromoCode($promoCode: String, $sellerId: String) {
    verifyPromoCode(promoCode: $promoCode, sellerId: $sellerId) {
      _id
      code
      type {
        name
        minOrder
        maxLimit
        value
      }
      cashback
      name
    }
  }
`;

export const LOG_ERROR = gql`
  mutation LogError($input: ErrorInput) {
    logError(input: $input) {
      error
      errorString
      code
      timeStamp
      timeFormatted
    }
  }
`;
