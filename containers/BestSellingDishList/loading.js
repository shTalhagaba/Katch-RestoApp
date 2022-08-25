import React, {Component, Fragment, memo} from 'react';
import {View, Dimensions} from 'react-native';
import GS from '../../GlobeStyle';
import More from '../../components/Loading/More';

const windowWidth = Dimensions.get('window').width;
const dummyLength = Math.ceil(windowWidth / (windowWidth - 50));

const Loading = () => (
  <View style={{marginTop: 30, flexDirection: 'row'}}>
    {[...Array(dummyLength)].map((l, i) => (
      <View key={i} style={{width: windowWidth - 50, paddingLeft:20}}>
        <View
          style={{
            height: 110,
            minWidth: '80%',
            borderRadius: 20,
            backgroundColor: GS.placeHolderColor
          }}
        />
        <View
          style={{
            height: 110,
            minWidth: '80%',
            marginVertical: 20,
            borderRadius: 20,
            backgroundColor: GS.placeHolderColor
          }}
        />
      </View>
    ))}
  </View>
);

export default memo(Loading);

export class SignalLoading extends Component {
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
