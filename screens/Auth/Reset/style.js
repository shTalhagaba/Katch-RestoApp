import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import GS from '../../../GlobeStyle';

const ResetSetContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #e2e2e2;
  justify-content: center;
`;

const ResetSetForm = styled.View`
  margin: auto;
  padding: 20px;
  background-color: #ffffff60;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
`;

const ResetSetButton = styled.TouchableOpacity`
  background-color: ${GS.secondaryColor};
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
`;

const ResetButtonText = styled.Text`
  color:${GS.buttonTextColor};
`;

const ResetSetInput = styled.TextInput`
  background-color: transparent;
  color: #000;
  margin: 0 0 0 0;
  min-height: 55px;
`;

const BorderBottom = ({children,stage}) => (
  <View
    style={{
      width: '100%',
      borderBottomColor: '#000',
      borderBottomWidth:  stage? 0 : 2,
      marginBottom: 10,
      
    }}>
    {children}
  </View>
);

export {
  ResetSetContainer, 
  ResetSetForm, 
  ResetSetInput, 
  ResetSetButton,
  ResetButtonText,
  BorderBottom
};
