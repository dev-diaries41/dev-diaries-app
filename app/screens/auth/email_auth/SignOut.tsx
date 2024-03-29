import { Text, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { themes, sizes } from '../../../constants/layout';
import { useSettingsContext } from '../../../context/settingsContext';
import { Button, Spacer } from '../../../components';
import { signOut } from '../../../lib/supabase/auth_sb';

const SignOutScreen = ({navigation}: any) => {
  const {theme} = useSettingsContext();
  const dark = theme === "dark";


  const handleSignOut = async() => {
    try{
      await signOut()
      navigation.navigate('Login');
    }catch(error: any){
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:dark? themes.dark.background : themes.light.background}]}>
      <Text style={[styles.confimQuestionText, {color:dark? themes.dark.text : themes.light.text}]} >Are you sure you want to sign out?</Text>
      <Spacer/>
      <Button
        text={'SIgn Out'}
        icon={'exit-outline'}
        width='100%'
        onPress={handleSignOut}
        backgroundColor={themes.light.primary}
       />
    </SafeAreaView>
  );
};

export default SignOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:16
  },

  confimQuestionText:{
    color:themes.dark.text,
    fontSize: sizes.font.medium,
  }
});
