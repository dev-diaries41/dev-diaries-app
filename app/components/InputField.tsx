import React from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { InputFieldProps } from '../constants/types';

const {width} = Dimensions.get('screen')
const screenWidth = width

const InputField = ({ 
  value, 
  onChangeText, 
  error, 
  placeholder, 
  secureTextEntry = false, 
  errorText, 
  color,
  multiline = false,
  height,
  label,
  width = screenWidth,
  maxHeight = 120,
  minHeight = 40,
  borderColor = themes.borderColor,
  borderBottomWidth,
  borderWidth,
  fontSize,
  paddingBottom,
  backgroundColor = 'transparent',
  textAlignVertical = 'top',

}: InputFieldProps) => {

  const inputStyle = [
    styles.input,
    { 
      color,
      maxHeight,
      borderColor,
      backgroundColor,
    },
    height && { height },
    width && { width },
    paddingBottom && { paddingBottom },
    fontSize && { fontSize },
    borderBottomWidth && { borderBottomWidth },
    borderWidth && { borderWidth },
    minHeight && { minHeight },
    error && styles.inputError,
  ];
  
  
  return (
    <View style={{height:"auto"}}>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
      {label && <Text style={[styles.label, {color}]}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[...inputStyle, {opacity: 0.8, marginLeft:'auto'}]}
        placeholderTextColor={color}        
        secureTextEntry={secureTextEntry}
        scrollEnabled
        textAlignVertical={textAlignVertical}
        multiline = {multiline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    input: {
      padding: sizes.layout.small,
      borderRadius: sizes.layout.medSmall,
      marginBottom:sizes.layout.xSmall,
      color:themes.light.text,
      maxWidth: "100%",
    },
    inputError: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: sizes.font.small,
      marginTop: sizes.layout.xSmall,
    },
    label:{
      fontSize: sizes.font.small,
      marginBottom: sizes.layout.xSmall, 
    }
  });  

export default InputField;
