module.exports = {
  presets: ['module:metro-react-native-babel-preset','module:react-native-dotenv'],
  plugins: process.env.NODE_ENV==='production' ? ["transform-remove-console"] : []
};
