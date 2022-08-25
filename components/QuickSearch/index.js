import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { RText } from '../../GlobeStyle';
import styles from './styles';
const QuickSearch = ({ navigation, marketingData }) => {
  const [quickSearchList, setQuickSeachList] = useState([]);
  useEffect(() => {
    if (marketingData && marketingData?.quickSearch && marketingData.quickSearch.data) {
      const list = marketingData.quickSearch.data;
      list.indexOf('See More') === -1 ? list.push('See More') : null;
      setQuickSeachList(list);
    }
  }, [marketingData?.quickSearch]);

  return quickSearchList.length ? (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {quickSearchList.map((item) => (
          <QuickItem qItem={item} navigation={navigation} key={item} />
        ))}
      </View>
    </View>
  ) : null;
};

const QuickItem = ({ qItem, navigation }) => {
  const search = (/** @type {String} */ searchCategory) => {
    navigation.navigate('Search', {
      searchCategory: searchCategory,
      updated: Date.now(),
    });
  };
  return (
    <TouchableOpacity
      style={[
        styles.quickContainer,
        qItem === 'See More' ? styles.seeMore : null,
      ]}
      onPress={() => search(qItem)}>
      <RText
        style={[
          styles.textColor,
          qItem === 'See More' ? styles.seeMoreText : null,
        ]}>
        {qItem === 'See More' ? <>View More &gt;&gt;</> : qItem}
      </RText>
    </TouchableOpacity>
  );
};

const mapStateToProps = (
  /** @type {{ app: { marketingData: any; }; }} */ state,
) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(QuickSearch);
