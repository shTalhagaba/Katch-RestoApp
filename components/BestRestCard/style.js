import styled from 'styled-components';
import {RText} from '../../GlobeStyle';

const Touchable = styled.TouchableOpacity`
  flex: 1;
  margin: 0 10px;
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
  min-width: 250px;
`;

const Image =  {
  height: 150,
  width: '100%',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  backgroundColor: '#fff',

}

const Logo = {
  height: 60,
  width: 60,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: '#fff',
  position: 'absolute',
  overflow: 'hidden',
  bottom: -30,
  left: 15,
  zIndex: 90,
  backgroundColor: '#fff',
}

const RestEta = styled.View`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  padding: 8px;
  border-radius: 100px;
  
`;

const InfoContainer = styled.View`
  padding:30px 25px 10px 25px;
`;

const CuisineType = styled(RText)`
  color: gray;
`;

const AddressContainer = styled.View`
  position: absolute;
  top: 10px;
  left: 80px;
  flex-direction: row;
`;

const Address = styled(RText)`
  font-size: 10px;
  margin-left: 5px;
  color: gray;
  max-width: 138px;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 5px;
  right: 20px;
`;

const Rating = styled(RText)`
  margin-left: 5px;
  color: gray;
`;

export {
  Touchable,
  Image,
  Logo,
  RestEta,
  InfoContainer,
  CuisineType,
  AddressContainer,
  Address,
  RatingContainer,
  Rating,
};
