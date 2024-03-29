import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { themes, sizes } from '../../../constants/layout';
import { validatePasscode } from '../../../lib/auth';
import { PasscodeKeypad, Circle, Timer } from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotesContext } from '../../../context/noteContext';
import { fetchNotesInBatch, saveSettings } from '../../../lib/storage';
import { sortTasksOnTop } from '../../../lib/sort';
import { useSettingsContext } from '../../../context/settingsContext';

const MAX_ATTEMPTS = 5;
const TIMEOUT_DURATION = 1 * 60 * 1000; // 1 minutes in milliseconds

const PasscodeScreen = ({ navigation, route }: any) => {
  const [passcode, setPasscode] = useState('');
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [timeOutDuration, setTimeoutDuration] = useState(TIMEOUT_DURATION);
  const {setMyNotes} = useNotesContext(); 
  const {enablePasscode, setEnablePasscode, theme, setTheme, imageSettings, broadcastSettings, quotePostSettings} = useSettingsContext();
  const {updatingPasscode, disablingPasscode} = route?.params || {} 
  const darkTheme = theme === 'dark'

  const tooManyWrongAttempts = invalidAttempts === MAX_ATTEMPTS;
  const remainingAttemptsWarning = `${MAX_ATTEMPTS - invalidAttempts} remaining attempts`;
  const showRemainingAttemptsWarning = invalidAttempts >= 1 && invalidAttempts < MAX_ATTEMPTS;

  // Check if timeout is currently active on component mount
  useLayoutEffect (()=> {
    const checkTimeout = async () => {
      const timeout = await AsyncStorage.getItem('timeout');
      if (!timeout) {
        return null;
      }
      const parsedTimeout = JSON.parse(timeout);
      const remaining = parsedTimeout.duration - (Date.now() - parsedTimeout.timestamp);
      if(remaining){
        setTimeoutDuration(remaining)
        startTimeout()
      }
    };

    checkTimeout()

  }, [])

  const startTimeout = () => {
    setIsTimeoutActive(true);
  };

  const onFinished = () => {
    setIsTimeoutActive(false);
    setInvalidAttempts(0)
  }
  
  const handleNumberPress = (passcodeChar: string) => {
    if (tooManyWrongAttempts || isTimeoutActive) return;

    if (passcodeChar === 'clear') {
      setPasscode(passcode.slice(0, -1)); // Remove the last character from passcode
    } else {
      setPasscode(passcode + passcodeChar);
    }
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

  const handleInvalidPasscode = () => {
    console.error('Incorrect passcode. Please try again.');
    setInvalidAttempts(prevInvalidAttempts => prevInvalidAttempts + 1);
    setPasscode('');
    if (invalidAttempts + 1 === MAX_ATTEMPTS) {
      startTimeout();
    }
  };

  const handleUpdatingPasscode = () => {
    navigation.replace('Create Passcode');
    if(!enablePasscode){
      setEnablePasscode(true)
      saveSettings({enablePasscode: true})
    }
  }

  const handleDisablePasscode = () => {
    setEnablePasscode(false);
    saveSettings({enablePasscode: false})
    navigation.goBack();
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
        resetState();
        await loadNotes();
        if(!enablePasscode){
          setEnablePasscode(true)
        }
        navigation.replace('Home');
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
