import { View, SafeAreaView, ScrollView, StyleSheet, StatusBar, Appearance, useColorScheme } from 'react-native';
import React, {useLayoutEffect } from 'react';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/SettingsContext';
import { SettingsCard } from '../../components';
import { saveSettings } from '../../lib/storage';
import { setTabLayout } from '../../lib/layout';
import { Theme } from '../../constants/types';


const Settings = ({navigation, route}: any) => {
  const {hasPasscode} = route?.params || {};
  const {enablePasscode, setEnablePasscode, theme, setTheme} = useSettingsContext();
   const DARK_THEME = 'dark';
   const LIGHT_THEME = 'light';
   const darkTheme = theme === DARK_THEME;

  useLayoutEffect(() => {
      setTabLayout(darkTheme, navigation)
  }, [theme])


  const chooseTheme = (theme: Theme) => {
    try {
      setTheme(theme);
      Appearance.setColorScheme(theme)
      saveSettings({theme})
    } 
    catch(error: any){
      console.log("Error Choosing theme:", error.message)
    }
  }

  const toggleTheme = () => darkTheme? chooseTheme(LIGHT_THEME) : chooseTheme(DARK_THEME)


  const handleUpdateAccountSettings = () => {
  }

  const handleUpdatePassword = () => {
    navigation.navigate('Passcode Auth', {screen: 'Passcode', params: {updatingPasscode: true}});    
  }

  const handleUpdateCreateSettings = () => {
    navigation.navigate("Update Settings", {updatingCreateSettings: true});
  }

  const toggleEnablePasscode = async() => {
    if(!hasPasscode && !enablePasscode){
      return navigation.navigate('Passcode Auth', {screen: 'Create Passcode'});    

    }
    if(hasPasscode && enablePasscode){
      return navigation.navigate('Passcode Auth', {screen: 'Passcode', params: {disablingPasscode: true}});    
    }
    setEnablePasscode(!enablePasscode)
    await saveSettings({enablePasscode: enablePasscode? false: true})
  }

  const handleSignOut = () => {
    navigation.navigate('Auth', {screen: 'Sign Out'});
  }
  
  
  // Define the settings configuration array
const settingsConfig = [
  {
    onPress: handleUpdateAccountSettings,
    settingTitle: 'Account',
    settingDescription: 'Email',
  },
  {
    onPress: handleUpdateCreateSettings,
    settingTitle: 'Create',
    settingDescription: 'Telegram channel Id ⦁ discord webhook ⦁ quote post ⦁ image',
  },
  {
    onPress: toggleEnablePasscode,
    settingTitle: 'Enable Passcode',
    value: enablePasscode,
    isSwitch: true,
  },
  {
    onPress: handleUpdatePassword,
    settingTitle: 'Change passcode',
  },
  {
    onPress: toggleTheme,
    settingTitle: 'Dark Theme',
    value: darkTheme,
    isSwitch: true,
  },
];


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkTheme ? themes.dark.background : themes.light.background }]}>
      <StatusBar backgroundColor="transparent" barStyle={darkTheme? "light-content" : "dark-content"} translucent />
      <View style={styles.contentContainer}>
        <ScrollView style={[styles.settingsContainer, { backgroundColor: darkTheme ? themes.dark.background : themes.light.background }]}>
          {settingsConfig.map((setting, index) => (
            <SettingsCard
              key={index}
              onPress={setting.onPress}
              dark={darkTheme}
              settingDescription={setting.settingDescription}
              settingTitle={setting.settingTitle}
              value={setting.value}
              isSwitch={setting.isSwitch}
            />
          ))}
        </ScrollView>
        {/* <SettingsCard
              onPress={handleSignOut}
              dark={darkTheme}
              settingTitle={'Sign Out'}
            /> */}
      </View>
    </SafeAreaView>
  );
};


 const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.layout.small,
  },
  settingsContainer: {
    borderColor: '#E4E4E4',
    backgroundColor: '#f1f1f1',
    borderRadius: sizes.layout.medium,
    width:"100%",
    marginTop: sizes.layout.medium,
  },
});

export default Settings;


