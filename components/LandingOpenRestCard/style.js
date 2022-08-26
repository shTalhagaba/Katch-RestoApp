import styled from 'styled-components';
import {RText} from '../../GlobeStyle';

const Touchable = styled.TouchableOpacity`
  flex: 1;
  background-color: #ffffff50;
`;

const Container = styled.View`
  flex: 1;
  overflow: hidden;
  flex-direction: row;
  padding: 5px 0;

`;

const RestImage = styled.Image`
 

`;

const InnerContainer = styled.View`
  margin: 10px 0 10px 10px;
  flex-grow: 1;
`;

const NameAndRateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Name = styled(RText)`
  font-size: 17px;
  padding: 5px;
  flex: 1;
`;

const Rate = styled(RText)`
  margin: 0 20px 0 5px;
  color: gray;
`;

const Address = styled(RText)`
  font-size: 12px;
  padding: 0 5px;
  flex: 1;
  color: gray;
  max-width: 230px;
  align-self: flex-start;
  margin-right:auto;
`;

const AddressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export {
  AddressContainer,
  Address,
  Rate,
  Name,
  NameAndRateContainer,
  InnerContainer,
  RestImage,
  Container,
  Touchable,
};