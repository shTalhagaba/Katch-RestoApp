import styled from 'styled-components';
import {customFont,normalizedFontSize} from '../../GlobeStyle';

const MainImage = {
  width: '100%',
  height: 250,
  marginTop: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  zIndex: -20,
  overflow:'hidden'
}

const RestInfoContainer = styled.View`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 18px 10px 10px;
`;

const Logo = {
  position: 'absolute',
  top: 7,
  right: 10,
  height: 60,
  width: 60,
  borderRadius: 35,
  overflow:'hidden'
}

const MinInfoContainer = styled.View`
  flex-direction: column;
  padding: 0 20px;
  margin-top: 8px;
  padding-top: 10px;
  align-items: flex-start;
  justify-content: flex-end;
`;

const EmptyTextFiller = styled.Text`
  flex:1;
`;

const ReviewButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const IconTextContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`;

const IconText = styled.Text`
  margin-left: 5px;
  color: gray;
  font-size: 12px;
`;

const ShopNameText = styled.Text`
  font-size : ${normalizedFontSize(9.126)};
  font-family: ${customFont.axiformaBold};
`;

export {
  MainImage,
  RestInfoContainer,
  Logo,
  MinInfoContainer,
  ReviewButton,
  IconTextContainer,
  IconText,
  EmptyTextFiller
};