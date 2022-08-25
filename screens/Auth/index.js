import React,{useState,useEffect} from 'react';
import Login from './Login';
import SignUpNav from '../../Navigation/SignUpNav';
import Reset from './Reset';
import {Account} from '../../Navigation';

const Auth = ({navigation,route}) => {

  const [screen,setScreen] = useState(route.params?.screen ? route.params.screen : '');

  useEffect(() => {
    return ()=> navigation.setParams({screen:null, cameFrom: null })
  },[route.params]);

  switch(screen){
    case 'Login':
      return <Login routeParams={route.params} navigation={navigation} setScreen={setScreen}/>
    case 'SignUp':
      return  <SignUpNav routeParams={route.params} tabNavigation={navigation} setScreen={setScreen}/>
    case 'Reset':
      return  <Reset setScreen={setScreen}/>
    default:
      return <Account routeParams={route.params} navigation={navigation} setScreen={setScreen}/>
  }
};

export default Auth;