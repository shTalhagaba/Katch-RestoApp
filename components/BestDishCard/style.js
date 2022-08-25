import styled from 'styled-components';
import GS, {RText} from '../../GlobeStyle';

const TouchableCard = styled.TouchableOpacity`
  margin: 5px 10px;
  overflow: hidden;
  width: 100%;
  height: 120px;
  background-color: #fff;
  `;

const CardContainer = styled.View`
  overflow: hidden;
  background-color: #e2e2e280;
  flex-direction: row;
  padding: 0;
  flex: 1;
`;

const InfoContainer = styled.View`
  flex: 1;
  margin: 5px 0 0 0;
`;


const PriceCartContainer = styled.View`
  margin-top: auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
`;

const Price = styled(RText)`
  font-size: 15px;
  color: gray;
`;

const AddCartTouchable = styled.TouchableOpacity`
  background-color: ${GS.secondaryColor};
  padding: 7px 10px;
  border-radius: 10px;
`;

const AddCartText = styled(RText)`
  color: ${GS.buttonTextColor};
  font-size: 12px;
  text-align: center;
  justify-content:center;
`;

const Polygon = styled.View`
  height: 150px;
  width: 150px;
  position: absolute;
  top: -40px;
  bottom: 0;
  left: 120px;
  z-index: 2;
  background-color: #fff;
`;

export {
  TouchableCard,
  CardContainer,
  InfoContainer,
  PriceCartContainer,
  Price,
  AddCartTouchable,
  AddCartText,
  Polygon
};
