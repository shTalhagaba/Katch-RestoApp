import gql from 'graphql-tag';

export const CREATE_COUPON_ORDER = gql`
  mutation createUserCoupons($coupons: CouponInput!) {
    createUserCoupons(coupons: $coupons) {
      _id
    }
  }
`;
