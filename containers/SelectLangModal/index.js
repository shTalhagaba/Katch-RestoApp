import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { setLocalStorage } from '../../components/Redux/Actions/appActions';

//3rd party
import Modal from 'react-native-modal';
import { RRR_BANNER } from '../../assets/images';
import { IS_LANG_SELECTED, UPDATE_USER_LANG } from '../../components/GraphQL';

//others
import { RText } from '../../GlobeStyle';
import styles from './styles';
import { connect } from 'react-redux';

const SelectLangModal = (props) => {
  const { setRoute, setLocalStorage, localStorage } = props;
  const langs = ['RRR-Telugu', 'RRR-Hindi'];
  const [showModal, setShowModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  useQuery(IS_LANG_SELECTED, {
    fetchPolicy: 'network-only',
    onCompleted: (rawData) => {
      // if user has pressed the button before no need for this modal
      if (localStorage && localStorage.languageSelected === 'none') {
        return;
      }
      if (rawData && rawData.isUserLanguageUpdated === false) {
        setRoute('');
        setTimeout(() => {
          setShowModal(true);
        }, 100);
      }
    },
  });


  const [updateSelectedLang] = useMutation(UPDATE_USER_LANG);

  const onLangSelected = (lang) => {
    setSelectedLang(lang);
  };

  const onCancel = async () => {
    setLocalStorage({ languageSelected: 'none', ...localStorage });
    setShowModal(false);
  };

  const onSave = async () => {
    setShowModal(false);
    try {
      await updateSelectedLang({
        variables: {
          language: selectedLang,
        },
      });
    } catch (err) {}
  };

  return (
    <Modal
      isVisible={showModal}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      backdropOpacity={0.5}
      statusBarTranslucent={true}
      style={styles.modalStyle}>
      <View style={styles.modalContainer}>
        <Image source={RRR_BANNER} style={styles.image} />
        <View style={styles.innerContainer}>
          <RText style={styles.headerText}>
            Please select your language of preference for the movie
          </RText>
          <View style={styles.langButtonContainer}>
            {langs.map((lang) => {
              return (
                <TouchableOpacity
                  onPress={() => onLangSelected(lang)}
                  key={lang}
                  style={[
                    styles.langButton,
                    selectedLang === lang ? {} : styles.langButtonNotSelected,
                  ]}>
                  <RText
                    style={[
                      styles.langButtonText,
                      selectedLang === lang
                        ? {}
                        : styles.langButtonTextNotSelected,
                    ]}>
                    {lang}
                  </RText>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onSave}
              style={[
                styles.saveButton,
                selectedLang ? {} : styles.saveButtonDisabled,
              ]}
              disabled={!selectedLang}>
              <RText style={styles.saveButtonText}>Save</RText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.saveButton, styles.cancelButton]}>
              <RText style={styles.saveButtonText}>Cancel</RText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    localStorage: state.app.localStorage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocalStorage: (data) => {
      dispatch(setLocalStorage(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLangModal);

