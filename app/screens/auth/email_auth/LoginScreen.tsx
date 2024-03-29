import {StyleSheet, Text, View, ScrollView, AppState, Alert } from 'react-native';
import React, { useState} from 'react'
import { Button, Spacer, InputField, TextButton } from '../../../components';
import { themes, sizes } from '../../../constants/layout';
import { useSettingsContext } from '../../../context/settingsContext';
import { signInWithEmail } from '../../../lib/supabase/auth_sb';
import { supabase } from '../../../lib/supabase/sb_config';
import { fetchNotesInBatch } from '../../../lib/storage';
import { sortTasksOnTop } from '../../../lib/sort';
import { useNotesContext } from '../../../context/noteContext';

const LoginScreen = ({navigation, route}: any) => {
    const {setMyNotes} = useNotesContext(); 
    const { theme, enablePasscode} = useSettingsContext();
    // const {hasPasscode} = route?.params || {};
    const darkTheme = theme === "dark";
  
    //State variables
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
      email: '',
      password: '',
    });
    const [inputErrors, setInputErrors] = useState({
      email: '',
      password: '',
    });
    

    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh()
      }
    })

    const resetState = () => {
      setInputErrors({
        email: '',
        password: '',
      });
      setUser({
        email: '',
        password: '',
      });
    };

    const loadNotes = async () => {
      try {
        const initialNotesBatch = await fetchNotesInBatch(0, 20); // load first 20 notes
        if (initialNotesBatch) {
          initialNotesBatch.reverse();
          const sortedNotes = sortTasksOnTop(initialNotesBatch);
          setMyNotes(sortedNotes);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

  const handleLoginError = (error: any) => {
    console.error('Error in handleLoginError:', error);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      if(!user.email && user.password){
        return handleInputError();
      }
      const error = await signInWithEmail(user.email, user.password)
      if(error){
        return Alert.alert('Login Error', error.message)
      }
      await loadNotes();
      enablePasscode? 
      navigation.replace('Passcode Auth', {screen: 'Passcode'}):   
      navigation.replace('Home') 
      resetState();
    }
    catch (error) {
       handleLoginError(error)
    }
    finally{
      setLoading(false)
    }
  };
  
  //Function to navigate to the register screen
  const handleCreateAccount = () => {
    navigation.navigate("Create Account");
  };

  //Function to navigate to the forghot password screen
  const handleForgotPassword = () => {
    navigation.navigate('Forgot Password');
  };

  const handleEmailChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      email: text,
    }));
  };
  
  const handlePasswordChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      password: text,
    }));
  };
  
  const handleInputError = () => {
    setInputErrors({
      email: !user.email ? "Please enter a valid email address" : '',
      password: !user.password ? "Please enter a valid password" : '',
    });
  };


  return (
    <ScrollView
    contentContainerStyle={[styles.container, {backgroundColor:darkTheme? themes.dark.background : themes.light.background}]}      
    >
    <Text style={[styles.header, {color:darkTheme? themes.dark.text : themes.light.text}]}>Login</Text>
      <View style={styles.inputContainer}>
       <InputField
          value={user.email}
          onChangeText={handleEmailChange}
          error={!!(!user.email && inputErrors.email)}
          errorText={inputErrors.email}
          placeholder="Email Address"
          color={darkTheme? themes.dark.text : themes.light.text }
          borderWidth={1}
          textAlignVertical='center'
          borderColor={darkTheme? themes.dark.border:themes.light.border}  
        />
        <InputField
          value={user.password}
          onChangeText={handlePasswordChange}
          error={!!(!user.password && inputErrors.password)}
          errorText={inputErrors.password}
          placeholder="Enter Password"
          color={darkTheme? themes.dark.text : themes.light.text }
          borderWidth={1}
          textAlignVertical='center'
          borderColor={darkTheme? themes.dark.border:themes.light.border}
          secureTextEntry={true}                               
        /> 
        <Button
          text={'Login'}
          icon={'enter-outline'}
          width='100%'
          onPress={handleLogin}
          backgroundColor= {themes.light.primary}
          loading={loading}
        />
      </View>
      <Spacer/>
      <View style={styles.rowContainer}>
        <Text style={[styles.RegisterText, {color:darkTheme? themes.dark.text : themes.light.text}]}>Don't have an account?</Text>
        <TextButton
          onPress={handleCreateAccount}
          buttonText={'Create account'}
          color={themes.light.primary}
          margin={0}
        />
      </View>
      <Spacer/>
      <View style={styles.rowContainer}>
      <TextButton
          onPress={handleForgotPassword}
          buttonText={'Forgotten password?'}
          color={themes.light.primary}
          margin={0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes.layout.medium
  },
  inputContainer: {
    width: '100%',
    backgroundColor:"transparent",
    gap:10
  },
  input: {
    backgroundColor: 'transparent',
    padding: sizes.layout.small,
    borderRadius: sizes.layout.medSmall,
    borderColor:themes.light.border,
    borderWidth:1,
    color: themes.light.text,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RegisterText: {
    marginRight: sizes.layout.xSmall,
    fontSize: sizes.font.medium,
    color: themes.light.text,
  },
  header:{
    fontSize :sizes.font.xLarge,
    color:themes.light.text,
    marginBottom:sizes.layout.medium,
  }
});

export default LoginScreen;


