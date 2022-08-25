import React from 'react';
import {Text} from 'react-native';
import {ErrorContainer, ValidationContainer} from './style';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {capitalizeFirstLetter} from '../../components/Helpers';
import isValidEmail from 'is-valid-email';
import {TextBasic} from '../../GlobeStyle';


const ValidationHeader = ({errors, callBack = null}) => {
  return (
    <ValidationContainer>
      <MIcon name="error-outline" size={30} color="red" />
      <ErrorContainer>
        {errors.map((error, index) => <TextBasic key={index}>{error}</TextBasic>)}
      </ErrorContainer>
      {callBack &&
      <MIcon onPress={callBack} name="close" size={30} color="#212121" style={{marginLeft:'auto'}}/>
      }
    </ValidationContainer>
  );
};

const isFormValidated = async (inputValue) => {
  const errors = {
    hasError: false,
  };
  for (let key in inputValue) {
    if (inputValue[key] === '' || inputValue[key] === '+965 ') {
      if (key === 'referralCode') {
        errors.hasError = false;
      } else {
        errors.hasError = true;
        if (key === 'fullName') {
          errors[key] = `Full name cannot be empty`;
        } else if (inputValue[key] === 'referralCode') {
          errors[key] = `${capitalizeFirstLetter(key)} cannot be empty`;
        }
      }
    }

    if (
      key === 'password' &&
      inputValue[key] !== '' &&
      inputValue[key].length <= 5
    ) {
      errors.hasError = true;
      errors[key] = `Password must contain up to 6 characters`;
    }

    // if (
    //   key === 'phoneNumber' &&
    //   inputValue[key] !== '' &&
    //   inputValue[key].length <= 12
    // ) {
    //   errors.hasError = true;
    //   errors[key] = `Invalid Phone Number`;
    // }

    if (key === 'email' && !isValidEmail(inputValue[key])) {
      errors.hasError = true;
      errors[key] = `Invalid Email Address`;
    }
  }
  return errors;
};

const formatPhoneNumber = (string) => string.replace(/-/,"").split(' ').join('');

export {
  ValidationHeader,
  isFormValidated,
  formatPhoneNumber
}