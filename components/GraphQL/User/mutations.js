import { gql } from 'graphql-tag';

export const DELETE_USER = gql`
  mutation {
    disableFirebaseUser
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($addReviewInput: AddReviewInput!) {
    addReview(addReviewInput: $addReviewInput) {
      _id
      uid
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
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewID: String!) {
    deleteReview(reviewID: $reviewID)
  }
`;

export const LIKE_REVIEW = gql`
  mutation Like($likeInput: LikeInput!) {
    like(likeInput: $likeInput) {
      likes {
        userId
      }
    }
  }
`;

export const UNLIKE_REVIEW = gql`
  mutation unLike($likeInput: LikeInput!) {
    unlike(likeInput: $likeInput) {
      likes {
        userId
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation updateReviewInput($updateReviewInput: AddReviewInput!) {
    updateReview(updateReviewInput: $updateReviewInput) {
      _id
      uid
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
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation ($reviewCommentInput: ReviewCommentInput!) {
    addReviewComment(reviewCommentInput: $reviewCommentInput) {
      _id
      comments {
        _id
        comment
        uid
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation ($reviewCommentInput: ReviewCommentInput!) {
    updateReviewComment(reviewCommentInput: $reviewCommentInput) {
      _id
      comments {
        _id
        comment
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation ($deleteReviewInput: DeleteReviewCommentInput!) {
    deleteReviewComment(deleteReviewInput: $deleteReviewInput) {
      _id
      comments {
        _id
        comment
      }
    }
  }
`;

export const ADD_BOOKMARK = gql`
  mutation ($bookMarkInput: BookMarkInput) {
    addBookMark(bookMarkInput: $bookMarkInput)
  }
`;

export const REMOVE_BOOKMARK = gql`
  mutation ($storeId: String!) {
    deleteBookMark(storeId: $storeId)
  }
`;

export const ADD_IMAGE_GALLERY = gql`
  mutation addImages($imageRefInput: ImageRefInput!) {
    addImages(imageRefInput: $imageRefInput) {
      sellerId
      image
      _id
    }
  }
`;

export const ADD_USER_ADDRESS = gql`
  mutation addUserAddress($form: AddressInput!) {
    addUserAddress(form: $form) {
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

export const UPDATE_USER_ADDRESS = gql`
  mutation updateUserAddress($form: AddressInput!) {
    updateUserAddress(form: $form) {
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

export const DELETE_USER_ADDRESS = gql`
  mutation deleteUserAddress($docId: String!) {
    deleteUserAddress(docId: $docId) {
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

export const REORDER = gql`
  mutation Reorder($storeId: String, $productIds: [String]) {
    reorder(storeId: $storeId, productIds: $productIds) {
      _id
      shopName
      address
      services
      deliveryRadius {
        _id
        radiusKm
        customerDeliveryCharge
        vendorDeliveryCharge
      }
      location {
        _id
        longitude
        latitude
      }
      products {
        _id
        name
        price
        image
        category
        options {
          category
          optionsList {
            name
            price
          }
        }
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($NewOrderInputs: NewOrderInputs) {
    createOrder(NewOrderInputs: $NewOrderInputs) {
      _id
      timeStamp
      timeStampEta
      storeId
      storeLogo
      storeName
      customerId
      total
      orderNumber
      orderNotes
      orderStatus
      paymentMethod
      orderRating
      items {
        _id
        name
        quantity
        price
        category
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
    }
  }
`;

export const UPDATE_USER_REFERRAL_CODE = gql`
  mutation UpdateReferralCode($referralCode: String) {
    updateReferralCode(referralCode: $referralCode) {
      success
      message
    }
  }
`;

export const UPDATE_USER_LANG = gql`
  mutation UpdateLanguage($language: String) {
    updateLanguage(language: $language)
  }
`;


export const REQ_OTP = gql`
  mutation generateOtpCode($input: GenerateOtpCodeInput) {
    generateOtpCode(input: $input) {
      message
      success
      data
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtpCode($input: VerifyCodeInput) {
    verifyOtpCode(input: $input) {
      success
      message
    }
  }
`;