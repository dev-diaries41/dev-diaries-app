import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { themes, sizes } from '../../../constants/layout';
import { validatePasscode } from '../../../lib/auth';
import { PasscodeKeypad, Circle, Timer } from '../../../components';
import { useNotesContext } from '../../../context/NoteContext';
import { fetchNotesInBatch, saveSettings } from '../../../lib/storage';
import { sortTasksOnTop } from '../../../lib/sort';
import { useSettingsContext } from '../../../context/SettingsContext';
import useTimeout from '../../../hooks/useTimeout';

const MAX_ATTEMPTS = 5;

const PasscodeScreen = ({ navigation, route }: any) => {
  const {enablePasscode, setEnablePasscode, theme} = useSettingsContext();
  const { timeOutDuration, startTimeout, isTimeoutActive , setIsTimeoutActive} = useTimeout();
  const {updatingPasscode, disablingPasscode} = route?.params || {} 
  const {setMyNotes} = useNotesContext(); 
  const [passcode, setPasscode] = useState('');
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const darkTheme = theme === 'dark'

  const tooManyWrongAttempts = invalidAttempts === MAX_ATTEMPTS;
  const remainingAttemptsWarning = `${MAX_ATTEMPTS - invalidAttempts} remaining attempts`;
  const showRemainingAttemptsWarning = invalidAttempts >= 1 && invalidAttempts < MAX_ATTEMPTS;

  const onFinished = () => {
    setIsTimeoutActive(false);
    setInvalidAttempts(0)
  }

  const handleNumberPress = useCallback((passcodeChar: string) => {
    if (tooManyWrongAttempts || isTimeoutActive) return;
    if (passcodeChar === 'clear') {
      setPasscode(prevPasscode => prevPasscode.slice(0, -1));
    } else {
      setPasscode(prevPasscode => prevPasscode + passcodeChar);
    }
  }, [passcode, tooManyWrongAttempts, isTimeoutActive]);
  


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

  const handleInvalidPasscode = () => {
    console.warn('Incorrect passcode. Please try again.');
    setInvalidAttempts(prevInvalidAttempts => prevInvalidAttempts + 1);
    setPasscode('');
    if (invalidAttempts + 1 === MAX_ATTEMPTS) {
      startTimeout();
    }
  };

  const handleUpdatingPasscode = () => {
    navigation.replace('Create Passcode');
    if(!enablePasscode){
      updateEnablePasscode(true);
    }
  }

  const handleDisablePasscode = () => {
    updateEnablePasscode(false);
    navigation.goBack();
  }

  const updateEnablePasscode = (enable: boolean) =>{
    setEnablePasscode(enable);
    saveSettings({enablePasscode: enable})
  }

  // Handle callback function after successful reauthentication
  const reauthenticationCallback = () => {
    switch(true){
      case updatingPasscode:
        handleUpdatingPasscode();
        break; 
      case disablingPasscode:
        handleDisablePasscode();
        break;  
    }
  }

  const resetState = () => {
    setPasscode('');
    setInvalidAttempts(0);
  }
  

  const handleGoHome = async() => {
    resetState();
    await loadNotes();
    if(!enablePasscode){
      updateEnablePasscode(true);
    }
    navigation.replace('Home');
  }

  // If user updating passcode navigate to create passcode screen
  // after the user inputs the correct passcode
  const handlePasscodeSubmit = async (passcode: string) => {
    if (tooManyWrongAttempts || isTimeoutActive) {
      return;
    }

    const savedPasscodeHash = await SecureStore.getItemAsync('passHash');
    const isValidPasscode = await validatePasscode(passcode, savedPasscodeHash);

    switch (true) {
      case !isValidPasscode:
        return handleInvalidPasscode();

      case updatingPasscode || disablingPasscode:
        resetState();
        return reauthenticationCallback();

      default:
        handleGoHome();
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="transparent" barStyle={darkTheme? 'light-content':'dark-content'} translucent />
    {isTimeoutActive && (
        <Timer
          duration={timeOutDuration}
          message="Try again after"
          onFinished={onFinished}
        />
      )}
      {showRemainingAttemptsWarning && <Text style={styles.tooManyAttempts}>{remainingAttemptsWarning}</Text>}
      {!tooManyWrongAttempts && !isTimeoutActive && <Text style={styles.title}>{`Enter Passcode`}</Text>}
      <View style={styles.passcodeCircles}>
        {Array.from({ length: passcode.length }).map((_, index) => (
          <Circle key={index} filled={index < passcode.length} />
        ))}
      </View>
      <PasscodeKeypad onNumberPress={handleNumberPress} onSubmitPassword={() => { handlePasscodeSubmit(passcode) }} />
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
    fontSize: sizes.font.medium,
    fontWeight:'500',
    margin: sizes.layout.medium,
    color: themes.dark.text,
    textAlign: 'center'
  },
  tooManyAttempts: {
    fontSize: sizes.font.medium,
    margin: sizes.layout.medium,
    color: themes.dark.text,
    textAlign: 'center'
  },
  passcodeCircles: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    height: 15   // same height as circle component
  },
});

export default PasscodeScreen;
