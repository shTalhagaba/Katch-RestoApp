import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import GS from '../../../GlobeStyle';

const Form = styled.View`
  background-color: #e2e2e2;
  margin: 0 60px 0 0;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  align-items: center;
  padding: 20px 0;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 80%;
  background-color: ${GS.secondaryColor};
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  margin-top: 15px;
`;

const SubmitText = styled.Text`
  color: ${GS.buttonTextColor};
`;

const Input = styled.TextInput`
  width: 80%;
  border-radius: 8px;
  padding: 10px;
`;

const LoginMessage = styled.Text`
  color: #fff;
  font-size: 40px;
  margin: 20px 10px;
`;

const RedirectContainer = styled.View`
  flex-direction: row;
`;

const RedirectText = styled.Text`
  font-size: 20px;
  color: #fff;
  margin: 20px;
`;

const BackGroundImage = styled.ImageBackground`
  flex: 1;
  justify-content: center;
`;

const BorderBottom = ({children}) => (
  <View
    style={{
      width: '80%',
      borderBottomColor: 'gray',
      borderBottomWidth: 2,
      marginBottom: 10,
    }}>
    {children}
  </View>
);

export {
  BackGroundImage,
  RedirectContainer,
  RedirectText,
  LoginMessage,
  Input,
  SubmitButton,
  SubmitText,
  Form,
  BorderBottom
};
