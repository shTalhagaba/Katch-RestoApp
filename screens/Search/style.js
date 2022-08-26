import styled from 'styled-components';
import GS from '../../GlobeStyle';
import {Platform,StatusBar}from 'react-native';
const Selected = styled.TouchableOpacity`
  margin: 0 10px;
  background-color: ${GS.secondaryColor};
  padding: 5px 10px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const NotSelected = styled.TouchableOpacity`
  margin: 0 10px;
  background-color: silver;
  padding: 5px 10px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const searchInputContainer = {
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
};
const inputContainerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  overflow: 'hidden',
  height: 70,
  backgroundColor: '#ffffff',
};
const inputStyle = {
  backgroundColor: '#e2e2e250',
  borderRadius: 10,
  padding: 10,
};

export {
  Selected,
  NotSelected,
  searchInputContainer,
  inputContainerStyle,
  inputStyle,
};
