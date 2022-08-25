import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import GS, {
  normalizedFontSize,
  BoldText,
  RText,
  customFont,
} from '../../GlobeStyle';
import ADIcon from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native-gesture-handler';
import CB from 'react-native-check-box';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import VerticalSlider from 'rn-vertical-slider';
import {connect} from 'react-redux';
import {askLocation} from '../../components/Alerts';
import LinearGradient from 'react-native-linear-gradient';

const SearchFilter = (props) => {
  const {
    toggleSortFilter,
    categoriesList,
    tagsList,
    searchQuery,
    setSearchQuery,
    commenceSearch,
    requestLocation,
    servicesList,
    defaultFilter = 'Sort By',
  } = props;

  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState(searchQuery.sort);

  const getSearchFilterValues = (type) => {
    return searchQuery.filter.reduce((acc, search) => {
      if (search.type === type) {
        acc = search.values;
      }
      return acc;
    }, []);
  };

  const initialFilter = {
    category: getSearchFilterValues('category'),
    tags: getSearchFilterValues('tags'),
    rating: getSearchFilterValues('rating'),
    services: getSearchFilterValues('services'),
  };

  const [filters, setFilters] = useState(initialFilter);
  const [viewOptions, setViewOptions] = useState(defaultFilter);

  const setSelected = (type, value, toggleState) => {
    let selectedFilters = filters;
    if (type !== 'rating') {
      if (toggleState) {
        selectedFilters[type].push(value);
      } else {
        selectedFilters[type] = selectedFilters[type].filter(
          (selected) => selected != value,
        );
      }
    } else {
      selectedFilters[type] = [value];
    }
    setFilters(selectedFilters);
  };

  const makeSearchQuery = () => {
    let query = {
      sort: [],
      filter: [],
    };
    Object.keys(filters).forEach((type) => {
      if (filters[type].length > 0) {
        query.filter.push({
          type: type,
          values: filters[type],
        });
      }
    });
    query.sort = sort;
    return Promise.resolve(query);
  };

  const _onApply = () => {
    makeSearchQuery()
      .then((res) => {
        setSearchQuery({
          ...searchQuery,
          ...res,
        });
        return {
          ...searchQuery,
          ...res,
        };
      })
      .then((res2) => {
        commenceSearch(res2);

        toggleSortFilter();
      });
  };

  const _onClear = () => {
    const reset = {
      cursor: null,
      limit: 10,
      sort: [],
      filter: [],
    };
    setSearchQuery((state) => {
      commenceSearch({
        ...state,
        ...reset,
      });

      toggleSortFilter();

      return {
        ...state,
        ...reset,
      };
    });
  };

  return filters ? (
    <View style={{flex: 1}}>
      <View style={{flex: 0.25}}>
        <TouchableWithoutFeedback onPress={() => toggleSortFilter()}>
          <View style={{height: '100%'}} />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          flex: 1,
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}>
        {/* header */}
        <LinearGradient
          colors={['#15a0db', '#2cb4eb', '#2fb9ed']}
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderBottomWidth: 0.3,
            borderBottomColor: 'rgba(220,220,220,.50)',
            alignItems: 'center',
          }}>
          <View style={{marginRight: 10, flex: 1, justifyContent: 'center'}}>
            <BoldText
              style={{
                textAlign: 'center',
                fontSize: normalizedFontSize(9),
                color: '#fff',
              }}>
              Sort and Filter
            </BoldText>
          </View>

          <TouchableOpacity
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
            onPress={() => toggleSortFilter()}>
            <ADIcon color="#fff" name="close" size={20} />
          </TouchableOpacity>
        </LinearGradient>

        {/* header */}

        {/* body */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{
              borderRightWidth: 0.3,
              borderRightColor: 'rgba(220,220,220,.50)',
              backgroundColor: '#fff',
            }}>
            {['Sort By', 'Category', 'Rating', 'Services', 'More Filters'].map((item, index) => {
              const isSelected = viewOptions === item;


              const onPress = () => {
                setViewOptions(state => {
                  if(state !== item){
                    state = item
                  }
                  return state
                });
              };

              return (
                <TouchableOpacity
                  onPress={onPress}
                  key={item + index + isSelected}
                  style={{
                    borderRightWidth: isSelected ? 0.3 : 0,
                    borderRightColor: 'rgba(220,220,220,.50)',
                    height: 80,
                    minWidth: 110,
                    backgroundColor: isSelected ? '#ebfcff' : 'f5f5f5',
                  }}>
                  <View
                    style={{
                      flexGrow: 1,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#ebfcff' : '#f5f5f5',
                    }}>
                    <BoldText
                      fontName={customFont.axiformaBold}
                      style={{
                        fontSize: normalizedFontSize(6),
                        marginLeft: 10,
                        marginRight: 20,
                        color: isSelected ? '#000' : 'rgba(0,0,0,.50)',
                      }}>
                      {item}
                    </BoldText>
                  </View>

                  {isSelected && (
                    <View
                      style={{
                        width: '100%',
                        height: 5,
                        backgroundColor: '#2cb4eb',
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <ShowView
              requestLocation={requestLocation}
              rating={rating}
              setRating={setRating}
              searchQuery={searchQuery}
              filters={filters}
              setSelected={setSelected}
              viewOptions={viewOptions}
              sort={sort}
              setSort={setSort}
              tagsList={tagsList}
              categoriesList={categoriesList}
              servicesList={servicesList}
            />
          </View>
        </View>
        {/* body */}

        {/* footer */}
        <View
          style={{
            flexDirection: 'row',
            height: 80,
            marginTop: 'auto',
            borderTopWidth: 0.3,
            borderTopColor: 'rgba(220,220,220,.50)',
          }}>
          <View
            style={{
              width: '50%',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={_onClear}
              style={{
                backgroundColor: '#e6e6e6',
                paddingVertical: 18,
                marginHorizontal: 20,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <BoldText
                style={{
                  color: '#2cb4eb',
                  fontSize: normalizedFontSize(9),
                }}>
                Clear all
              </BoldText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '50%',
              justifyContent: 'center',
            }}>
            <LinearGradient
              colors={['#15a0db', '#2cb4eb', '#2fb9ed']}
              style={{
                backgroundColor: GS.secondaryColor,
                marginHorizontal: 20,
                borderRadius: 10,
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 18,
                }}
                onPress={_onApply}>
                <BoldText
                  style={{color: '#fff', fontSize: normalizedFontSize(9)}}>
                  Apply
                </BoldText>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        {/* footer */}
      </View>
    </View>
  ) : null;
};

const Categories = (props) => {
  const {categoriesList, setSelected, filters} = props;
  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 20}}
      data={categoriesList}
      renderItem={(item) => (
        <CategoriesRenderItem
          {...item}
          setSelected={setSelected}
          filters={filters}
          listLength={categoriesList.length - 1}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const CategoriesRenderItem = (props) => {
  const {item, index, listLength, setSelected, filters} = props;
  const isSelected = filters.category.includes(item.name);
  const [toggleCheckBox, setToggleCheckBox] = useState(isSelected);
  const onPress = () => {
    setToggleCheckBox((toggleState) => {
      toggleState = !toggleState;
      setSelected('category', item.name, toggleState);
      return toggleState;
    });
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderTopWidth: 0.2,
        borderBottomWidth: index === listLength ? 0.2 : 0,
        borderColor: 'gray' 
      }}>
      <View
        style={{
          marginVertical: 12,
          flexDirection: 'row',
          marginHorizontal: 20,
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: toggleCheckBox ? '#b0e9ff' : '#fff',
          paddingHorizontal: 15,
          borderRadius: 20,
          borderColor: toggleCheckBox ? '#2cb4eb' : '#00000000',
          borderWidth: 1,
        }}>
        <CB
          style={{
            opacity: 0,
            width: 0,
          }}
          disabled={true}
          onClick={() => null}
          isChecked={toggleCheckBox}
          checkBoxColor={toggleCheckBox ? GS.secondaryColor : 'gray'}
        />
        <RText style={{fontSize: normalizedFontSize(6)}}>
          {item.name}
        </RText>
      </View>
    </TouchableOpacity>
  );
};

const MoreFilters = (props) => {
  const {tagsList, setSelected, filters} = props;
  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 20}}
      data={tagsList}
      renderItem={(item) => (
        <MoreFiltersRenderItem
          {...item}
          setSelected={setSelected}
          filters={filters}
          listLength={tagsList.length - 1}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const MoreFiltersRenderItem = (props) => {
  const {item, index, listLength, setSelected, filters} = props;
  const isSelected = filters.tags.includes(item.name);

  const [toggleCheckBox, setToggleCheckBox] = useState(isSelected);

  const onPress = () => {
    setToggleCheckBox((toggleState) => {
      toggleState = !toggleState;
      setSelected('tags', item.name, toggleState);
      return toggleState;
    });
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderTopWidth: 0.2,
        borderBottomWidth: index === listLength ? 0.2 : 0,
        borderColor: 'gray',
      }}>
      <View
        style={{
          marginVertical: 12,
          flexDirection: 'row',
          marginHorizontal: 20,
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: toggleCheckBox ? '#b0e9ff' : '#fff',
          paddingHorizontal: 15,
          borderRadius: 20,
          borderColor: toggleCheckBox ? '#2cb4eb' : '#00000000',
          borderWidth: 1,
        }}>
        <CB
          style={{
            opacity: 0,
            width: 0,
          }}
          disabled={true}
          onClick={() => null}
          isChecked={toggleCheckBox}
          checkBoxColor={toggleCheckBox ? GS.secondaryColor : 'gray'}
        />
        <RText style={{fontSize: normalizedFontSize(6)}}>
          {item.name}
        </RText>
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => {
  return {
    userLoc: state.app.userLoc,
  };
};

const Sort = connect(
  mapStateToProps,
  null,
)((props) => {
  const {sort, setSort, userLoc, requestLocation} = props;
  const selections = ['totalCompletedOrders', 'distance', 'rating', 'ttp'];
  const [selected, setSelected] = useState(-1);
  const UserText = {
    totalCompletedOrders: 'Best Selling',
    distance: 'Distance',
    rating: 'Rating',
    ttp: 'Time To Prepare',
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <RadioForm formHorizontal={false} animation={true} initial={-1}>
        {selections.map((selection, index) => {
          const isSelected = selected === index || sort.includes(selection);
          const listLength = selections.length - 1;
          const onPress = () => {
            if (selection === 'distance') {
              if (userLoc) {
                setSelected(index);
                setSort([selection, 'asc']);
              } else {
                askLocation({
                  onConfirm: () => {
                    requestLocation((res) => {
                      if (res === 'granted') {
                        setSelected(index);
                        setSort([selection, 'asc']);
                      }
                    });
                  },
                });
              }
            } else {
              setSelected(index);
              setSort([selection, 'asc']);
            }
          }

          return (
            <TouchableOpacity
              key={selection + index}
              onPress={onPress}
              style={{
                borderTopWidth: 0.2,
                borderBottomWidth: index === listLength ? 0.2 : 0,
                borderColor: 'gray',
              }}>
              <View
                style={{
                  marginVertical: 12,
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  backgroundColor: isSelected ? '#b0e9ff' : '#fff',
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  borderColor: isSelected ? '#2cb4eb' : '#00000000',
                  borderWidth: 1,
                }}
                >
                <RadioButton
                  labelHorizontal={true}
                  style={{
                    width: '100%',
                    paddingTop: 6,
                  }}>
                  <RText style={{fontSize: normalizedFontSize(6)}}>
                    {UserText[selection]}
                  </RText>
                </RadioButton>
              </View>

              <RadioButtonInput
                obj={{
                  name: selection,
                  value: index,
                }}
                index={index}
                isSelected={isSelected}
                onPress={() => null}
                borderWidth={0}
                buttonInnerColor={isSelected ? GS.secondaryColor : '#fff'}
                buttonOuterColor={isSelected ? GS.secondaryColor : 'gray'}
                buttonWrapStyle={{
                  marginLeft: 10,
                  width: 0,
                  height: 0,
                  overflow: 'hidden',
                }}
              />
            </TouchableOpacity>
          );
        })}
      </RadioForm>
    </View>
  );
});

const Rating = (props) => {
  const {filters, rating, setRating, setSelected} = props;
  //If rating array is null,or value is null, then set rateAt = 0
  const rateAt = parseFloat(filters.rating && filters.rating[0]?filters.rating[0]:0);
  const RateText =
    rateAt === 0 || isNaN(rateAt) ? 'Any +' : rateAt === 5 ? 5 : `${rateAt} +`;
  return (
    <View
      style={{
        marginTop: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <View style={{position: 'absolute', top: 20, left: 20}}>
        <BoldText>{RateText}</BoldText>
      </View>
      <VerticalSlider
        value={rateAt}
        min={0}
        max={5}
        onChange={(value) => {
          setRating((state) => {
            setSelected('rating', `${value}`);
            state = value;
            return state;
          });
        }}
        width={50}
        height={300}
        step={0.5}
        borderRadius={5}
        minimumTrackTintColor="#2cb4eb"
        maximumTrackTintColor="rgba(220,220,220,1)"
        showBallIndicator
        ballIndicatorColor="#2cb4eb"
        ballIndicatorTextColor={'white'}
        showBallIndicator={false}
      />
    </View>
  );
};

const Services = (props) => {
  const { servicesList = [], setSelected, filters } = props;
  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 20 }}
      data={servicesList}
      renderItem={(item) => (
        <ServiceRenderItem
          {...item}
          setSelected={setSelected}
          filters={filters}
          listLength={servicesList.length - 1}
        />
      )}
      keyExtractor={(item) => item.name}
    />
  );
};

const ServiceRenderItem = (props) => {
  const { item, index, listLength, setSelected, filters } = props;
  const isSelected = filters.services.includes(item.name);

  const [toggleCheckBox, setToggleCheckBox] = useState(isSelected);

  const onPress = () => {
    setToggleCheckBox((toggleState) => {
      toggleState = !toggleState;
      setSelected('services', item.name, toggleState);
      return toggleState;
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderTopWidth: 0.2,
        borderBottomWidth: index === listLength ? 0.2 : 0,
        borderColor: 'gray',
      }}>
      <View
        style={{
          marginVertical: 12,
          flexDirection: 'row',
          marginHorizontal: 20,
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: toggleCheckBox ? '#b0e9ff' : '#fff',
          paddingHorizontal: 15,
          borderRadius: 20,
          borderColor: toggleCheckBox ? '#2cb4eb' : '#00000000',
          borderWidth: 1,
        }}>
        <CB
          style={{
            opacity: 0,
            width: 0,
          }}
          disabled={true}
          onClick={() => null}
          isChecked={toggleCheckBox}
          checkBoxColor={toggleCheckBox ? GS.secondaryColor : 'gray'}
        />
        <RText style={{fontSize: normalizedFontSize(6)}}>
          {item.name}
        </RText>
      </View>
    </TouchableOpacity>
  );
};

const ShowView = (props) => {
  switch (props.viewOptions) {
    case 'Category':
      return <Categories {...props} />;
    case 'More Filters':
      return <MoreFilters {...props} />;
    case 'Sort By':
      return <Sort {...props} />;
    case 'Rating':
      return <Rating {...props} />;
    case 'Services':
      return <Services {...props} />;
    default:
      return null;
  }
};

export default SearchFilter;
