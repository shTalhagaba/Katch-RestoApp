//3rd party
import { useQuery } from '@apollo/client'
import compareVersions from 'compare-versions';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import SpInAppUpdates, {
  IAUUpdateKind
} from 'sp-react-native-in-app-updates';
import { UPDATE_ICON } from '../../assets/images';
//others
import { APP_INFO } from '../../components/GraphQL';
import { appUpdate } from '../../constants/staticText';
import GS, {
  BoldText,
  customFont,
  normalizedFontSize,
  RText
} from '../../GlobeStyle';

const inAppUpdates = new SpInAppUpdates(false);

const UpdateNotification = (props) => {
  const [isUpdatable, setIsUpdatable] = useState(null);
  const [minAppVersion, setMinAppVersion] = useState(null);
  useQuery(APP_INFO, {
    fetchPolicy: 'no-cache',
    onCompleted: ({ appInfo }) => {
      const _minAppVersion =
        Platform.OS === 'ios'
          ? appInfo.minAppVersion?.IOS
          : appInfo.minAppVersion?.Android;
      setMinAppVersion(_minAppVersion || '');
    },
    onError: () => {
      setMinAppVersion('');
    },
  });

  useEffect(() => {
    if (typeof minAppVersion === 'string') {
      const isIos = Platform.OS === 'ios';
      if (isIos) checkIosUpdate();
      else checkAndroidUpdate();
    }
  }, [minAppVersion]);

  const isForcesUpdate = (currentVersion, latestVersion) => {
    return (
      compareVersions.compare(currentVersion, minAppVersion, '<') &&
      compareVersions.compare(latestVersion, minAppVersion, '<=')
    );
  };

  const setUpdateData = (storeUrl, isForcesUpdate, isNeeded) => {
    if (isForcesUpdate) {
      setIsUpdatable({
        storeUrl: storeUrl,
        forcesUpdate: true,
      });
    } else if (isNeeded) {
      setIsUpdatable({
        storeUrl: storeUrl,
        forcesUpdate: false,
      });
    }
  };

  const checkIosUpdate = async () => {
    const options = {
      provider: 'appStore',
      packageName: 'com.aktechkw.katch',
    };
    try {
      const version = await VersionCheck.needUpdate(options);
      const { currentVersion, latestVersion, isNeeded, storeUrl } = version;
      //if not upto date
      if (!compareVersions.compare(currentVersion, latestVersion, '=')) {
        const canOpen = await Linking.canOpenURL(storeUrl);
        // check if can open link
        if (canOpen) {
          setUpdateData(
            storeUrl,
            isForcesUpdate(currentVersion, latestVersion),
            isNeeded,
          );
        }
      }
    } catch {
      setIsUpdatable(null);
    }
  };

  const checkAndroidUpdate = async () => {
    try {
      const curVersion = DeviceInfo.getVersion();
      const buildNumber = DeviceInfo.getBuildNumber();
      const result = await inAppUpdates.checkNeedsUpdate({ curVersion });
      setUpdateData(
        '',
        isForcesUpdate(buildNumber, result.storeVersion),
        result.shouldUpdate,
      );
    } catch (error) {
      setIsUpdatable(null);
    }
  };

  const onReject = () => {
    setIsUpdatable(null);
  };

  const actions = Platform.select({
    ios: {
      onConfirm: () => {
        Linking.openURL(isUpdatable.storeUrl);
      },
    },
    android: {
      onConfirm: () => {
        inAppUpdates.startUpdate({
          updateType: IAUUpdateKind.IMMEDIATE,
        });
      },
    },
  });

  const onUpdateClicked = () => {
    actions.onConfirm();
    if (!isUpdatable.forcesUpdate) {
      setIsUpdatable(null);
    }
  };

  return (
    <Fragment>
      {props.children}
      {isUpdatable !== null ? (
        <Fragment>
          {isUpdatable.forcesUpdate ? (
            <ForceUpDate onConfirm={onUpdateClicked} />
          ) : (
            <OptionalUpdate onConfirm={onUpdateClicked} onReject={onReject} />
          )}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

const ForceUpDate = ({ onConfirm }) => (
  <View style={styles.container}>
    <View style={styles.modal}>
      <View style={styles.wrapper}>
        <View style={styles.pr20}>
          <Image source={UPDATE_ICON} style={styles.updateIcon} />
        </View>
        <View style={styles.flex1}>
          <BoldText style={styles.titleText}>{appUpdate.force.title}</BoldText>
          <RText style={styles.messageText}>{appUpdate.force.message}</RText>
        </View>
      </View>
      <View style={styles.actionContainerForce}>
        <TouchableOpacity onPress={onConfirm} style={styles.updateButton}>
          <RText style={styles.updateButtonText}>Ok</RText>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const OptionalUpdate = ({ onReject, onConfirm }) => (
  <View style={styles.container}>
    <View style={styles.modal}>
      <View style={styles.wrapper}>
        <View style={styles.pr20}>
          <Image source={UPDATE_ICON} style={styles.updateIcon} />
        </View>
        <View style={styles.flex1}>
          <BoldText style={styles.titleText}>{appUpdate.force.title}</BoldText>
          <RText style={styles.messageText}>{appUpdate.force.message}</RText>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={onReject} style={styles.cancelButton}>
          <RText style={styles.cancelButtonText}>Cancel</RText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirm} style={styles.updateButton}>
          <RText style={styles.updateButtonText}>Update</RText>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default UpdateNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000040',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 30,
    overflow: 'hidden',
    paddingBottom: 10,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  actionContainer: {
    paddingBottom: 10,
    marginTop: 10,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actionContainerForce: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: GS.secondaryColor,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  updateIcon: {
    resizeMode: 'contain',
    height: 80,
    width: 80,
  },
  flex1: {
    flex: 1,
  },
  pr20: {
    paddingRight: 25,
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  updateButtonText: {
    color: '#fff',
    fontFamily: customFont.axiformaSemiBold,
  },
  messageText: {
    fontSize: normalizedFontSize(6),
    lineHeight: normalizedFontSize(8),
    color: GS.textColorGrey,
  },
  titleText: {
    fontSize: normalizedFontSize(7.5),
    paddingBottom: 8,
    color: GS.lightGrey,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: GS.textColorGrey1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    fontFamily: customFont.axiformaSemiBold,
    color: GS.textColorGreyDark,
  },
});
