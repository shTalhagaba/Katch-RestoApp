/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

//3rd party
import ADIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

//others
import GS, {
  BoldText,
  RText,
  customFont,
  normalizedFontSize,
} from '../../GlobeStyle';
import CustomLoading from '../../components/Loading/More';
import { addresses } from '../../constants/staticText';
import AddressCard from '../../components/AddressCard';

const AddressList = (props) => {
  const { toggleModal, navigation, showModal } = props;

  const addressList = props.user.addresses;

  const renderAdressCard = ({ item }) => {
    return (
      <AddressCard
        address={item}
        isSelectable={true}
        closeModal={toggleModal}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ flexGrow: 1 }} onPress={toggleModal} />
      <View style={styles.innerContainer}>
        <View style={styles.modalHeader}>
          <BoldText
            fontName={customFont.axiformaMedium}
            style={styles.modalHeaderText}>
            Addresses
          </BoldText>

          <TouchableOpacity
            style={styles.modalHeaderCloseButton}
            onPress={toggleModal}>
            <ADIcon color="gray" name="close" size={25} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            showModal(false);
            navigation.navigate('Account', {
              screen: 'AddUserAddress',
              cameFrom: (args) => {
                showModal(true);
              },
            });
          }}
          style={styles.addAddressButton}>
          <EIcon name="plus" color={GS.secondaryColor} size={22} />
          <BoldText
            fontName={customFont.axiformaMedium}
            style={styles.addAddressText}>
            Add new address
          </BoldText>
        </TouchableOpacity>

        {addressList !== null ? (
          addressList.length > 0 ? (
            <FlatList
              bounces={false}
              data={addressList}
              renderItem={renderAdressCard}
              keyExtractor={({ _id }, index) => _id + index}
            />
          ) : (
            <EmptyAddress navigation={navigation} />
          )
        ) : (
          <Loading />
        )}
      </View>
    </View>
  );
};

const Loading = () => (
  <View style={styles.loadingContainer}>
    <CustomLoading iconSize="large" style={styles.loadingStyle} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000010',
  },
  innerContainer: {
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    flex: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: 'silver',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    marginTop: 10,
    fontSize: normalizedFontSize(9),
    color: GS.textColorGreyDark3,
    marginRight: 'auto',
  },
  modalHeaderCloseButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    marginHorizontal: 0,
  },
  addAddressText: {
    fontSize: normalizedFontSize(8),
    marginLeft: 10,
    marginTop: 5,
    marginHorizontal: 10,
    color: GS.secondaryColor,
  },
  noAddressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  noAddressText: {
    color: GS.secondaryColor,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: -5,
  },
  loadingStyle: {
    padding: 15,
    borderRadius: 10,
  },
});

const EmptyAddress = (props) => {
  const { navigation } = props;
  return (
    <View style={styles.noAddressContainer}>
      <RText fontName={customFont.axiformaBold} style={styles.noAddressText}>
        {addresses.noAddress}
      </RText>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AddressList);
