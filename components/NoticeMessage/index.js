import React from 'react';
import { View } from 'react-native';
import { BoldText } from '../../GlobeStyle';
import styles from './styles';

const NoticeMessage = ({ noticeMessage }) => {
  if (!noticeMessage) {
    return null;
  }
  const { message, level } = noticeMessage;
  if (!message) {
    return null;
  }
  return (
    <View
      style={[
        styles.container,
        level === 'info' ? styles.containerInfo : styles.containerWarning,
      ]}>
      <BoldText style={level === 'info' ? styles.infoText : styles.warningText}>
        {message}
      </BoldText>
    </View>
  );
};

export default NoticeMessage;
