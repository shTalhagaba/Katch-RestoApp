/* eslint-disable react-native/no-inline-styles */
import React, {useRef, memo, useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';
//3rd party
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client'
import IOIcon from 'react-native-vector-icons/Ionicons';

//others
import GS,{customFont} from '../../GlobeStyle';
import {FILTER_ICON, SEARCH_SELECTED} from '../../assets/images';
import Icon from '../../components/Icon';
import {GET_QUICK_FILTERS} from '../../components/GraphQL';
import ADIcon from 'react-native-vector-icons/AntDesign';
import SearchDelivery from './searchdelivery';
import { animateLayout } from '../../components/Helpers';

const SearchHeader = (props) => {
  const {
    onBack,
    onTextChange,
    searchQuery,
    debounce,
    commenceSearch,
    toggleSortFilter,
    showQuickFilters,
    setSearchQuery,
    setShowQuickFilters,
    route,
    searchResults,
    navigation,
  } = props;

  const [quickFilters, setQuickFilters] = useState(null);

  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS !== 'ios' ? Math.ceil(StatusBar.currentHeight) : insets.top;

  const debounceRef = useRef(debounce());
  const inputRef = useRef(null);

  const shadow = {
      borderWidth: 0.1,
      borderColor: GS.lightGrey2,
  };

  useQuery(GET_QUICK_FILTERS, {
    onCompleted: (data) => {
      setQuickFilters(data.getLandingContent.quickFilters);
    },
  });

  useEffect(() => {
    if (
      route.params.hasOwnProperty('toggleSortFilter') &&
      route.params.toggleSortFilter
    ) {
      toggleSortFilter(true);
    }
  }, []);

  useEffect(() => {
    if (!searchResults && inputRef.current && !route.params.toggleSortFilter) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  return (
    <>
      <View
        style={{
          top: statusBarHeight,
          height: 80,
          flexDirection: 'column',
          zIndex: 3,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: '#fff',
        }}>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
            Platform.OS === 'ios' ? shadow : {},
          ]}>
          <View
            style={[
              {
                flex: 0.2,
                alignItems: 'flex-start',
              },
            ]}>
            <TouchableOpacity
              onPress={onBack}
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 7,
                  borderRadius: 100,
                  backgroundColor: '#fff',
                  height: 45,
                  width: 45,
                },
                Platform.OS !== 'ios' ? shadow : {},
              ]}>
              <IOIcon name="md-arrow-back" size={30} color={GS.secondaryColor} />
            </TouchableOpacity>
          </View>
          <View
            style={[
              {
                flex: 1,
                borderRadius: 10,
                overflow: 'hidden',
              },
              Platform.OS !== 'ios' ? shadow : {},
            ]}>
            <View
              style={[{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#fff',
              },shadow]}>
              <TouchableOpacity
                onPress={() => {
                  debounceRef.current.cancel();
                  commenceSearch();
                  Keyboard.dismiss();
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                }}>
                <Icon
                  source={SEARCH_SELECTED}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
              <TextInput
                onFocus={() => {
                  setShowQuickFilters(true)
                }}
                onBlur={() => {
                  setShowQuickFilters(false)

                }}
                autoFocus
                allowFontScaling={false}
                ref={inputRef}
                style={{
                  color: '#000',
                  flex: 1,
                  paddingVertical: 14,
                  maxHeight: 45,
                  fontFamily: customFont.axiformaRegular,
                }}
                value={searchQuery.searchString}
                onSubmitEditing={() => {
                  debounceRef.current.cancel();
                  commenceSearch();
                }}
                placeholder="Search"
                placeholderTextColor="#000"
                onChangeText={(text) => {
                  onTextChange(text, debounceRef.current.search);
                  if (text === '') {
                   animateLayout()

                    setShowQuickFilters(true);
                  } else {
                   animateLayout()
                    if (
                      (searchResults?.sellers.data.length < 1 &&
                        searchResults?.products.data.length < 1) ||
                      !searchResults
                    ) {
                      return true;
                    }
                    setShowQuickFilters(false);
                  }
                }}
              />
              { searchQuery.searchString !== '' && <TouchableOpacity style={{ 
                paddingVertical: 10,
                paddingHorizontal: 10,
                justifyContent: 'center',
                alignItems:'center',
                marginRight: 10,
               }} onPress={() => {
                 onTextChange('', debounceRef.current.search);
              }}>
                <ADIcon name="close" color="gray" size={20}/>
              </TouchableOpacity>}
            </View>
          </View>
          <View
            style={{
              flex: 0.2,
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => {
                inputRef.current.blur()
                toggleSortFilter()
              }}
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  backgroundColor: '#fff',
                },
                Platform.OS !== 'ios' ? shadow : {},
              ]}>
              <Icon
                source={FILTER_ICON}
                style={{
                  height: 45,
                  width: 45,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <SearchDelivery
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          commenceSearch={commenceSearch}
        />
      </View>

      {/* {showQuickFilters && quickFilters && (
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 15,
            width: '100%',
            top: 80 + statusBarHeight,
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 12,
            backgroundColor: '#fff',
          }}>
          <BoldText style={{color: '#363946'}}>
            Quick Filters
          </BoldText>

          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
            }}>
            {[
              {
                name: 'Rating: 4+',
                type: 'rating',
                value: '4',
              },
              {
                name: 'Closest to me',
                sort: ['distance', 'asc'],
              },
              {
                name: 'Time To Prepare',
                sort: ['ttp', 'asc'],
              },
              {
                name: 'Best Selling',
                sort: ['totalCompletedOrders', 'asc'],
              },
              ...quickFilters,
            ].map(({name, type, sort, value}, index, arry) => {
              const selectedFilters = searchQuery.filter
                .map((filter) => filter.values)
                .flat();

              const isSelected = sort? searchQuery.sort[0] === sort[0] : selectedFilters.includes(value?value:name);

              const onPress = () => {
                setShowQuickFilters(false);

                setSearchQuery((state) => {
                  const clonedState = deepClone(state);
                  const filterLength = clonedState.filter.length;
                  if (type) {
                    const findTypeIndex = clonedState.filter.findIndex((filter) => filter.type === type);

                    if (findTypeIndex < 0) {
                      clonedState.filter.push({
                        type,
                        values: [value ? value : name],
                      });
                    } else {
                      for (let i = 0; i < filterLength; i++) {
                        const selectedFilterType = clonedState.filter[i].type;
                        if (selectedFilterType === type) {
                          const findValueIndex = clonedState.filter[
                            i
                          ].values.findIndex((findValue) => findValue === name || findValue === value);

                          if (findValueIndex > -1) {
                            clonedState.filter[i].values.splice(
                              findValueIndex,
                              1,
                            );
                            const valuesLength =
                              clonedState.filter[i].values.length;
                            if (valuesLength < 1) {
                              clonedState.filter.splice(i, 1);
                            }
                          } else {
                            clonedState.filter[i].values.push(
                              value ? value : name,
                            );
                          }
                        }
                      }
                    }
                  } else {
                    if(clonedState.sort[0] === sort[0]){
                      clonedState.sort = [];
                    }else{
                      clonedState.sort = sort;
                    }
                  }

                  state = clonedState;

                  commenceSearch(state);

                  return state;
                });
              };

              return (
                <View
                  key={name + type + index}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: isSelected ? '#b0e9ff' : '#f5f5f5',
                    borderWidth: 0.5,
                    borderColor: isSelected ? '#2cb4eb' : '#00000000',
                    borderRadius: 5,
                    marginHorizontal: 5,
                    marginVertical: 5,
                  }}>
                  <TouchableOpacity onPress={onPress}>
                    <RText style={{color: '#3D4653'}}>{name}</RText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )} */}
    </>
  );
};

export default memo(SearchHeader);
