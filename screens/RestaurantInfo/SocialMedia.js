import React from 'react';
import { Linking, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { BoldText } from '../../GlobeStyle';
import style from './style';

const SocialMedia = ({ socialMedia }) => {
  const checkEmptySocialMedia = (_social) => {
    return Object.keys(_social).some((x) => _social[x] !== '');
  };
  return (
    socialMedia &&
    checkEmptySocialMedia(socialMedia) && (
      <View style={style.socialContainer}>
        <View style={style.justifyCenter}>
          <BoldText style={style.socialMediaLabel}>Social Links</BoldText>
        </View>
        <View style={style.social}>
          <View style={style.socialMediaContainer}>
            <SocialIcons socialMedia={socialMedia} />
          </View>
        </View>
      </View>
    )
  );
};

const SocialIcons = ({ socialMedia }) => {
  // color map for social media. index[0] is background and index[1] is font color
  const colorMap = {
    facebook: ['#207ceb', '#fff'],
    instagram: ['#e71638', '#fff'],
    snapchat: ['#ffd600', '#333'],
    twitter: ['#1eaeea', '#fff'],
  };
  const fontSize = 14;

  //TODO CHECK WHAT CAN BE DONE BETTER FOR FB APP
  const openWebPage = (/** @type {string} */ weblink) => {
    Linking.canOpenURL(weblink).then((canOpen) => {
      if (canOpen) {
        Linking.openURL(weblink);
      }
    });
  };
  if (socialMedia) {
    return (
      <>
        {Object.keys(socialMedia)
          .filter((x) => socialMedia[x])
          .map((socialMediaName, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => openWebPage(socialMedia[socialMediaName])}>
              <View
                style={[
                  style.mediaContainer,
                  { backgroundColor: colorMap[socialMediaName][0] },
                ]}>
                <View style={style.justifyCenter}>
                  <FaIcon
                    name={socialMediaName}
                    size={fontSize}
                    // color={colorMap[socialMediaName]}
                    color={'#fff'}
                    style={style.socialMediaIcon}
                  />
                </View>
                <View style={style.justifyCenter}>
                  <BoldText
                    style={[
                      style.socialMediaText,
                      {
                        color: colorMap[socialMediaName][1],
                      },
                    ]}>
                    {socialMediaName}
                  </BoldText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </>
    );
  }
  return <> </>;
};

export default SocialMedia;
