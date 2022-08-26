'use strict';

import React from 'react';
import {findNodeHandle} from 'react-native';
import PropTypes from 'prop-types';
import {Mixins} from '@skele/components';

export default class ViewportNotifier extends Mixins.WithEvents(
  {name: 'viewport', inChildContext: true, notifiesWithLastEventOnAdd: true},
  React.Component,
) {
  constructor(props, context) {
    super(props, context);
  }

  componentDidUpdate() {
    // this._onViewportChange();
  }

  _onRef = (ref) => {
    const childOnRef = React.Children.only(this.props.children).ref;
    childOnRef && typeof childOnRef === 'function' && childOnRef(ref);
    this.nodeHandle = findNodeHandle(ref);
  };

  _onViewportChange = (args) => {
    const {
      viewportWidth,
      viewportHeight,
      viewportOffsetX,
      viewportOffsetY,
      shouldMeasureLayout,
    } = args;
    this.nodeHandle &&
      viewportWidth > 0 &&
      viewportHeight > 0 &&
      this.notifyViewportListeners({
        parentHandle: this.nodeHandle,
        viewportOffsetX: viewportOffsetX,
        viewportOffsetY: viewportOffsetY,
        viewportWidth: viewportWidth,
        viewportHeight: viewportHeight,
        shouldMeasureLayout: shouldMeasureLayout,
      });
  };

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      ref: this._onRef,
      _onViewportChange: this._onViewportChange,
    });
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    viewportWidth: PropTypes.number,
    viewportHeight: PropTypes.number,
    viewportOffsetX: PropTypes.number,
    viewportOffsetY: PropTypes.number,
    shouldMeasureLayout: PropTypes.bool,
  };
}
