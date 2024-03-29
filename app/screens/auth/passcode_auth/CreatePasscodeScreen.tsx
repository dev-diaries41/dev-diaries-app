import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { sizes, themes } from '../../../constants/layout';
import { PasscodeKeypad, Circle, createCustomAlert, TextButton } from '../../../components';


const CreatePasscodeScreen = ({navigation, route}: any) => {
  const {hasPasscode} = route?.params || {};
  const [passcode, setPasscode] = useState('');
  const { showAlert, CustomAlert } = createCustomAlert();


  //Function to handle keypad press
  const handleNumberPress = (passcodeChar: string) => {
    if (passcodeChar === 'clear') {
      setPasscode(passcode.slice(0, -1)); // Remove the last character from passcode
    } else  {
      setPasscode(passcode + passcodeChar);
    }
  };
  

  const handlePasscodeSubmit = (passcode: string) => {
    navigation.replace('Confirm Passcode', {passcode});
    setPasscode('');
  }

  // Make sure to handle the enabling of passcode carefully
  const handleSkipCreatePasscode = () => {
    if(hasPasscode){return}
    navigation.replace('Home');
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Passcode</Text>
      <View style={styles.passcodeCircles}>
      {Array.from({ length: passcode.length }).map((_, index) => (
    <Circle key={index} filled={index < passcode.length} />
))}
      </View>
      <PasscodeKeypad onNumberPress={handleNumberPress} onSubmitPassword={()=>{handlePasscodeSubmit(passcode)}} />
     {!hasPasscode && <View style={{position: 'absolute', bottom: 40, left: 0, paddingLeft: sizes.layout.small}}>
        <TextButton buttonText='Skip' color={themes.dark.text} onPress={handleSkipCreatePasscode}/>      
      </View>}
      <CustomAlert />
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
 
  
});

export default CreatePasscodeScreen;
