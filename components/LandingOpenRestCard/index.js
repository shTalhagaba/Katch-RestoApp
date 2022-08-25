import React from 'react';
import { Dimensions } from 'react-native';
import {
  AddressContainer,
  Address,
  Rate,
  Name,
  NameAndRateContainer,
  InnerContainer,
  Container,
  Touchable,
} from './style';
import EVIcon from 'react-native-vector-icons/EvilIcons';
import ANIcon from 'react-native-vector-icons/AntDesign';
import { DEFAULT_REST_IMG} from '../../assets/images';
import {generateImgScr} from '../Helpers';
import ProgressiveImage from '../ProgressiveImage';

const Card = ({navigation, shopName, _id, address,logo, rating,...props}) => {
  const imageScr = generateImgScr(_id,logo, Dimensions.get('window').width);
  
  const _onPress = () => {
    navigation.navigate('Rest',{
      id:_id
    })
  }

  return(
  <Touchable onPress={_onPress}>
    <Container>
      <ProgressiveImage
        containerStyle={{ 
          height: 120,
          width: 120,
          borderRadius: 20,
          marginBottom: 5,
          marginLeft: 10,
          overflow:'hidden'
        }}
        fallBackImage={DEFAULT_REST_IMG}
        source={imageScr}
      />
      <InnerContainer>
        <NameAndRateContainer>
          <Name numberOfLines={1} ellipsizeMode="tail">
            {shopName}
          </Name>
          <ANIcon name="star" style={{marginLeft: 'auto'}} color="gold" />
          <Rate>{rating?rating.toFixed(1):0}</Rate>
        </NameAndRateContainer>
        <AddressContainer>
          <Address numberOfLines={1} ellipsizeMode="tail">
            {address}
          </Address>
        </AddressContainer>
      </InnerContainer>
    </Container>
  </Touchable>
)};

export default Card;