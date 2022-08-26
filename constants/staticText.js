import { priceSymbol } from '../GlobeStyle';

export const promos = {
  cartEmpty: 'It looks like there are no promos that are usable at the moment.',
  error: {
    code: `The code you have entered is not found or is no longer valid. Try again.`,
    active: `This promotion is no longer available.`,
    start: `This promotion hasn't started yet.`,
    expiry: `This promotion has already expired.`,
    Unauthorized: `You need to login to apply promotions.`,
    restrictedCodes: `This promotion is restricted to selected users only.`,
    restApplicable: 'This promotion is not applicable ',
    perUserApply: `You have already used this promotion the maximum number of times allowed`,
    respawnTime: (respawnTime) =>
      `This promotion can be used every ${respawnTime} hour(s) only.`,
    minOrder: (minOrder) =>
      `You need a minimum order of ${minOrder} ${priceSymbol} to use this promotion.`,
    default:
      "Sorry, can't apply this promotion at the moment, please try again at a later time.",
    respawnTimeDefault:
      'This promotion was recently used, please try again at a later time.',
  },
  screenEmpty: {
    title: 'Oh! No',
    message: "There aren't any usable promotions at this time",
  },
};

export const productListText = {
  title: 'Oh! No',
  message: "There aren't any items for this category at this time",
};

export const addresses = {
  noAddress: 'It looks like you have not added any Addresses.',
};

export const orderDetails = {
  error: {
    cancelled: {
      message: (status) =>
        `Order can't be cancelled because it has already been ${status}`,
      default: {
        title: 'Oops',
        message: 'We ran into an issue while cancelling your order, try again.',
      },
    },
  },
  cancelSuccess: {
    cash: 'Order has been cancelled.',
    online: 'Order has been cancelled and your money will be refunded.',
  },
};

export const onlinePayments = {
  warning: 'Cancellation charges may apply.',
  error: {
    default: {
      title: 'Sorry!',
      message:
        'We are currently facing issues with online payments.\n\nWould you like to make a cash payment instead ?',
    },
    minAmount: {
      title: '',
      message: (amount) =>
        `Minimum order for online payment is ${amount} ${priceSymbol}.`,
    },
    cancelled: {
      title: '',
      message: 'Payment cancelled by user',
    },
  },
};

export const Map = {
  error: {
    noLocation: {
      title1: 'Oops,',
      title2: " can't get your current location",
      message: "It looks like we don't have access to your device's location",
    },
  },
};

export const cart = {
  orderConfirmation: {
    title: 'Confirm Order',
    message: 'Would you like to confirm your order ?',
  },
};

export const appUpdate = {
  optional: {
    title: 'Update available',
    message: 'There is a newer version of Katch! available for you.',
  },
  force: {
    title: 'Update available',
    message: 'There is a newer version of Katch! available for you.',
  },
};

export const reOrder = {
  allOut: {
    title: '',
    message: `It looks like all of the items are out of stock\nFeel free to browse through a wide variety of our other options.`,
  },
  missingItems: {
    title: '',
    message: (notAvailable) =>
      `It looks like the following items are not available: \n\n${notAvailable.join(
        '\n',
      )}\n\nWould you like to add the remaining items to your cart ?`,
  },
};

export const userReviews = {
  empty: {
    title: '',
    message: 'No Reviews found.',
  },
};

export const bookmarks = {
  empty: {
    title: '',
    message: "Your haven't bookmarked anything yet.",
  },
};
