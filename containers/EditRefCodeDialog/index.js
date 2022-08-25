import React, { useState, useRef, Fragment, useEffect } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';

//3rd party

//others
import { RText, BoldText } from '../../GlobeStyle';

import { TextInput } from 'react-native-gesture-handler';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import {
  IS_REFERRAL_AVAILABLE,
  UPDATE_USER_REFERRAL_CODE,
} from '../../components/GraphQL';
import AnimatedLottieView from 'lottie-react-native';
import { Loading as LottieLoading } from '../../assets/Lottie';
import styles from './styles';

const EditRefCodeDialog = (props) => {
  const { toggleEditDialog, referralCode, setRefCode } = props;
  const [error, setError] = useState(null);
  const [editedRef, setEditedRef] = useState(referralCode);
  const [isLoading, setIsLoading] = useState(false);
  const apolloClient = useApolloClient();
  const [updateRefCode] = useMutation(UPDATE_USER_REFERRAL_CODE);
  const isMounted = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSave = async () => {
    if (editedRef !== referralCode) {
      Keyboard.dismiss();
      setError(null);
      setIsLoading(true);
      try {
        const { data } = await apolloClient.query({
          fetchPolicy: 'network-only',
          query: IS_REFERRAL_AVAILABLE,
          variables: {
            referralCode: editedRef,
          },
        });
        if (data) {
          if (
            data.isReferralAvailable === false ||
            editedRef?.toLowerCase() === referralCode.toLowerCase()
          ) {
            const { data: mData } = await updateRefCode({
              variables: {
                referralCode: editedRef,
              },
            });
            if (mData?.updateReferralCode) {
              if (mData.updateReferralCode.success) {
                toggleEditDialog();
                setRefCode(editedRef.replace(/\s+/, ''));
              } else {
                setError(mData.updateReferralCode.message);
              }
            }
          } else {
            setError(
              'Bummer, it seems like some one was two steps a head of you. \n \n Try some thing else.',
            );
          }
        }
        isMounted.current && setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const onTextChange = (text) => {
    setEditedRef(text);
  };

  return (
    <Fragment>
      <TouchableOpacity
        style={styles.container}
        onPress={toggleEditDialog}
        activeOpacity={1}>
        <View style={styles.dialogContainer}>
          <TextInput
            style={styles.input}
            maxLength={8}
            defaultValue={editedRef}
            onChangeText={onTextChange}
          />
          <RText style={styles.errorText}>{error ? error : ''}</RText>
          <TouchableOpacity
            style={[
              styles.button,
              editedRef !== referralCode ? {} : styles.disabledButton,
            ]}
            activeOpacity={editedRef === referralCode ? 1 : 0}
            onPress={onSave}>
            <BoldText style={[styles.buttonText]}>Save</BoldText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {isLoading && <Loading />}
    </Fragment>
  );
};

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingView}>
        <AnimatedLottieView source={LottieLoading} autoPlay loop />
      </View>
    </View>
  );
};

export default EditRefCodeDialog;
