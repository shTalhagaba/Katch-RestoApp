import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import GS, {RText} from '../../GlobeStyle';
import Item from '../../components/LandingCategoriesItem';
import {ScrollView} from 'react-native-gesture-handler';
import ADIcon from 'react-native-vector-icons/AntDesign';

const buttons = [
  {
    name: 'Filter',
    Icon: (props) => <ADIcon name="filter" size={12} {...props} />,
    onPress: (navigate) => {
      navigate('Search', {
        toggleSortFilter: true,
      });
    },
  },
  {
    name: 'Rating: 4+',
    onPress: (navigate) => {
      navigate('Search', {
        filter: [
          {
            type: 'rating',
            values: ['4'],
          },
        ],
      });
    },
  },
  {
    name: 'Closest to me',
    onPress: (navigate) => {
      //TODO: Change logic
      navigate('Search', {
        sort: ['distance', 'asc'],
      });
    },
  },
  {
    name: 'Time To Prepare',
    onPress: (navigate) => {
      navigate('Search', {
        searchString: '',
        sort: ['ttp', 'asc'],
      });
    },
  },
  {
    name: 'Best Selling',
    onPress: (navigate) => {
      navigate('Search', {
        searchString: '',
        sort: ['totalCompletedOrders', 'asc'],
      });
    },
  },
];

const TagList = ({navigation,data}) => {
  const quickFilters = !data ? [] : data.map(filter => ({
    name: filter.name,
    onPress: (navigate) => {
      navigate('Search', {
        filter: [
          {
            type: filter.type,
            values: [filter.name],
          },
        ],
      });
    },
  }))

  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingTop: 25,
      }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{flexDirection: 'row'}}>
        {[...buttons,...quickFilters].map((item,index) => {
          const Icon = item.Icon;
          return (
            <TouchableOpacity
              key={item.name + index}
              onPress={() => item.onPress(navigation.navigate)}
              style={{
                marginLeft: 10,
                marginRight: 10,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#d3d3d3',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
                minWidth: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {item.Icon && <Icon color='#595959'/>}
              <RText

                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  color: '#595959',
                  marginLeft: 5,
                  // fontFamily: 'Kastelov - Axiforma Light'
                }}>
                {item.name}
              </RText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TagList;
