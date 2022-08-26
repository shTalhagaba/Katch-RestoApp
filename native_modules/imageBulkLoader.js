import { NativeModules, Platform } from 'react-native';

export default Platform.select({
    ios: {
        load: () => {}
    },
    android: {
        load: NativeModules?.ImageBulkLoader?.load
    }
})