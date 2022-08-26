import React from 'react';
import { View } from 'react-native';
import { normalizedFontSize, TextBasic } from '../../GlobeStyle';
import styles from './styles';

const LandingMessage = (props) => {
  const { data } = props;

  if (!data) return <Loading/>;

  const fontSize = data.landingHeaderStyle.fontSize || 10.168;
  const lineHeight = data.landingHeaderStyle.lineHeight || 35;
  const message = data.landingHeader;

  return (
    <View style={styles.container}>
      <TextBasic
        style={[
          styles.landingMessage,
          {
            fontSize: normalizedFontSize(fontSize),
            lineHeight: lineHeight,
          },
        ]}>
        {message}
      </TextBasic>
    </View>
  );
};

const Loading = () => <View style={[styles.container, styles.loadingContainer]}/>

export default LandingMessage;
