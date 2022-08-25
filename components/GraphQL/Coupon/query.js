import gql from 'graphql-tag';

export const GET_COUPONS = gql`
  query {
    getAllCoupons {
      _id
      name
      beforePrice
      afterPrice
      description
      startDate
      mainImage
      shortDescription
      subImage
      remainNum
      maxPerTrans
      endDate
      terms
      sellerId {
        shopName
        phone
        location {
          latitude
          longitude
        }
        deliveryRadius {
          radiusKm
          customerDeliveryCharge
          vendorDeliveryCharge
        }
        _id
      }
    }
  }
`;

export const GET_COUPON_DETAIL = gql`
  query getCouponDetail($couponId: String) {
    getCouponDetail(couponId: $couponId) {
      _id
      name
      beforePrice
      afterPrice
      description
      startDate
      mainImage
      shortDescription
      subImage
      remainNum
      maxPerTrans
      endDate
      terms
      sellerId {
        shopName
        phone
        location {
          latitude
          longitude
        }
        deliveryRadius {
          radiusKm
          customerDeliveryCharge
          vendorDeliveryCharge
        }
        _id
      }
    }
  }
`;

export const GET_USER_COUPONS = gql`
  query {
    getUsersCoupons {
      _id
      couponCode
      status
      couponQrCode
      userId
      createdDate
      validUntil
      coupon: couponId {
        _id
        name
        beforePrice
        afterPrice
        description
        startDate
        mainImage
        shortDescription
        subImage
        remainNum
        maxPerTrans
        endDate
        terms
      }
    }
  }
`;

export const GET_USER_COUPON_DETAIL = gql`
  query getUsersCouponDetail($couponId: String) {
    getUsersCouponDetail(couponId: $couponId) {
      _id
      couponCode
      status
      couponQrCode
      userId
      validUntil
      createdDate
      coupon: couponId {
        _id
        name
        beforePrice
        afterPrice
        description
        startDate
        mainImage
        shortDescription
        subImage
        remainNum
        maxPerTrans
        endDate
        terms
      }
    }
  }
`;

export const GET_COUPON_PAGINATED = gql`
  query getPaginatedCoupons($couponOptions: CouponOptions!) {
    getPaginatedCoupons(couponOptions: $couponOptions) {
      totalPages
      limit
      hasNextPage
      nextPage
      page
      totalDocs
      data {
        _id
        name
        beforePrice
        afterPrice
        description
        startDate
        mainImage
        shortDescription
        subImage
        remainNum
        maxPerTrans
        endDate
        terms
        sellerId {
          shopName
          phone
          location {
            latitude
            longitude
          }
          deliveryRadius {
            radiusKm
            customerDeliveryCharge
            vendorDeliveryCharge
          }
          _id
        }
      }
    }
  }
`;
