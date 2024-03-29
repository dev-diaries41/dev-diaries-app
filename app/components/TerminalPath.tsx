import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import { sizes, themes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { TextWithIconButtonProps } from '../constants/types';

interface TerminalPathProps extends TextWithIconButtonProps {
    darkTheme: boolean
}

const TerminalPath = ({ 
    onPress, 
    buttonText, 
    fontSize = sizes.font.medium, 
    margin = sizes.layout.small,
    textAlign = 'right',
    iconSize=18,
    color = themes.dark.icon,
    darkTheme = true
}: TerminalPathProps) => {
    const customizableStyles = {fontSize, color, textAlign}
    return (
        <TouchableOpacity onPress={onPress} style={{flexDirection: 'row', alignItems:'center', marginVertical: margin, marginHorizontal: margin/2}}>
            <Ionicons name={'chevron-down'} size ={iconSize} color={darkTheme? themes.dark.text : themes.light.text} style={{marginRight:sizes.layout.xSmall}}/>
            <Text style={[styles.buttonText, customizableStyles]}>{buttonText}</Text>
            <Text style={[styles.dollarText, {fontSize, color: darkTheme? themes.dark.text : themes.light.text, marginEnd: sizes.layout.xSmall}]}>{' $'}</Text>
            <View style={[styles.terminalIndicator, {borderColor: darkTheme? themes.dark.icon : themes.light.icon, width: (iconSize)/2, height:iconSize}]}></View> 
        </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    buttonText: {
         
      },
      dollarText: {
        fontWeight:'500', 
        opacity:0.8
      },
      terminalIndicator:{
        marginLeft: sizes.layout.xSmall,
        borderWidth:2,
        opacity:0.8,
        backgroundColor:'#fff'
      } 
  })
  export default TerminalPath