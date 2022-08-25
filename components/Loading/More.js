import React, {PureComponent} from 'react';
import {View, ActivityIndicator} from 'react-native';
import GS from '../../GlobeStyle';

class ShowMore extends PureComponent {
  render() {
    const {style, iconSize = 'small', iconColor = GS.logoYellow} = this.props;
    return (
      <View
        style={[
          {
            backgroundColor: GS.bgGreenLight,
          },
          style,
        ]}>
        <ActivityIndicator size={iconSize} color={iconColor} />
      </View>
    );
  }
}

export default ShowMore;
