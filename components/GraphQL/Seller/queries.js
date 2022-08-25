import { gql } from 'graphql-tag';

export const GET_STORE_BY_SERVICE_TYPE = gql`
  query GetStoresByServiceTypes($filter: GetStoresByServiceTypeInput) {
    getStoresByServiceTypes(filter: $filter) {
      data {
        _id
        shopName
        address
        rating
        category
        isOpen
        tags
        location {
          longitude
          latitude
        }
        hasCoupons {
          _id
          name
        }
        ttp
        image
        reviewsCount
        storeHours {
          opening
        }
      }
      nextCursor
      next
    }
  }
`;

export const GET_COLLECTIONS = gql`
  query getAllCollections {
    getAllCollections {
      _id
      name
      description
      sellers {
        data {
          _id
          shopName
          address
          rating
          isOpen
          tags
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
          ttp
          image
          reviewsCount
          comingSoon
          busyMode
          storeHours {
            opening
          }
        }
        next
        nextCursor
      }
      bannerImage
    }
  }
`;

export const GET_STORES_COLLECTION_ID = gql`
  query getStoresByCollectionID(
    $limit: Int
    $collectionID: String!
    $cursor: String
  ) {
    getStoresByCollectionID(
      limit: $limit
      collectionID: $collectionID
      cursor: $cursor
    ) {
      data {
        _id
        shopName
        address
        rating
        category
        isOpen
        tags
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
        ttp
        image
        reviewsCount
        storeHours {
          opening
        }
      }
      nextCursor
      next
    }
  }
`;

export const GET_ESTIMATED_TIME = gql`
  query getOrderEta($orderEtaInput: OrderEtaInput) {
    getOrderEta(orderEtaInput: $orderEtaInput) {
      min
      max
    }
  }
`;

export const GET_STORE = gql`
  query GetStore($id: String) {
    getStore(id: $id) {
      _id
      shopName
      tags
      userCustomTags
      address
      rating
      restaurantRating
      category
      logo
      image
      phone
      ttp
      isOpen
      reviewsCount
      restaurantReviewsCount
      paymentMethods
      services
      estimatedCost {
        cost
        customerInteger
      }
      deliveryServices {
        name
        icon
        url
        label
        value
      }
      deliveryRadius {
        _id
        radiusKm
        customerDeliveryCharge
        vendorDeliveryCharge
      }
      mashkorMaxRadius
      minDeliveryOrderValue
      location {
        _id
        longitude
        latitude
      }
      storeHours {
        opening
        closing
      }
      socialMedia {
        facebook
        instagram
        twitter
        snapchat
      }
      socialId
      deliveryETA {
        min
        max
      }
      comingSoon
      busyMode
      products {
        _id
        shopName
        products {
          _id
          category
          image
          name
          tags
          price
          description
          options {
            _id
            category
            maxSelect
            minSelect
            optionsList {
              _id
              name
              price
            }
          }
        }
      }
    }
  }
`;

export const GET_STORE_INFO = gql`
  query getStoreInfo($id: String) {
    getStore(id: $id) {
      _id
      shopName
      address
      rating
      category
      isOpen
      tags
      ttp
      image
      reviewsCount
      location {
        _id
        latitude
        longitude
      }
      storeHours {
        opening
      }
    }
  }
`;

export const CHECK_STORE_STATUS = gql`
  query GetStore($id: String) {
    getStore(id: $id) {
      isOpen
      busyMode
      storeHours {
        opening
        closing
      }
    }
  }
`;

export const GET_OPEN_STORES = gql`
  query GetOpenStores($cursor: String, $limit: Int) {
    getOpenStores(cursor: $cursor, limit: $limit) {
      totalOpenStores
      data {
        _id
        shopName
        address
        rating
        category
        isOpen
        tags
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
        ttp
        image
        reviewsCount
        comingSoon
        busyMode
        socialId
        hasCoupons {
          _id
          name
        }
      }
      nextCursor
      next
    }
  }
`;

export const GET_STORES_BY_DISTANCE = gql`
  query getStoresByUserLocation(
    $options: PaginationOptions!
    $location: Location
  ) {
    getStoresByUserLocation(options: $options, location: $location) {
      data {
        _id
        shopName
        address
        rating
        category
        isOpen
        tags
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
        ttp
        image
        reviewsCount
        services
        comingSoon
        busyMode
        hasCoupons {
          _id
          name
        }
        storeHours {
          opening
        }
      }
      hasNextPage
      nextPage
      totalDocs
    }
  }
`;

export const GET_STORES_BY_DISTANCE_AND_SERVICE = gql`
  query getStoresByUserLocation(
    $options: PaginationOptions!
    $location: Location
    $serviceTypes: [String]
  ) {
    getStoresByUserLocation(
      options: $options
      location: $location
      serviceTypes: $serviceTypes
    ) {
      data {
        _id
        shopName
        address
        rating
        category
        isOpen
        tags
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
        ttp
        image
        reviewsCount
        comingSoon
        busyMode
        hasCoupons {
          _id
          name
        }
        deliveryETA {
          min
          max
        }
        storeHours {
          opening
        }
      }
      hasNextPage
      nextPage
      totalDocs
    }
  }
`;

export const GET_BEST_SELLING_STORES = gql`
  query GetBestSellingStoresCursor($cursor: String, $limit: Int) {
    getBestSellingStoresCursor(cursor: $cursor, limit: $limit) {
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
        hasCoupons {
          _id
          name
        }
        comingSoon
        busyMode
        promoCodes {
          _id
          cashback
          type {
            name
            value
          }
        }
        storeHours {
          opening
        }
      }
      next
      nextCursor
    }
  }
`;

export const GET_SIMILAR_STORE = gql`
  query getSimilarStores(
    $storeId: String!
    $useTags: Boolean
    $useCategory: Boolean
    $options: PaginationOptions
  ) {
    getSimilarStores(
      storeId: $storeId
      useTags: $useTags
      useCategory: $useCategory
      options: $options
    ) {
      data {
        shopName

        _id
        address
        rating
        reviewsCount
        category
        isOpen
        image
        tags
        ttp
        hasCoupons {
          _id
          name
        }
        location {
          longitude
          latitude
        }
        comingSoon
        busyMode
        promoCodes {
          _id
          cashback
          type {
            name
            value
          }
        }
        storeHours {
          opening
        }
      }
      nextPage
      hasNextPage
    }
  }
`;

export const GET_BEST_SELLING_PRODUCTS = gql`
  mutation GetBestSellingProductsCursor($cursor: String, $limit: Int) {
    getBestSellingProductsCursor(cursor: $cursor, limit: $limit) {
      data {
        shopId
        image
        name
        price
        category
        _id
        shopName
        shopCategory
      }
      next
      nextCursor
    }
  }
`;

export const GET_RESTAURANTS_NEARBY = gql`
  query GetRestaurantsNearBy($locationsId: [String]) {
    getRestaurantsNearBy(locationsId: $locationsId) {
      _id
      shopName
      rating
      reviewsCount
      category
      isOpen
      image
      totalCompletedOrders
      location {
        _id
        longitude
        latitude
      }
      products {
        image
        tags
      }
      hasCoupons {
        _id
        name
      }
      comingSoon
      busyMode
      storeHours {
        opening
      }
    }
  }
`;

export const GET_STORE_REVIEWS = gql`
  query getReviewsByStoreID($filter: GetReviewsInput) {
    getReviewsByStoreID(filter: $filter) {
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
        likes {
          userId
          reaction
        }
        edited
      }
      nextCursor
      next
    }
  }
`;
