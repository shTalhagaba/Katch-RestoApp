import React, {Component, memo} from 'react';
import {View, Dimensions} from 'react-native';
import GS from '../../GlobeStyle';
import {Viewport} from '@skele/components';
import More from '../../components/Loading/More';

const windowHeight = Dimensions.get('window').height;
const ViewportAware = Viewport.Aware(More);
const items = Math.ceil((windowHeight/ 1.5) / 250);

const Loading = ({ hideheader = false }) => (
  <View>
    {!hideheader && (
      <View
        style={{
          width: '100%',
          height: 60,
          backgroundColor: GS.placeHolderColor,
        }}
      />
    )}
    {[...Array(items)].map((l, i) => (
      <View
        key={i}
        style={{
          backgroundColor: GS.placeHolderColor,
          height: 250,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '95%',
          marginTop: 8,
          borderRadius: 10,
          overflow: 'hidden',
          alignItems: 'stretch',
        }}
      />
    ))}
  </View>
);

export class LoadingDish extends Component {
  render() {
    return (
      <ViewportAware
        onViewportEnter={() => {
          if (!this.props.isFetching) {
            this.props.fetchMoreProducts();
            this.props.setIsFetching(true);
          }
        }}
        style={{
          justifyContent: 'center',
          marginHorizontal: 20,
          marginTop: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignItems: 'center',
          borderRadius: 10,
        }}/>
        
    );
  }
}

export default memo(Loading);
