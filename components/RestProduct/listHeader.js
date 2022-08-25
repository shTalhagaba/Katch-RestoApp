import React, {Component, createRef} from 'react';
import {View,Text} from 'react-native';

//others
import {normalizedFontSize,customFont,TextBasic} from '../../GlobeStyle';
import withContext from '../../context/cart';

class ListHeader extends Component {
  viewRef = createRef(null);

  shouldComponentUpdate(newProps) {
    if (newProps.context.state.scrollTo === this.props.title) {
      this.viewRef.current.measure((fx, fy, width, height, px, py) => {
        const currentScrollY = newProps.context.ref.menuCurrentScrollY.current;
        
        newProps.context.ref.list.current.scrollTo({
          x: 0,
          y: (currentScrollY + py) - (height + 20) + 70,
          animation: true,
        });
      });

      this.props.context.actions.scrollTo(null);
    }

    return false;
  }

  render() {
    return (
      <View
        ref={this.viewRef}
        style={{
          backgroundColor: '#fff',
          justifyContent: 'flex-end',
        }}>
        <TextBasic
          style={{
            fontFamily: customFont.axiformaMedium,
            fontSize: normalizedFontSize(8.632),
            paddingBottom: 10,
            paddingTop: 10,
            paddingLeft: 15,
            // color: '#111',
          }}>
          {this.props.title}
        </TextBasic>
      </View>
    );
  }
}

export default withContext(ListHeader);
