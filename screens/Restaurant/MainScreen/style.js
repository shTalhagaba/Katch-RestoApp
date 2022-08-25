import GS, {BoldText,customFont,normalizedFontSize} from '../../../GlobeStyle';
import styled from 'styled-components';
import {Platform,Text} from 'react-native';

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  position:absolute;
  top: 0;
  left:0;
  right:0;
  background-color: #fff;
`;

const InfoContainerHeader = styled.View`
  flex-direction: row;
  padding: 0 10px;
  flex-grow: 1;
  background-color: #fff;
`;

const InfoHeader = styled.View`
  justify-content: center;
`;

const HeaderText = styled(BoldText)`
  font-size: 15px;
  padding: 3px 5px;
`;

const HeaderImage = {
  marginTop: 'auto',
  marginBottom: 'auto',
  marginLeft: 'auto',
  height: 50,
  width: 50,
  borderRadius: 100,
  overflow:'hidden'
}

export {
  Header,
  InfoContainerHeader,
  InfoHeader,
  HeaderText,
  HeaderImage
};
