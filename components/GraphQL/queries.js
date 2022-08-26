import { gql } from 'graphql-tag';

export const GET_SELLER = gql`
  query GetSeller {
    seller {
      id
      shopName
      email
      phone
      verified
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($shopName: String!) {
    getProducts(shopName: $shopName) {
      id
      name
      price
      category
      description
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags($makeSort: Boolean) {
    getTags(makeSort: $makeSort) {
      id
      name
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories($makeSort: Boolean) {
    getCategories(makeSort: $makeSort) {
      id
      name
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $options: PaginationOptions
    $searchInputs: SearchInputs!
  ) {
    searchProducts(options: $options, searchInputs: $searchInputs) {
      data {
        _id
        storeName
        storeId
        shopCategory
        item {
          _id
          name
          price
          image
          category
          tags
        }
      }
      nextCursor: nextPage
      next: hasNextPage
    }
  }
`;

export const SEARCH_SELLERS = gql`
  query SearchSellers(
    $options: PaginationOptions
    $searchInputs: SearchInputs!
  ) {
    searchSellers(options: $options, searchInputs: $searchInputs) {
      data {
        _id
        shopName
        image
        isOpen
        address
        logo
        category
        rating
        minDeliveryOrderValue
        deliveryRadius {
          customerDeliveryCharge
        }
        location {
          longitude
          latitude
        }
        promoCodes {
          _id
          cashback
          type {
            name
            value
          }
        }
        hasCoupons {
          _id
          name
        }
        reviewsCount
        ttp
        tags
        distance
        comingSoon
        busyMode
        storeHours {
          opening
        }
      }
      nextCursor: nextPage
      next: hasNextPage
    }
  }
`;

export const GET_SEARCH = gql`
  query GetSearch($searchInputs: SearchInputs) {
    findWhere(searchInputs: $searchInputs) {
      sellers {
        data {
          _id
          shopName
          image
          isOpen
          address
          logo
          category
          rating
          tags
          location {
            longitude
            latitude
          }
          reviewsCount
          ttp
          distance
          products {
            tags
            image
          }
          comingSoon
          busyMode
          storeHours {
            opening
          }
        }
        nextCursor
        next
      }
      products {
        data {
          _id
          storeName
          storeId
          shopCategory
          item {
            _id
            name
            price
            tags
            image
            category
          }
        }
        nextCursor
        next
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations($boundingBox: BoundingBox) {
    getLocations(boundingBox: $boundingBox) {
      _id
      shopName
      longitude
      latitude
      isOpen
      storeId
    }
  }
`;

export const GET_QUICK_FILTERS = gql`
  query GetQuickFilters {
    getLandingContent {
      quickFilters {
        name
        type
      }
    }
  }
`;

export const GET_ORDERS_TO_REVIEW = gql`
  query GetOrdersToReview {
    getOrdersToReview {
      _id
      storeId
      storeName
    }
  }
`;

export const GET_PROMO_CODES = gql`
  query GetPromoCodes($restId: String) {
    getPromoCodes(restId: $restId) {
      _id
      code
      restApplicable
      remainNumOfApplies
      perUserApply
      respawnTime
      type {
        name
        minOrder
        maxLimit
        value
      }
      cashback
      terms
      name
      description
      restricted
      active
      expiry
      start
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods($storeId: String) {
    getPaymentMethods(storeId: $storeId) {
      vendorID
      paymentMethods
    }
  }
`;

export const GET_ALL_PROMO_CODES = gql`
  query GetRestaurantsWithPromos($filter: GetRestaurantsWithPromosInputs) {
    getRestaurantsWithPromos(filter: $filter) {
      data {
        _id
        shopName
        category
        location {
          longitude
          latitude
        }
        image
        isOpen
        rating
        reviewsCount
        ttp
        tags
        address
        promoCodes {
          _id
          cashback
          type {
            name
            value
          }
        }
        hasCoupons {
          _id
          name
        }
        storeHours {
          opening
        }
      }
      nextCursor
      next
    }
  }
`;
export const GET_PRODUCTLIST_BY_CATEGORY = gql`
  query getItemCollection($category: String) {
    getItemCollection(category: $category)
  }
`;

export const GET_TAGS_BY_STOREID = gql`
  query getTagsByStoreID($storeId: String) {
    getTagsByStoreID(storeId: $storeId)
  }
`;

export const GET_APP_PROPERTIES = gql`
  query getAppProperties {
    getAppProperties {
      reviewTypes
    }
  }
`;
export const APP_INFO = gql`
  query AppInfo {
    appInfo {
      minAppVersion {
        IOS
        Android
      }
    }
  }
`;

export const GET_BOOKMARKS = gql`
  query GetBookMarksByUserID {
    getBookMarksByUserID
  }
`;

export const GET_USER_STORE_BOOKMARKS = gql`
  query GetBookMarkedStoresByUserID($filter: GetBookMarksInput!) {
    getBookMarkedStoresByUserID(filter: $filter) {
      data {
        _id
        shopName
        address
        rating
        reviewsCount
        category
        isOpen
        image
        tags
        ttp
        location {
          longitude
          latitude
        }
        promoCodes {
          _id
          type {
            name
            value
          }
        }
        hasCoupons {
          _id
          name
        }
        storeHours {
          opening
        }
      }
      nextCursor
      next
    }
  }
`;

export const GET_IMAGE_BY_STORE = gql`
  query getImagesByStoreIDWithCursor($filter: GetImagesInput!) {
    getImagesByStoreIDWithCursor(filter: $filter) {
      data
      nextCursor
      next
    }
  }
`;

export const GET_TOTAL_IMAGE_COUNT = gql`
  query getTotalImagesCount($sellerId: String!) {
    getTotalImagesCount(sellerId: $sellerId)
  }
`;

export const GET_OG_URL = gql`
  query getPaymenturl(
    $paymentChannel: String
    $price: String
    $storeId: String
    $selectedService: String
  ) {
    getPaymenturl(
      paymentChannel: $paymentChannel
      price: $price
      storeId: $storeId
      selectedService: $selectedService
    ) {
      url
      minAmount
      onlinePayment
      message
    }
  }
`;

export const GET_SERVICES = gql`
  query getServices {
    getServices {
      _id
      name
    }
  }
`;

export const IS_REFERRAL_AVAILABLE = gql`
  query isReferralAvailable($referralCode: String) {
    isReferralAvailable(referralCode: $referralCode)
  }
`;
