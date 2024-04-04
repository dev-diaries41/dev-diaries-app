import { StyleSheet, useColorScheme, Appearance } from 'react-native'
import React, {useState, useCallback, useEffect} from 'react'
import {NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { themes, sizes } from './app/constants/layout';
import { SettingsProvider } from './app/context/SettingsContext';
import { PLACEHOLDER_TAGS, DEFAULT_SETTINGS } from './app/constants/defaultSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/home/HomeScreen';
import UpdateSettingsScreen from './app/screens/settings/UpdateSettingsScreen';
import { NotesProvider } from './app/context/NoteContext';
import * as SystemUI from 'expo-system-ui';
import { Note, Settings, Theme } from './app/constants/types';
// import OnboardingScreen from './app/screens/onboarding/OnboardingScreen';
import { UserProvider } from './app/context/UserContext';
// import { supabase } from './app/lib/supabase/sb_config';
// import { Session } from '@supabase/supabase-js';
import { checkHasPassocde, checkHasSession, removeSession, storeSession } from './app/lib/auth';
// import AuthScreens from './app/screens/auth/email_auth';
import PasscodeScreens from './app/screens/auth/passcode_auth';
import { fetchNotesInBatch } from './app/lib/storage';
import { sortTasksOnTop } from './app/lib/sort';



const Stack = createStackNavigator()
SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto hiding


const App = () => {
    const [theme, setTheme] = useState(useColorScheme())
    const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);
    const [appIsReady, setAppIsReady] = useState(false);
    const [tags, setTags] = useState(PLACEHOLDER_TAGS);
    const [hasPasscode, setHasPasscode] = useState(false);
    const [userSession, setUserSession] = useState<any | null>(null)
    const [initialNotes, setInitialNotes] = useState<Note[]>([]);

    // useEffect(() => {
    //   supabase.auth.getSession().then(({ data: { session } }) => {
    //     setUserSession(session)
    //   })

    //   supabase.auth.onAuthStateChange(async (_event, session) => {
    //     setUserSession(session)
    //     if(_event === 'SIGNED_IN' && session){
    //       await storeSession(session);
    //     }
    //     if(_event === 'SIGNED_OUT'){
    //       await removeSession();
    //     }
    //   })
    // }, [])
 
    // // listen for changes to the color scheme
    // Appearance.addChangeListener((scheme) => setTheme(scheme.colorScheme));
    // // console.log({theme})


    const checkPasscodeExistence = async () => {
      const userHassPasscode = await checkHasPassocde();;
      if (userHassPasscode) {
        setHasPasscode(true);
      }
    };
    
    //Function to load user settings
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('settings');
        if (storedSettings) {
          const parsedSettings: Settings = JSON.parse(storedSettings);
          SystemUI.setBackgroundColorAsync(themes[parsedSettings.theme as Theme].background)
          setUserSettings(JSON.parse(storedSettings));
          return parsedSettings.enablePasscode
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    const loadNotes = async () => {
      try {
        const initialNotesBatch = await fetchNotesInBatch(0, 20); // load first 20 notes
        if (initialNotesBatch) {
          initialNotesBatch.reverse();
          const sortedNotes = sortTasksOnTop(initialNotesBatch);
          setInitialNotes(sortedNotes);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    const loadTags = async () => {
      try {
        const storedTags = await AsyncStorage.getItem('tags');
        if (storedTags) {
          setTags(JSON.parse(storedTags));
        }
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    }

    //useEffect hook to prepare app on start
    useEffect(() => {
      const prepare = async() => {
        try {
            await checkPasscodeExistence();
           const passcodeEnabled =  await loadSettings();
           if(!passcodeEnabled){
            await loadNotes();
           }
            await loadTags();
        } catch (e) {
          console.warn(e);
        } finally {
          setAppIsReady(true);
        }
      }

      prepare();
    }, []);

    //Function to set app ready when nav children loaded
    const onLayoutRootView = useCallback(async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }, [appIsReady]);



    if (!appIsReady) {
      return null;
    }
    return (
      <UserProvider userSession={userSession}>
        <SettingsProvider settings={userSettings}>
          <NotesProvider currentTags={tags} initialNotes={initialNotes}>
            <NavigationContainer onReady={onLayoutRootView} theme={{ colors: userSettings.theme === 'light' ? themes.light : themes.dark, dark: userSettings.theme === 'dark' }}>
                <Stack.Navigator
                  initialRouteName={hasPasscode && userSettings.enablePasscode? "Passcode Auth" : "Home"}
                  screenOptions={{
                    animationEnabled: true,
                  }}
                >
                  {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false, headerShadowVisible: false,}} /> */}
                  {/* <Stack.Screen name={'Auth'} component={AuthScreens} initialParams={{hasPasscode}} options={{ headerShown: false }} /> */}
                  <Stack.Screen name={'Passcode Auth'} component={PasscodeScreens} initialParams={{hasPasscode}} options={{ headerShown: false }} />
                  <Stack.Screen name="Home" component={HomeScreen} initialParams={{hasPasscode, currentTags: tags, initialNotes}} options={{ headerShown: false }} />
                  <Stack.Screen name="Update Settings" component={UpdateSettingsScreen} options={{headerShown: true,headerShadowVisible: false}} />
                </Stack.Navigator>
              </NavigationContainer>
              </NotesProvider>
          </SettingsProvider>
      </UserProvider>
    );
    
    }

export default App;

const styles = StyleSheet.create({
    navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginRight: sizes.layout.medium,
        gap:sizes.layout.medium
      },
      tagContainer:{
        justifyContent:"flex-start",
        alignItems:'flex-start',
        maxHeight:50,
        borderColor: '#333',
        borderWidth:1,
        borderRadius: sizes.layout.medium,
        paddingHorizontal: sizes.layout.small,
        marginHorizontal: sizes.layout.medium,
        width:'auto'
      },
    logo:{
        resizeMode:'contain',
        width:40,
        height:40,
        borderRadius:20,
        marginLeft: sizes.layout.small,
    },
      
})