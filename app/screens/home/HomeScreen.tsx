import { Image, StyleSheet, Text, View } from 'react-native'
import React, {useLayoutEffect} from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../../constants/layout';
import {CustomTabIcon, IconButton, TerminalPath } from '../../components';
import Settings from '../settings/SettingsScreen';
import { useSettingsContext } from '../../context/SettingsContext';
import { setTabLayout } from '../../lib/layout';
import MyNotesScreen from '../notes/MyNotesScreen';
import { SearchProvider } from '../../context/SearchContext';
import CreateScreens from '../create';
import { TabLayoutProider } from '../../context/TabLayoutContext';
import { ImageGenProvider } from '../../context/ImageContext';

const Tab = createBottomTabNavigator();
const ICON_SIZE = 24

const TabScreens = ({route, navigation}: any) => {
  const {theme} = useSettingsContext();
  const darkTheme = theme === 'dark'
  const {hasPasscode} = route?.params || {};

  useLayoutEffect(() => {
    setTabLayout(darkTheme, navigation)
  }, [theme, navigation])

    return (
      <TabLayoutProider>
        <ImageGenProvider>
        <SearchProvider>
            <Tab.Navigator
              initialRouteName='Create'
              screenOptions={({ route, navigation }) => ({
                tabBarHideOnKeyboard: true,
                headerLeft: () => (
                    <Image source={require('../../../assets/ic_launcher.png')} width={40} height={40} style={styles.logo} />
                ),            
                tabBarIcon: ({ focused, color }) => {
                  let iconName: any = '';
        
                  if (route.name === 'Create') {
                    iconName = focused
                      ? 'add'
                      : 'add-outline';
                  } else if (route.name === 'Web3') { 
                    iconName = focused ? 'git-network' : 'git-network-outline';
                  }
                  else if (route.name === 'Notes') {
                    iconName = focused ? 'document': 'document-outline';
                  }else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }
                  
                  return route.name === 'Create'? 
                  <CustomTabIcon iconName={iconName} color={color} routeName={route.name}/> 
                  :
                  <Ionicons name={iconName} size={ICON_SIZE} color={color} />;    
                },
                tabBarLabel: ({ focused, color }) => {
                  let label;
        
                  if (route.name === 'Notes') {
                    label = 'Notes';
                  } else if (route.name === 'Create') { 
                    label = '';
                  }
                  else if (route.name === 'Settings') {
                    label = 'Settings'; 
                  }
        
                  return <Text style={{ color, fontSize: sizes.font.small }}>{label}</Text>;
                },
                tabBarStyle:{
                  backgroundColor: themes.dark.card,
                  borderBottomRightRadius:16,
                  borderBottomLeftRadius:16,
                  borderColor: themes.dark.card,
                  borderWidth:1,
                  height:70,
                  position:'absolute',
                  bottom:10,
                  elevation: 5,
                  shadowColor: themes.light.text,
                  shadowOffset: {
                    width: 5,
                    height: 10,
                  },
                  shadowOpacity: 1,
                  shadowRadius: sizes.layout.small,
                  paddingBottom:  sizes.layout.small,
                  paddingHorizontal:32
                },
                tabBarActiveTintColor: themes.colors.darkWhite,
                tabBarInactiveTintColor: themes.placeholder,
              })}
            >
              <Tab.Screen name="Notes" component={MyNotesScreen}  options={{
                headerShown:true,
                headerRight: () => (
                  <View style={styles.navRowButtons}>
                    <TerminalPath
                      onPress={()=>{}}
                      color={darkTheme? themes.dark.text: themes.light.text}
                      fontSize={sizes.font.medium}
                      icon={'chevron-down'}
                      iconSize={18}
                      buttonText={'/dev_diaries'}
                      darkTheme={darkTheme}
                      />        
                      <IconButton icon={"search"} onPress={() => console.log('Search')} color={darkTheme ? themes.dark.icon : themes.light.icon}/>
                  </View>
                ),
                title:'Notes',
              
                headerStyle:{
                  backgroundColor:darkTheme? themes.dark.background:themes.light.background,
                },
                headerTitleStyle:{
                  fontSize:sizes.font.large,
                  fontWeight:'bold'
                },
                headerTintColor:darkTheme? themes.dark.text:themes.light.text,
                headerShadowVisible: false,
                }}/>
      
              <Tab.Screen name="Create" component={CreateScreens} options={{headerShown:false}}/>
              <Tab.Screen name="Settings" component={Settings} initialParams={{hasPasscode}} options={{
                headerShown:true,
                headerTitleStyle:{
                  fontSize:sizes.font.large,
                  fontWeight:'bold'
                },
                headerStyle:{
                  backgroundColor:darkTheme? themes.dark.background:themes.light.background
                },
                headerTintColor:darkTheme? themes.dark.text:themes.light.text,
                headerShadowVisible: false,
                }}/>
        
            </Tab.Navigator>
          </SearchProvider>
          </ImageGenProvider>
        </TabLayoutProider>
      );
    }

export default TabScreens;

const styles = StyleSheet.create({
    navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginHorizontal: sizes.layout.medium,
        gap:sizes.layout.medium
      },
      logo:{
          resizeMode:'contain',
          width:40,
          height:40,
          borderRadius:20,
          marginLeft: sizes.layout.small,
      },
      tagContainer:{
        justifyContent:"flex-start",
        alignItems:'flex-start',
        maxHeight:50,
        borderColor: '#333',
        borderWidth:1,
        borderRadius: sizes.layout.medium,
        paddingHorizontal: sizes.layout.small,
        width:'auto'
      },
})