import {TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../constants/layout';
import { IconButtonProps } from '../constants/types';

const IconButton = ({ onPress, onLongPress, color=themes.dark.icon, icon, size = 24, opacity = 1 }:IconButtonProps) => {
    return (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={{opacity}}>
        <Ionicons name={icon} size={size} color={color} />
      </TouchableOpacity>
    );
  };


  export default IconButton;