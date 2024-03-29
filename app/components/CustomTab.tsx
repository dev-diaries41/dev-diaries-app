import { Keyboard, StyleSheet, View } from 'react-native'
import React from 'react'
import { sizes, themes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import {useSettingsContext } from '../context/settingsContext';


interface CustomTabProps {
    color: string;
    iconName: any
    routeName: string;
    iconSize?: number;
}

const CustomTabIcon = ({
    color, 
    iconName, 
    iconSize = 24
}:CustomTabProps) => {
    const {theme} = useSettingsContext()
    const darkTheme = theme === 'dark';
    
    const customizableLabelStyles = {color}

    return (
    <View style={[styles.wrapper, {backgroundColor:darkTheme? themes.dark.background:themes.light.background, top: Keyboard.isVisible()? 0: -20}]}>
      <View style = {styles.primaryLabelContainer}>
          <Ionicons name={iconName} size={iconSize} color={themes.dark.icon} style={styles.rotatedIcon}/>  
      </View>  
    </View>
   
    )
    }

export default CustomTabIcon;

const styles = StyleSheet.create({
container:{
    flex:1
},
primaryLabelContainer:{
    position: 'relative',
    top: -0,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height:50,
    backgroundColor: themes.dark.primary,
    elevation: 2,
    shadowColor: themes.light.text,
    shadowOffset: {
    width: 5,
    height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: sizes.layout.small,
},
 rotatedIcon: {
    // marginLeft:4,
    alignSelf:'center',
  },
  wrapper:{
    position: 'absolute',
    top: -20,
    width: 60,
    height:60,
    borderRadius: 30,
    backgroundColor: themes.dark.background,
    justifyContent:'center',
    alignItems: 'center',
  }
})