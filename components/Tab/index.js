import React, { useState, useEffect, } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabContent from './TabContent';
import { Keyboard } from "react-native";

const {Navigator, Screen} = createBottomTabNavigator();

const TabScreen = Screen;

export default props => {

  const [keyBoardStatus, isBoardStatus] = useState(false);
  useEffect(() => {
    const _keyboardDidShow = () => {
      isBoardStatus(true)
    };
  
    const _keyboardDidHide = () => {
      isBoardStatus(false)
    };
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);



    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    }
  })

  


  return (
    <Navigator  
      {...props}
      tabBarOptions={{keyboardHidesTabBar:true}}
      tabBar={(props) =>  keyBoardStatus ? null: <TabContent {...props}/>}>
      {props.children}
    </Navigator>
  );
};

export {TabScreen};
