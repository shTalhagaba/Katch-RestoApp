module.exports = {
    root: true,
    extends: '@react-native-community',
    parser: 'babel-eslint',
    plugins: ['react-native'],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ios.js', '.android.js'],
        },
      },
      'import/core-modules': [
        'EventEmitter',
        'NativeError',
        'react-native-cropper',
        'react-native-bridge-firebase',
      ],
    },
    rules: {
      'no-console': 1,
      'react-native/no-unused-styles': 1,
      'react-native/split-platform-components': 2,
      'react-native/no-inline-styles': 1,
      'react-native/no-color-literals': 0,
    },
    globals: {
      __DEV__: true,
      jest: true,
      describe: true,
      it: true,
      expect: true,
    },
  };