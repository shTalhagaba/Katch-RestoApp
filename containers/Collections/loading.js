import React, {memo, PureComponent} from 'react';
import {View, Dimensions} from 'react-native';
import GS, { RText } from '../../GlobeStyle';
import More from '../../components/Loading/More';

const windowWidth = Dimensions.get('window').width;

const Loading = () => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      overflow: 'hidden',
    }}>
    {[...Array(Math.ceil(windowWidth / (windowWidth - 50)))].map((l, i) => (
      <View
        key={i}
        style={{
          paddingLeft: i === 0 ? 15 : 0,
          marginTop: 20,
          width: windowWidth - 50,
          marginRight: 10,
        }}>
        <View
          style={{
            backgroundColor: GS.placeHolderColor,
            height: 250,
            minWidth: '100%',
            borderRadius: 8,
          }}
        />
      </View>
    ))}
  </View>
);

export default memo(Loading);

export class SignalLoading extends PureComponent {
  render() {
    return (
      <More style={{
        justifyContent: 'center',
        marginRight: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
       flexGrow:1
      }}/>
    );
  }
}
