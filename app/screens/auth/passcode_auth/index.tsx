import { StyleSheet, useColorScheme, View, Image } from 'react-native'
import React, {useState} from 'react'
import { themes, sizes } from '../../../constants/layout';
import { createStackNavigator } from '@react-navigation/stack';
import PasscodeScreen from './PasscodeScreen';
import CreatePasscodeScreen from './CreatePasscodeScreen';
import ConfirmPasscodeScreen from './ConfirmPasscodeScreen';
import { TerminalPath } from '../../../components';

const Stack = createStackNavigator()

const PasscodeScreens = ({route}: any) => {
    const [theme, setTheme] = useState(useColorScheme())
    const {hasPasscode} = route?.params || {};
    
    return (
    <Stack.Navigator
        initialRouteName={hasPasscode? "Passcode" : "Create Passcode"}
        screenOptions={{
        animationEnabled: true,
        }}
    >
        <Stack.Screen name="Passcode" initialParams={{ theme }} component={PasscodeScreen} options={{
        headerShown: true,
        headerRight: () => (
            <View style={styles.tagContainer}>
            <TerminalPath
                onPress={() => { }}
                color={themes.dark.primary}
                fontSize={sizes.font.medium}
                icon={'chevron-down'}
                iconSize={18}
                buttonText={'/dev_diaries'}
                darkTheme={true}
            />
            </View>
        ),
        headerLeft: () => (
            <Image source={require('../../../../assets/ic_launcher.png')} style={styles.logo} />
        ),
        title: '',
        headerStyle: {
            backgroundColor: themes.dark.background,
        },
        headerTitleStyle: {
            fontSize: sizes.font.large,
            fontWeight: 'bold'
        },
        headerTintColor: themes.dark.text,
        headerShadowVisible: false,
        }} />
        <Stack.Screen name="Create Passcode" component={CreatePasscodeScreen} initialParams={{hasPasscode}} options={{ headerShown: false, headerTitle: '',
        headerTitleStyle: { color: themes.dark.text, fontSize: 18 }, headerTintColor: themes.dark.primary,
        headerStyle: { backgroundColor: themes.dark.background } }} />
        <Stack.Screen name="Confirm Passcode" component={ConfirmPasscodeScreen} options={{ headerShown: false, headerTitle: '',
        headerTitleStyle: { color: themes.dark.text, fontSize: 18 }, headerTintColor: themes.dark.primary,
        headerStyle: { backgroundColor: themes.dark.background } }} />
    </Stack.Navigator>
    );
    
    }

export default PasscodeScreens;

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