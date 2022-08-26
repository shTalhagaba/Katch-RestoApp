import React from 'react';
import { Alert } from 'react-native';

export const askToClearCart = ({
  title,
  fromName,
  toName,
  onConfirm,
  onReject,
}) => {
  Alert.alert(
    title,
    `Your cart contains items from ${fromName}. Do you want to replace them with the selected item from ${toName} ?`,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
      {
        text: 'No',
        onPress: () => null,
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const showAlert = ({
  title,
  message,
  onConfirm = () => {},
  onReject = () => {},
}) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
      {
        text: 'No',
        onPress: () => onReject(),
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const askLocation = ({ onConfirm, onReject = null }) => {
  Alert.alert(
    "We can't locate you",
    `We need to access your location to sort by distance, want to grant us the permission ?`,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
      {
        text: 'No',
        onPress: () => onReject,
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const onStoreClosed = ({ shopName, onConfirm, isBusy = false }) => {
  const busyTitle = `${shopName} is currently busy.`;
  const busyMessage = `We recommend finding another open place from our great selection of restaurants!`;
  const closedTitle = `Sorry`;
  const closedMessage = `It seems like ${shopName} is closed.`;
  Alert.alert(
    isBusy? busyTitle : closedTitle,
    isBusy? busyMessage : closedMessage,
    [
      {
        text: 'OK',
        onPress: () => onConfirm(),
      },
    ],
  );
};

export const onLeaveAlert = ({ onReject, onConfirm }) => {
  Alert.alert(
    'Leave unsaved changes ?',
    `You are about to leave with out saving your changes, are you sure you want to leave ?`,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
      {
        text: 'No',
        onPress: () => onReject(),
      },
    ],
  );
};

export const onReAuth = ({ onReject, onConfirm }) => {
  Alert.alert(
    'Recent login required ?',
    `You need to Re-login to make changes. \nDo you want to Sign out ?
    `,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
      {
        text: 'No',
        onPress: () => onReject(),
      },
    ],
  );
};

export const verifyEmail = ({ onReject, onConfirm }) => {
  Alert.alert(
    'Email not verified!',
    `Verify your email address to proceed with login. \n \n Resent verification mail ?
    `,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
    ],
  );
};

export const askDefaultPaymentMethod = ({
  paymentType,
  onConfirm,
  onReject = () => null,
}) => {
  Alert.alert(
    '',
    `Do you want to select ${paymentType} as your default payment method?
    `,
    [
      {
        text: 'Yes',
        onPress: () => onConfirm(),
      },
      {
        text: 'No',
        onPress: () => onReject(),
      },
    ],
  );
};

export const selectPayment = ({ title, message, methods }) => {
  Alert.alert(title, message, methods);
};

export const onlinePaymentError = ({ title, message, onConfirm, onReject }) => {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => onConfirm(),
    },
  ]);
};

export const orderConfirmation = ({ title, message, onConfirm, onReject }) => {
  Alert.alert(title, message, [
    {
      text: 'YES',
      onPress: () => onConfirm(),
    },
    {
      text: 'NO',
      onPress: () => onReject(),
    },
  ]);
};

export const notifyUpdate = ({
  title,
  message,
  onConfirm,
  onReject = null,
}) => {
  const buttons = [
    {
      text: 'OK',
      onPress: () => onConfirm(),
    },
  ];

  if (onReject) {
    buttons.push({
      text: 'NO',
      onPress: () => onReject(),
    });
  }

  Alert.alert(title, message, buttons);
};

export const reorderAlert = ({
  title,
  message,
  onConfirmText = 'YES',
  onConfirm,
  onReject = null,
}) => {
  const buttons = [
    {
      text: onConfirmText,
      onPress: () => onConfirm(),
    },
  ];

  if (onReject) {
    buttons.push({
      text: 'NO',
      onPress: () => onReject(),
    });
  }

  Alert.alert(title, message, buttons);
};
