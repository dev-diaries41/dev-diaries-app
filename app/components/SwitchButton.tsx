import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { SettingsCardProps } from '../constants/types';

interface SwitchButtonProps {
    onPress: () => Promise<void> | void; 
    dark: boolean, 
    description?: string; 
    buttonText: string; 
    value?: boolean;
    disabled?: boolean;
}

const SwitchButton = ({
  onPress, 
  dark, 
  description, 
  buttonText, 
  value,
  disabled = false
}: SwitchButtonProps) => {

    return( 
        <View>
          <TouchableOpacity style={{flexDirection: "column"}} onPress={onPress} disabled={disabled}>
            <View style={styles.swtichRow}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={[styles.buttonText, {color: dark ? themes.dark.text : themes.light.text}]}>{buttonText}</Text>
                </View>
                <Switch
                    value={value}
                    onValueChange={onPress}
                    thumbColor={themes.colors.green}
                /> 
            </View>
            {(description && !value)&&<Text style={[styles.description, {color: dark ? themes.dark.text : themes.light.text, opacity:0.7}]}>{description}</Text>}          
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  swtichRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: sizes.layout.medium,
    paddingVertical: sizes.layout.xSmall
  },
  buttonText:{
    fontSize: sizes.font.medium,
    fontWeight:'500',
  },
  description:{
    fontSize: sizes.font.small,
    paddingHorizontal: sizes.layout.small,
    paddingBottom: sizes.layout.small,
    
  },
});

export default SwitchButton;
