import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, TouchableOpacity, Text, View , StyleSheet} from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { ButtonProps, GradientButtonProps } from '../constants/types';

 export const GradientButton  = ({ 
  loading, 
  disabled, 
  onPress, 
  text, 
  gradientColor = themes.dark.primaryGradient, 
  width = '100%', 
  height = 50, 
  icon, 
  fontSize = sizes.font.medium,
  borderColor,
  borderWidth,
  iconSize=24,
  color = themes.light.text,
  }: GradientButtonProps) => {
    const customizableButtonStyles =  { width, height, borderColor, borderWidth}
      const customizableButtonTextStyles = {fontSize, color}
    return (
      <LinearGradient colors={gradientColor} style={[styles.button, customizableButtonStyles]}>
        <TouchableOpacity style={[disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View style={styles.rowContainer}>
            {text && <Text style={[styles.buttonText, customizableButtonTextStyles]}>{text}</Text>}
            {icon && <Ionicons name={icon} size={iconSize} color={color} styles={styles.rotatedIcon} />}
          </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };


  export const Button = ({ 
    loading, 
    disabled, 
    onPress, 
    text, 
    backgroundColor = themes.dark.primary, 
    width = '100%', 
    height = 50, 
    icon, 
    fontSize = sizes.font.medium,
    borderColor,
    borderWidth,
    color = themes.dark.text,
    iconSize = 24,
    transformIcon
  }:ButtonProps) => {
    const customizableButtonStyles = { backgroundColor, width, height, borderColor, borderWidth };
    const customizableButtonTextStyles = { fontSize, color };
  
    return (
    <TouchableOpacity
        style={[
          styles.button,
          customizableButtonStyles,
          disabled && { opacity: 0.5 }, // Apply opacity directly to TouchableOpacity
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View style={styles.rowContainer}>
            {text && <Text style={[styles.buttonText, customizableButtonTextStyles]}>{text}</Text>}
            {icon && <Ionicons name={icon} size={iconSize} color={color} styles={styles.rotatedIcon} />}
          </View>
        )}
      </TouchableOpacity>
     
    );
  };
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: themes.dark.primary,
      borderRadius: sizes.layout.large,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center",
      marginHorizontal: sizes.layout.small,
      elevation: 2,
      shadowColor: themes.light.text,
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: sizes.layout.small,
      padding: sizes.layout.small,
    },
    buttonText: {
      color: themes.dark.text,
      fontWeight:'bold',
      marginHorizontal: sizes.layout.xSmall

    },
    icon: {
      marginRight: sizes.layout.xSmall,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: sizes.layout.xSmall
    },
    columnContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'center',      
    },
    columnButtonText: {
      color: themes.dark.text,
      fontWeight:'bold',
      marginTop:sizes.layout.xSmall,
    },
    rotatedIcon: {
      transform: [{ rotate: '-30deg' }], 
    },
  });
  