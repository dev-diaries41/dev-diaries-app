import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { SettingsCardProps } from '../constants/types';

const SettingsCard = ({
  onPress, 
  dark, 
  settingDescription, 
  settingTitle, 
  isSwitch = false, 
  value,
  disabled = false
}: SettingsCardProps) => {

  const getIcon = () => {
    switch(settingTitle){
      case 'Image':
        return 'image'
      case 'Create':
        return 'add-circle'
      case 'Wallet':
        return 'wallet'
      case 'Account':
        return 'person'
      case 'Enable Passcode':
        return 'lock-closed'
      case 'Change passcode':
        return 'keypad'
      case 'Dark Theme':
        return 'contrast'
    }
  }
    return( 
        <View>
          <TouchableOpacity style={{flexDirection: "column"}} onPress={onPress} disabled={disabled}>
            <View style={styles.settingsRow}>
              <View style={{flexDirection:'row', gap: sizes.layout.small, alignItems:'center'}}>
              <Ionicons name={getIcon()} color={dark ? themes.dark.icon : themes.light.icon} size={24} />
              <Text style={[styles.settingTitle, {color: dark ? themes.dark.text : themes.light.text}]}>{settingTitle}</Text>
              </View>
              {isSwitch ? (
                <Switch
                  value={value}
                  onValueChange={onPress}
                  thumbColor={themes.colors.green}
                />
              ) : (
                <Ionicons name="chevron-forward-circle" style={{justifyContent: "flex-end"}} color={dark ? themes.dark.icon : themes.light.icon} size={24} />
              )}     
            </View>
        {settingDescription && <Text style={[styles.settingValue, {color: dark ? themes.dark.text : themes.light.text, opacity:0.7}]}>{settingDescription}</Text>}          
      </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  settingsRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: sizes.layout.medium,
    paddingVertical: sizes.layout.small
  },
  settingTitle:{
    fontSize: sizes.font.medium,
    fontWeight:'500',
  },
  settingValue:{
    fontSize: sizes.font.small,
    paddingHorizontal: sizes.layout.medium,
    paddingBottom: sizes.layout.medium,
    
  },
});

export default SettingsCard;
