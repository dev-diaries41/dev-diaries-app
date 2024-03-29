import { StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react'
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/SettingsContext';
import { Button, Spacer, TextButton } from '../../components';


const ForgotPassword = ({navigation}: any) => {

  //Screen constants
  const { theme} = useSettingsContext();
  const isDark = theme === "dark";
  
  //State variables
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)


   //Function to navigate to login screen 
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  

  //Function to submit request to reset password
  const handleSubmit =  () => {
   navigation.navigate('Login')
  };


  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor:isDark? themes.dark.backgroundColor : themes.light.backgroundColor}]}      
    >
    <Text style={[styles.HeaderText, {color:isDark? themes.dark.textColor : themes.light.textColor}]}>Forgot Password</Text>
      <Spacer/>
      <View style={styles.inputContainer}>
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={text => setEmail(text.trim())}
        style={[styles.input, {color:isDark? themes.dark.textColor : themes.light.textColor}]}        
        placeholderTextColor= {themes.placeholder}
        autoCapitalize='none'
      />
       <Button
        text={'Reset Password'}
        width='100%'
        onPress={handleSubmit}
        backgroundColor= {themes.light.primaryColor}
        loading={loading}
       />
      </View>

     
      <View style={styles.ForgotContainer}>
        <Text style={[styles.LoginText, {color:isDark? themes.dark.textColor : themes.light.textColor}]}>Already have an account?</Text>
        <TextButton
          onPress={handleLogin}
          buttonText={'Login'}
          color={themes.light.primaryColor}
          margin={0}
        />
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:16

  },
  inputContainer: {
    width: '100%',
    backgroundColor:"transparent",
    gap:10
  },
  input: {
    backgroundColor: 'transparent',
    padding:sizes.layout.small,
    borderRadius: sizes.layout.medSmall,
    borderColor:themes.light.borderColor,
    borderWidth:1,
    color:themes.dark.textColor,
    fontFamily:'monserrat-regular'  

  },

  ForgotContainer: {
    flexDirection: 'row',
    marginTop: sizes.layout.medium,
    alignItems: 'center',
  },
  LoginText: {
    marginRight: sizes.layout.xSmall,
    fontSize: sizes.font.medium,
    color: themes.light.textColor,
    fontFamily:'monserrat-regular'  
  },
  HeaderText:{
    fontSize :sizes.font.xLarge,
    color: themes.light.textColor,
    marginBottom:sizes.layout.medium,
    fontFamily: 'monserrat-bold'
  }
  
});

export default ForgotPassword;
