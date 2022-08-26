import React from 'react';
import { View } from 'react-native';

import styled from 'styled-components';
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
  color: ${GS.textColor};
`;

const Input = styled.TextInput`
  width: 80%;
  border-radius: 8px;
  padding: 10px;
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
const OtpContainer = styled.View`
  position:absolute;
  background-color: #00000050;
  top:0;
  bottom:0;
  right:0;
  left:0;
  flex:1;
  justify-content:center;
`;

const OtpCodeContainer = styled.View`
  background-color: #e2e2e2;
  width:70%;
  margin: 0 auto;
  padding: 10px;
  border-radius: 8px;
`;

const OtpInput = styled.TextInput`
  background-color:#fff;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
`;

const OtpButton = styled.TouchableOpacity`
  background-color: #fbd46d;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  margin-top: 15px ;
`;

const OtpButtonText = styled.Text`
  
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
  RedirectText,
  RedirectContainer,
  Input,
  SubmitText,
  SubmitButton,
  Form,
  OtpContainer,
  OtpButton,
  OtpInput,
  OtpButtonText,
  OtpCodeContainer,
  BorderBottom
};
