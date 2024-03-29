import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, TouchableOpacity, Text, View , StyleSheet, DimensionValue} from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { ButtonProps, GradientButtonProps } from '../constants/types';


  export const ColumnButton = ({ 
    loading, 
    disabled, 
    onPress, 
    text, 
    backgroundColor = 'transparent', 
    width = '100%', 
    height = 50, 
    icon, 
    fontSize = sizes.font.small,
    borderColor,
    borderWidth,
    color = themes.dark.text,
  }:ButtonProps) => {
    const customizableButtonStyles = { backgroundColor, width, height, borderColor, borderWidth };
    const customizableButtonTextStyles = {fontSize, color: color}
  
    return (
    <View style={styles.columnContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          customizableButtonStyles,
          disabled && { opacity: 0.5 },
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View style={styles.columnContainer}>
            {icon && <Ionicons name={icon} size={24} color={color} />}
          </View>
        )}
      </TouchableOpacity>
      {text && <Text style={[styles.columnButtonText, customizableButtonTextStyles]}>{text}</Text>}

      </View>
    );
  };

  export const GradientColumnButton  = ({ 
    loading, 
    disabled, 
    onPress, 
    text, 
    gradientColor = themes.dark.primaryGradient, 
    width = '100%', 
    height = 50, 
    icon, 
    fontSize = sizes.font.small,
    borderColor,
    borderWidth,
    color = themes.light.text,
    }: GradientButtonProps) => {
      const customizableButtonStyles =  { width, height, borderColor, borderWidth}
        const customizableButtonTextStyles = {fontSize, color: color === themes.dark.text? themes.dark.primary : themes.light.primary}
      return (
        <View style={styles.columnContainer}>
        <LinearGradient colors={gradientColor} style={[styles.button, customizableButtonStyles]}>
          <TouchableOpacity style={[disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <View style={styles.columnContainer}>
              {icon && <Ionicons name={icon} size={24} color={color} />}
            </View>
            )}
          </TouchableOpacity>
        </LinearGradient>
        {text && <Text style={[styles.columnButtonText, customizableButtonTextStyles]}>{text}</Text>}
        </View>
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
      elevation: 3,
      shadowColor: themes.light.text,
      // iOS
      shadowOffset: {
        width: 50,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: sizes.layout.small,
    },
    icon: {
      marginRight: sizes.layout.xSmall,
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
  });
  