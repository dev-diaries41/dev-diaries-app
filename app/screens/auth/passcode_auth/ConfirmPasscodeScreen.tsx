import React, { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { hashPass } from '../../../lib/auth';
import { PasscodeKeypad, Circle, createFlashMsg } from '../../../components';
import { sizes, themes } from '../../../constants/layout';

const ConfirmPasscodeScreen = ({navigation, route}: any) => {
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const {passcode} = route.params;
  const {showMessage, FlashMessage} = createFlashMsg();
  

  //Function to handle number press on keypad
  const handleNumberPress = (passcodeChar: string) => {
    if (passcodeChar === 'clear') {
      return setConfirmPasscode(confirmPasscode.slice(0, -1)); // Remove the last character from passcode
    } 
      setConfirmPasscode(confirmPasscode + passcodeChar);
  };
  

  //Function to submit passcode 
  const handlePasscodeSubmit = async (passcode: string, confirmPasscode: string) => {
    if (passcode === confirmPasscode) {
      // Save the entered password hash to SecureStore
      const passHash = await hashPass(passcode);
      await SecureStore.setItemAsync('passHash', passHash);
      return navigation.replace('Home');
    }
    console.error('Passcodes do not match. Please try again.');
    showMessage('Passcodes do not match', false);
    new Promise(resolve => setTimeout(resolve, 500)).then(() => navigation.replace('Create Passcode'));
}

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirm Passcode</Text>
      <View style={styles.passcodeCircles}>
      {Array.from({ length: confirmPasscode.length }).map((_, index) => (
    <Circle key={index} filled={index < confirmPasscode.length} />
))}
      </View>
      <PasscodeKeypad onNumberPress={handleNumberPress} onSubmitPassword={()=>{handlePasscodeSubmit(passcode, confirmPasscode);
}} />
    <FlashMessage/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themes.dark.background,
    paddingTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: themes.dark.text,
  },
  passcodeCircles: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    height:15   // same height as circle componenet
  },
  message: {
    fontSize: sizes.font.medium,
    margin: sizes.layout.medium,
    color: themes.dark.text,
    textAlign: 'center'
  },
 
  
});


export default ConfirmPasscodeScreen;
