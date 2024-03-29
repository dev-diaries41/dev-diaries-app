import { StyleSheet } from 'react-native'
import React from 'react'
import { themes, sizes } from '../../../constants/layout';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';
import SignOutScreen from './SignOut';



const Stack = createStackNavigator()

const EmailAuthScreens = ({route}: any) => {
    const {hasPasscode} = route?.params || {};

    return (
    <Stack.Navigator
        initialRouteName={"Login"}
        screenOptions={{
        animationEnabled: true,
        }}
    >
        <Stack.Screen name="Login" component={LoginScreen} initialParams={{hasPasscode}} options={{ headerShown: false }} />
        <Stack.Screen name="Create Account" component={CreateAccountScreen} initialParams={{hasPasscode}} options={{ headerShown: false }} />
        <Stack.Screen name="Sign Out" component={SignOutScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
    );
    
    }

export default EmailAuthScreens;

const styles = StyleSheet.create({
    navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginRight: sizes.layout.medium,
        gap:sizes.layout.medium
      },
      tagContainer:{
        justifyContent:"flex-start",
        alignItems:'flex-start',
        maxHeight:50,
        borderColor: '#333',
        borderWidth:1,
        borderRadius: sizes.layout.medium,
        paddingHorizontal: sizes.layout.small,
        marginHorizontal: sizes.layout.medium,
        width:'auto'
      },
    logo:{
        resizeMode:'contain',
        width:40,
        height:40,
        borderRadius:20,
        marginLeft: sizes.layout.small,
    },
      
})