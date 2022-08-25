import React,{memo} from 'react';
import IOIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity,  View,  Animated} from 'react-native';
import {
  Header,
  InfoContainerHeader,
  InfoHeader,
  HeaderText,
} from './style';
import GS,{normalizedFontSize} from '../../../GlobeStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CollectionHeader = ({
  collectionInfo,
  opacity,
  navigation,
  headerSpace
}) => {
  const {name = '', description = ''} = collectionInfo ? collectionInfo : {};

  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  
  return (
    <>
      <Animated.View style={{opacity, zIndex: 1, transform: [{translateY: headerSpace}],backgroundColor:'#fff'}}>
        <Header style={{marginTop: 0,borderBottomWidth:.5,borderColor:'silver',backgroundColor:'#fff',paddingTop: 1}}>
          <View
            style={{
              height: '100%',
              width: 50,
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginLeft:0
            }}/>

          <InfoContainerHeader>
            <InfoHeader style={{justifyContent: 'center',width: '90%'}}>
              <HeaderText style={{fontSize: normalizedFontSize(9)}}>{name}</HeaderText>
              <HeaderText numberOfLines={2} ellipsizeMode="tail" style={{fontSize: normalizedFontSize(6), color: 'gray',lineHeight: 12,}}>
                {description}
              </HeaderText>
            </InfoHeader>
          </InfoContainerHeader>
        </Header>
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 0,
          zIndex: 1,
          paddingVertical: 4,
          paddingHorizontal: 4,
          borderRadius: 100,
          justifyContent: 'center',
          marginLeft: 10,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default memo(CollectionHeader);
