/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

//3rd party
import { useLazyQuery,useMutation } from '@apollo/client'
import { connect } from 'react-redux';
import EIcon from 'react-native-vector-icons/Entypo';

//others
import GS, { normalizedFontSize, RText, BoldText } from '../../GlobeStyle';
import {
  GET_USER_ADDRESS,
  DELETE_USER_ADDRESS,
} from '../../components/GraphQL';
import {
  hydrateUserAddresses,
  setSelectedAddress,
} from '../../components/Redux/Actions/userActions';
import Header from '../../components/AccountHeader';
import CustomLoading from '../../components/Loading/More';
import { animateLayout, deepClone } from '../../components/Helpers';
import AddressCard from '../../components/AddressCard';

const UserAddress = (props) => {
  const {
    navigation,
    setReduxAddresses,
    reduxAddresses,
    selectedAddress,
    setReduxSelectedAddress,
  } = props;

  // check if screen is focused
  const isFocused = useIsFocused();
  const [userAddressList, setUserAddressList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get Loggedin User Address
  const [getUserAddress, { loading: listLoading, refetch }] = useLazyQuery(
    GET_USER_ADDRESS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (query) => {
        setUserAddressList(query.getUserAddresses);
      },
    },
  );

  //Create new Address for loggedin user
  const [deleteUser] = useMutation(DELETE_USER_ADDRESS);
  const deleteAddress = async (id) => {
    try {
      await deleteUser({
        variables: {
          docId: id,
        },
      });

      setUserAddressList((state) =>
        deepClone(state).filter((address) => address._id !== id),
      );
      setReduxAddresses(reduxAddresses.filter((address) => address._id !== id));
      if (selectedAddress?._id === id) {
        setReduxSelectedAddress(null);
      }
    } catch {}
  };

  // Refresh addresses if focused changed
  useEffect(() => {
    if (userAddressList) {
      getUserAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const renderAdressCard = ({ item }) => {
    return (
      <AddressCard
        address={item}
        deleteAddress={deleteAddress}
        isEditMode={isEditMode}
        navigation={navigation}
      />
    );
  };

  const onEdit = () => {
    animateLayout();
    setIsEditMode(!isEditMode);
  };

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <View style={styles.headerInnerContainer}>
          <Header goBack={() => navigation.goBack()} title="My Addresses" />
        </View>

        {!listLoading && userAddressList.length > 0 && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <BoldText style={styles.editText}>
              {isEditMode ? 'DONE' : 'EDIT'}
            </BoldText>
          </TouchableOpacity>
        )}
      </View>

      {listLoading ? (
        <Loading />
      ) : (
        <Fragment>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddUserAddress')}
            style={styles.addAddressContainer}>
            <EIcon name="plus" color={GS.secondaryColor} size={25} />
            <RText style={styles.addAddressText}>Add new address</RText>
          </TouchableOpacity>
          {userAddressList.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
              style={styles.addressList}
              keyExtractor={({ _id }, index) => (_id ? _id : index)}
              data={userAddressList}
              renderItem={renderAdressCard}
            />
          ) : (
            <EmptyList />
          )}
        </Fragment>
      )}
    </SafeAreaView>
  );
};

const EmptyList = () => {
  return (
    <View style={styles.loadingContainer}>
      <BoldText>No Addresses</BoldText>
    </View>
  );
};

const Loading = () => (
  <View style={styles.loadingContainer}>
    <CustomLoading iconSize="large" style={styles.loadingStyle} />
  </View>
);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight,

    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  headerInnerContainer: {
    flexGrow: 1,
  },
  editButton: {
    marginRight: 10,
    padding: 10,
    alignSelf: 'center',
  },
  editText: {
    color: GS.secondaryColor,
    fontSize: normalizedFontSize(6),
  },
  addAddressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  addAddressText: {
    fontSize: normalizedFontSize(7),
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingStyle: {
    padding: 15,
    borderRadius: 10,
  },
  addressList: {
    marginTop: 20,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = (state) => {
  return {
    reduxAddresses: state.user.addresses,
    selectedAddress: state.user.selectedAddress,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setReduxAddresses: (addresses) => dispatch(hydrateUserAddresses(addresses)),
    setReduxSelectedAddress: (addresses) =>
      dispatch(setSelectedAddress(addresses)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAddress);
