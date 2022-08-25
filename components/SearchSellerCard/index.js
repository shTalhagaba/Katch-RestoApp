import React from 'react';
import { View, Dimensions } from 'react-native';

//3rd party
import EIcon from 'react-native-vector-icons/EvilIcons';
import ICIcon from 'react-native-vector-icons/Ionicons';
import ADIcon from 'react-native-vector-icons/AntDesign';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

//others
import {RText,customFont} from '../../GlobeStyle';
import {Touchable, Image, MiniInfoContainer,IconTextContainer,IconText} from './style';
import {generateImgScr, getStarAverage} from '../../components/Helpers';
import ProgressiveImage from '../../components/ProgressiveImage';
import {DEFAULT_REST_IMG} from '../../assets/images';

const Card = ({item,navigation}) => {
  return (
    <Touchable onPress={() => navigation.navigate('Rest', {id: item._id})}>
      <ProgressiveImage 
        containerStyle={Image}
        source={generateImgScr(item._id, item.logo, Dimensions.get('window').width)}
        fallBackImage={DEFAULT_REST_IMG}
        resizeMode="cover"
      />
      <View style={{flexGrow: 1,marginBottom:'auto'}}>
      <View style={{ marginLeft: 10}}>
        <RText fontName={customFont.axiformaMedium} style={{fontSize: 14}}>
          {item.shopName}
        </RText>
        <RText style={{color: 'gray', marginTop: 7, fontSize: 12}}>
          {item.category}
        </RText>
        <View style={{flexDirection: 'row', marginTop: 7}}>
          <EIcon
            name="location"
            size={15}
            color="gray"
            style={{marginLeft: -3}}
          />
          <RText style={{color: 'gray', marginLeft: 2, fontSize: 10}}>
            {item.address}
          </RText>
        </View>
        </View>
        <MiniInfoContainer>
          <IconTextContainer>
            <ADIcon name="star" size={15} color="gold" />
            <IconText>{getStarAverage(item.stars)}</IconText>
          </IconTextContainer>
          <IconTextContainer >
            <ICIcon name="ios-timer" size={15} color="#000" />
            <IconText>{item.eta} min</IconText>
          </IconTextContainer>
          <IconTextContainer>
            <FAIcon
              name={item.isOpen ? 'door-open' : 'door-closed'}
              color={item.isOpen ? 'green' : 'gray'}
            />
            <IconText>{item.isOpen ? 'Open' : 'Closed'}</IconText>
          </IconTextContainer>
        </MiniInfoContainer>
      </View>
    </Touchable>
  );
};

export default Card;
