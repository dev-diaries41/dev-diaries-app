import "react-native-get-random-values"
import { StyleSheet, View, SafeAreaView, Dimensions, StatusBar, Image, Text} from 'react-native'
import React, {useLayoutEffect, useState} from 'react'
import { themes, sizes } from '../../constants/layout'
import {Button } from '../../components';
import { useSettingsContext } from '../../context/SettingsContext';
import { AnimatedImage } from '../../components';
import { setTabLayout } from '../../lib/layout';

const {height} = Dimensions.get('screen');


const OnboardingScreen = ({navigation}: any) => {
    const {theme} = useSettingsContext()
    const [loading, setLoading] = useState(false);
    const darkTheme = theme === 'dark'

    useLayoutEffect(() => {
      setTabLayout(darkTheme, navigation)
   }, [theme])
   
   const handleOnboarding = () => {
    navigation.replace('Create Passcode')
   }
   
  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: darkTheme? themes.dark.background : themes.light.background}]}>
        <StatusBar backgroundColor="transparent" barStyle={darkTheme? "light-content" : "dark-content"} translucent />
        <Image
        source={require('../../../assets/bg2.png')}
        style={[StyleSheet.absoluteFillObject, {resizeMode:'cover', height: height}]}
        blurRadius={20}
        />
        <View style={{flex:1, height:"100%", width:"100%", justifyContent:'center'}}>
          <AnimatedImage/>
          <View style={{marginTop: 16, width:"100%", alignItems:'center', gap:8}}>
            <Text style={styles.label}>Welcome to FPF Hub!</Text>
            <View style={styles.buttonContainer}>
              <Button
                text = {'Continue'}
                // icon={'wallet'}
                onPress={handleOnboarding}
                loading={loading}
                color={themes.dark.text}
                backgroundColor={darkTheme? themes.dark.primary: themes.light.primary}
              />
            </View>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: sizes.layout.small,
        alignItems: 'center',
        justifyContent:'center'
    },
    buttonContainer:{
        marginTop: 'auto',
        width: "100%"
    },
    navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginRight: sizes.layout.medium,
        gap:sizes.layout.medium
      },
      label: {
        fontSize: sizes.font.medium,
        color: themes.dark.text,
        marginVertical:sizes.layout.xSmall,
        
      },
})