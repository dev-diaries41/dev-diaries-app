import { Image, StyleSheet, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { themes, sizes } from '../../constants/layout';
import { createStackNavigator } from '@react-navigation/stack';
import CreateScreen from './CreateScreen';
import CreateImageScreen from './CreateImageScreen';
import ViewMedia from './ViewMedia';
import { IconButton, TerminalPath } from '../../components';
import { useSettingsContext } from '../../context/SettingsContext';
import { hideTabBar, setTabLayout } from '../../lib/layout';
import { useTabLayout } from '../../context/TabLayoutContext';



const CreateStack = createStackNavigator()

const CreateScreens = ({navigation, route}: any) => {
    const {theme} = useSettingsContext();
    const {shouldHideTabBar} = useTabLayout(navigation);
    const darkTheme = theme === 'dark';

   // Hnadle UI changes when the component mounts
   useLayoutEffect(() => {
    if(shouldHideTabBar){
      hideTabBar(navigation)
    }else{
      setTabLayout(darkTheme, navigation)
    }
 }, [theme, shouldHideTabBar])

    return (
    <CreateStack.Navigator
        initialRouteName={"Create Home"}
        screenOptions={{
        animationEnabled: true,
        }}
    >
        <CreateStack.Screen name="Create Home" component={CreateScreen} options={{
            headerShown:true,
            headerTitle:'',
            headerLeft: () => (
                <Image source={require('../../../assets/ic_launcher.png')} width={40} height={40} style={styles.logo} />
            ),    
            headerRight: () => (
              <View style={styles.navRowButtons}>
                <View style = {styles.tagContainer}>
                <TerminalPath
                  onPress={()=>{}}
                  color={darkTheme? themes.dark.primary: themes.light.primary}
                  fontSize={sizes.font.medium}
                  icon={'chevron-down'}
                  iconSize={18}
                  buttonText={'/dev_diaries'}
                  darkTheme={darkTheme}
                />        
                </View>
                <IconButton icon={"search"} onPress={() => {}} color={darkTheme ? themes.dark.icon : themes.light.icon}/>
            </View>
             ),
    
            headerStyle:{
              backgroundColor:darkTheme? themes.dark.background:themes.light.background
            },
            headerTintColor:darkTheme? themes.dark.text:themes.light.text,
            headerShadowVisible: false,
            }}/>
        <CreateStack.Screen name="Create Image" component={CreateImageScreen} options={{
            headerShown: false,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: 'Create Image'
            }} />
        <CreateStack.Screen name="View Media" component={ViewMedia} options={{
            headerShown: false,
            headerShadowVisible: false,
            headerTitle: ''
            }} />
    </CreateStack.Navigator>
    );
    
    }

export default CreateScreens;

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