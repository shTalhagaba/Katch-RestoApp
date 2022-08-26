import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { default as ADIcon } from 'react-native-vector-icons/AntDesign';
import IOIcon from 'react-native-vector-icons/Ionicons';
import GS, { TextBasic } from '../../../GlobeStyle';
import styles from './styles';

const Header = ({ shopName, goBack, clearCart }) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
      </TouchableOpacity>
      <TouchableOpacity>
        <TextBasic style={styles.shopText}>{shopName}</TextBasic>
      </TouchableOpacity>
      {clearCart && (
        <ADIcon
          onPress={() => clearCart()}
          name="delete"
          size={25}
          color={GS.textColorGreyDark2}
          style={styles.deleteIcon}
        />
      )}
    </View>
  );
};

export default Header;
