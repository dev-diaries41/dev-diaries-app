import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import { sizes, themes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { TextWithIconButtonProps } from '../constants/types';

const TextWithIconButton = ({ 
    onPress,
    onLongPress, 
    buttonText, 
    fontSize = sizes.font.medium, 
    margin = sizes.layout.small,
    textAlign = 'right',
    icon,
    iconSize=24,
    color = themes.dark.icon,
    justifyContent='flex-end',
    reverse = false,
    iconColor
}: TextWithIconButtonProps) => {
    const customizableStyles = {fontSize, color, margin, textAlign}
    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}
        style={{flexDirection: reverse? 'row-reverse':'row', alignItems:'center', justifyContent}}>
            { icon && <Ionicons name={icon} size ={iconSize} color={iconColor? iconColor:color}/>}
            <Text style={[styles.buttonText, customizableStyles]}>{buttonText}</Text>
        </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    buttonText: {
         
      }
  })
  export default TextWithIconButton;