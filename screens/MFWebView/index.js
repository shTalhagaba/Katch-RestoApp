import React from 'react';
import {View, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native';

//3rd party
import {MFWebView} from 'myfatoorah-reactnative';

//others
import Header from '../../components/AccountHeader';
import {connect} from 'react-redux';

const MyMFWebView = (props) => {
  const {navigation, isCartEmpty, ...rest} = props;
  const { goBack , ...restNavigation } = navigation;

  if(isCartEmpty){
    navigation.navigate('Cart');
    return null
  }
  
  return (
    <SafeAreaView style={{flex: 1,paddingTop:StatusBar.currentHeight}}>
      <View style={{flex: 1}}>
        <Header title="Payment Gateway" goBack={() => navigation.goBack()}/>
        <MFWebView 
          {...rest} 
          navigation={{
            goBack: () => navigation.navigate('Checkout'),
            ...restNavigation,
          }}/>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    isCartEmpty: state.cart.addedItems.length < 1,
  };
};

export default connect(mapStateToProps, null)(MyMFWebView);