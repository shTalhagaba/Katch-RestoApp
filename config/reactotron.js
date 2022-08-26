import Reactotron, {openInEditor} from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import {NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
let reactotron = {};

if(__DEV__){
    const scriptURL = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];

    reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-async-storage/async-storage` depending on where you get it from
        .configure({
            name: `Katch! ${Platform.OS}`,
            host: scriptURL,
        })
        .use(openInEditor())
        .use(reactotronRedux())
        .useReactNative()
        .connect();

    console.tron = Reactotron.log;
}

export {reactotron};
