import auth from '@react-native-firebase/auth';
import { StackActions, useNavigation } from '@react-navigation/native';
import React ,{useEffect} from 'react';
import { BackHandler, Dimensions, Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IOIcon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components';
import GS, { BoldText, normalizedFontSize, RText } from '../../GlobeStyle';

const AccountHeader = ({
  goBack,
  title,
  style = {},
  icon,
  clickable = false,
  sellerData = {},
  hideTitle = false,
  iconStyle = {},
  backIconName = 'md-arrow-back',
  backIconColor = GS.secondaryColor,
}) => {
  const user = auth().currentUser;
  const navigation = useNavigation();
  let deviceWidth = Dimensions.get('window').width;
  
  const onBack = () => {
    navigation.dispatch(StackActions.popToTop())    
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, []);

  return (
    <Header style={style}>
      <Touchable onPress={goBack} style={style?.backButton}>
        <IOIcon name={backIconName} size={30} color={backIconColor} />
      </Touchable>
      <View
        style={[
          { justifyContent: 'center', maxWidth: deviceWidth - 120 },
          icon ? { flexDirection: 'row', alignItems: 'center' } : null,
        ]}>
        {typeof title === 'string' ? (
          title !== '' ? (
            <>
              {icon && (
                <Image
                  source={icon}
                  style={[
                    {
                      height: 30,
                      width: 30,
                      marginRight: 10,
                      resizeMode: 'contain',
                    },
                    iconStyle,
                  ]}
                />
              )}
              <TouchableOpacity
                activeOpacity={clickable ? 0.2 : 1}
                onPress={() =>
                  clickable
                    ? navigation.navigate('Rest', {
                        id: sellerData._id,
                      })
                    : null
                }>
                <BoldText
                  style={{ fontSize: normalizedFontSize(8.5) }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {title}
                </BoldText>
              </TouchableOpacity>
            </>
          ) : null
        ) : (
          user && (
            <>
              <BoldText
                style={{ fontSize: normalizedFontSize(8.5), marginBottom: 2 }}>
                Account
              </BoldText>
              <RText style={{ color: 'gray', fontSize: 13 }}>
                {user.displayName}
              </RText>
            </>
          )
        )}
      </View>
    </Header>
  );
};

const Header = styled.View`
  padding: 12px 0px;
  background-color: #fff;
  flex-direction: row;
  height: 65px;
`;

const Touchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 20px;
`;

export default AccountHeader;
