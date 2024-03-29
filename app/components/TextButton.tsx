import { TouchableOpacity, Text, StyleSheet, TextStyle } from 'react-native';
import { sizes, themes } from '../constants/layout';
import { TextButtonProps } from '../constants/types';


const TextButton = ({ 
    onPress, 
    buttonText, 
    fontSize = sizes.font.medium, 
    color = themes.dark.text, 
    margin = sizes.layout.small,
    textAlign = 'left',
}: TextButtonProps) => {
    const customizableStyles = { fontSize, color, margin, textAlign };

    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.buttonText, customizableStyles ]}>{buttonText}</Text>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  buttonText: {
  },
});

export default TextButton;
