import React, {useState,useEffect} from 'react';
import {View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import GS, {RText, normalizedFontSize} from '../../GlobeStyle';
import {connect} from 'react-redux';
import {setError} from '../Redux/Actions/appActions';

const ErrorMessageNotifier = ({error,setGlobalError}) => {

  useEffect(() => {
    if(error){
      setTimeout(()=>{
        setGlobalError(undefined);
      },5000)
    }
  },[error]);
  
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffcccc',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 25,
        display: error && error.message?'flex':'none'
      }}>
      <MIcon name="error-outline" color={GS.errorRed} size={18} />
      <RText
        style={{
          marginLeft: 10,
          color: GS.errorRed,
          fontSize: normalizedFontSize(7),
          paddingRight: 20,
        }}>
        {error?error.message:''}
      </RText>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.app.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGlobalError: (error) => dispatch(setError({message:error})),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorMessageNotifier);
