import React from 'react';
import {DEFAULT_REST_IMG} from '../../../assets/images';
import ProgressiveImage from '../../../components/ProgressiveImage';
import {generateReviewImgScr} from '../../../components/Helpers';
import {View} from 'react-native';
import CollectionInfo from './CollectionInfo';


const CollectionHeader = ({collectionInfo, style}) => (
  <View>
    <View style={{height: 50}}/>
 
    <View style={style.infoContainer}>
      <CollectionInfo info={collectionInfo}/>
    </View>
  </View>
);

export default CollectionHeader;