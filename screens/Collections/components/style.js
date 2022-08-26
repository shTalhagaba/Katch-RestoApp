import GS, {BoldText} from '../../../GlobeStyle';
import styled from 'styled-components';
import {
  StyleSheet
} from 'react-native';


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
  flex-grow:1;
  background-color: #fff;
  margin-top:10px;
`;

const InfoHeader = styled.View`
  justify-content: center;
`;

const HeaderText = styled(BoldText)`
  font-size: 15px;
  padding: 3px 5px;
`;



const RestInfoContainer = styled.View`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 18px 10px 10px;
`;



const style = StyleSheet.create({
  safeAreaStyle: {
      flex: 1,
      backgroundColor: '#fff',
  },
  infoContainer: {
      width: '100%',
      alignSelf: 'center',
      zIndex: 1,
      marginTop: 'auto',
  },
  contentContainerStyle:{
    marginHorizontal:5
  }
});

export default style;

export {
  Header,
  InfoContainerHeader,
  InfoHeader,
  HeaderText,
  RestInfoContainer,
};
