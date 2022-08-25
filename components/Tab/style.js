import styled from 'styled-components';
import {Platform} from 'react-native';
import GS from '../../GlobeStyle';

const TabBar = styled.View`
  flex-direction: row;
  background-color: ${GS.primaryColor};
  padding: 0 0 2px 0;
`;

const TabTouchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 0 10px 0;
`;

const ItemNumContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 35px;
  z-index: 1;
  background-color: ${GS.secondaryColor};
  color: #fff;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
`;

export {
  TabBar, 
  TabTouchable, 
  ItemNumContainer
};
