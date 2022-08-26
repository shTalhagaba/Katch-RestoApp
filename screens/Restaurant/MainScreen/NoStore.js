import React from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { NO_RESTAURANT } from '../../../assets/images';
import { BoldText, RText } from '../../../GlobeStyle';
import style from './stylesheet';
const NoStore = ({ navigation, show }) => {
  return (
    <Modal
      animationType="slide"
      statusBarTranslucent={false}
      transparent={true}
      visible={show}>
      <SafeAreaView style={style.safeAreaView}>
        <View style={style.imageContainer}>
          <Image source={NO_RESTAURANT} style={style.image} />
        </View>
        <View style={style.noStoreContainer}>
          <BoldText style={style.boldtext}>Restaurant not found</BoldText>
        </View>
        <RText style={style.description}>But we have a wide selection</RText>
        <View style={style.wrapper}>
          <RText style={style.description}>Hit </RText>
          <BoldText style={[style.description, style.greencolor]}>
            {' '}
            ‘Home’{' '}
          </BoldText>
          <RText style={style.description}>to explore</RText>
        </View>
        <TouchableOpacity
          style={style.goHome}
          onPress={() => navigation.navigate('Home')}>
          <RText style={style.goHomeText}>Home</RText>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default NoStore;
