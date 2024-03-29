import React, {useLayoutEffect} from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from './SettingsScreen';
import { themes, sizes } from '../../constants/layout';
import UpdateSettingsScreen from './UpdateSettingsScreen';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';

// Define a stack navigator for the Settings screen and its related screens
const SettingsStack = createStackNavigator();


// Component for the screens related to settings
export default function SettingsStackScreen({navigation}: any) {
  // useLayoutEffect(()=>{
  //   navigation.setOptions({
  //     tabBarStyle:{display:'none'
  //     },
  //     tabBarActiveTintColor: themes.colors.darkWhite,
  //     tabBarInactiveTintColor: themes.placeholder,
  //   });
  // }, [navigation] )

    return (
      <NavigationContainer independent={true}theme={DarkTheme}>
      <SettingsStack.Navigator initialRouteName="Settings Home" screenOptions={{
        animationEnabled: true,
      }}
    >
        <SettingsStack.Screen name="Settings Home" component={SettingsScreen} options={{ headerShown: false, }} />
        <SettingsStack.Screen name="Update Settings" component={UpdateSettingsScreen} options={{ headerShown: false }} />
      </SettingsStack.Navigator>
      </NavigationContainer>
    );
  }
  