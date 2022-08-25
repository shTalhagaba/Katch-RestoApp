import React, { Component, memo } from 'react';
import { Dimensions, View } from 'react-native';
import More from '../../components/Loading/More';
import style from './style';

const windowWidth = Dimensions.get('window').width;
const dummyLength = Math.ceil(windowWidth / (windowWidth - 50));

const Loading = () => (
  <View style={style.loadingWrapper}>
    {[...Array(dummyLength)].map((l, i) => (
      <View key={i} style={style.loadingContainer}>
        <View style={style.loading} />
      </View>
    ))}
  </View>
);

export default memo(Loading);

export class SignalLoading extends Component {
  render() {
    return <More style={style.loadingMore} />;
  }
}
