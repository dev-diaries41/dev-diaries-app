import { themes, sizes } from "../constants/layout";
import React from 'react';
import { View } from 'react-native';
import { IconButton } from "../components";

export const setTabLayout = (darkTheme: boolean, navigation:any) => 
navigation.setOptions({
    tabBarStyle:{
      backgroundColor: darkTheme? themes.dark.card: themes.light.card,
      borderColor: darkTheme? themes.dark.card: themes.light.card,
      borderWidth:1,
      height:60,
      position:'absolute',
      bottom:0,
      paddingBottom: sizes.layout.small,
      elevation: 5,
      shadowColor: themes.light.text,
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: sizes.layout.small,

    },
    tabBarActiveTintColor: darkTheme? themes.dark.primary: themes.light.primary,
    // tabBarInactiveTintColor: themes.placeholder,
  });

  export const hideTabBar = (navigation: any) =>{
    navigation.setOptions({
        tabBarStyle:{display:'none'
        },
        tabBarActiveTintColor: themes.colors.darkWhite,
        tabBarInactiveTintColor: themes.placeholder,
      });
  }

  


