import AnimatedLottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Loading } from '../assets/Lottie';
import {} from '../GlobeStyle';

export const Context = React.createContext({ actions: {}, state: {} });

export const Provider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const toggleGLoading = (value, bgColor = '#ffffff') => {
    setIsLoading(typeof value === 'boolean' ? value : !isLoading);
    setBackgroundColor(bgColor)
  };

  const value = {
    state: {
      isLoading,
    },
    actions: {
      toggleGLoading,
    },
  };

  return (
    <Context.Provider value={value}>
      {isLoading && (
        <View style={[styles.loadingWrapper,{backgroundColor}]}>
          <View style={styles.view}>
            <AnimatedLottieView source={Loading} autoPlay loop />
          </View>
        </View>
      )}
      {props.children}
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: '100%',
    zIndex: 100,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  view: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {function} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {(context) => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}
