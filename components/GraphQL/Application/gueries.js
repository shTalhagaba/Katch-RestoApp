import { gql } from 'graphql-tag';

export const GET_FILTER_OPTIONS = gql`
  query GetFiterOptions($makeSort: Boolean) {
    getTags(makeSort: $makeSort) {
      id
      name
    }

    getCategories(makeSort: $makeSort) {
      id
      name
    }

    getServices {
      _id
      name
    }
  }
`;

export const GET_SHOW_ETA = gql`
  query GetLandingContent {
    getLandingContent {
      showETA
    }
  }
`;

export const GET_LANDING_CONTENT = gql`
  query GetLandingContent {
    getLandingContent {
      landingHeader
      landingHeaderStyle {
        fontSize
        lineHeight
      }
      offersBanner
      offersTitle
      noticeMessage {
        message
        level
      }
      referrals {
        active
        banner
        foregroundImage
        backgroundImage
        version
        shareImage
        shareText
        thankMessage
        shareMessage
      }
      giveAway {
        active
        value
        title
      }
      banners
      quickSearch
      ramadan
      orderSupport {
        whatsAppContact
      }
      showETA
      showLandingMessage
    }
  }
`;
