import { View , StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { themes, sizes } from '../constants/layout';
import { PickerProps } from '../constants/types';


const CustomPicker = ({ 
  selectedValue, 
  onValueChange, 
  options,
  borderRadius=sizes.layout.medium,
  borderColor=themes.borderColor,
  dropdownIconRippleColor = themes.light.primary,
  dropdownIconColor = themes.light.icon,
  label = 'Select option', 
  textColor = themes.light.text,
}: PickerProps) => {
  const customizablePickerWrapperStyles = {
    borderRadius,
    borderColor,
  }
  const customizablePickerTextStyles={
    color:textColor,

  }
  const pickerItems = [];
  pickerItems.push(<Picker.Item key="" label={label} value="" />);

  options?.forEach((option, index) => {
    pickerItems.push(
      <Picker.Item
        key={index}
        label={option}
        value={option}
        style={[pickerStyles.pickerText, customizablePickerTextStyles]}
      />
    );
  });

  return (
    <View style={[pickerStyles.pickerWrapper, customizablePickerWrapperStyles]}>
      <Picker
        style={[pickerStyles.picker, customizablePickerTextStyles]}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        dropdownIconRippleColor={dropdownIconRippleColor}
        dropdownIconColor={dropdownIconColor}
      >
        {pickerItems}
      </Picker>
    </View>
  );
};

const pickerStyles = StyleSheet.create({
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    color:themes.dark.text,
  },
  pickerText:{
    fontSize:sizes.font.medium,
    fontFamily:'monseratt-family'
  },
  pickerWrapper:{
    borderRadius:sizes.layout.medium,
    backgroundColor:'transparent',
    marginBottom:sizes.layout.small,
    borderColor:themes.borderColor,
    borderWidth:1
  }
});


export default CustomPicker;