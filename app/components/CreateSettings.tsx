import { SafeAreaView, ScrollView, View, Text, StyleSheet} from 'react-native';
import React, { useLayoutEffect, useState} from 'react';
import { themes, sizes } from '../constants/layout';
import { useSettingsContext } from '../context/settingsContext';
import {Button, InputField, Spacer } from '.';
import { useNavigation } from '@react-navigation/native';
import { QuotePostSettings, QuotePostSettingsKey, NotifyConfigKey, ImageSettings, ImageSettingsKey } from '../constants/types';
import { saveSettings } from '../lib/storage';

const initialQuotePostErrors = (settings: QuotePostSettings): Partial<Record<QuotePostSettingsKey, string>> => {
  if(!settings){
    throw new Error('Media Post Settings Undefined')
  }
  const initialErrors: Partial<Record<QuotePostSettingsKey, string>> = {};
  Object.keys(settings).forEach((key) => {
      const typedKey = key as QuotePostSettingsKey; // Assert type of key
      initialErrors[typedKey] = '';
  });
  return initialErrors;
};


const initialImageErrors = (settings: ImageSettings): Partial<Record<ImageSettingsKey, string>> => {
  const initialErrors: Partial<Record<ImageSettingsKey, string>> = {};
  Object.keys(settings).forEach((key) => {
      const typedKey = key as ImageSettingsKey; // Assert type of key
      initialErrors[typedKey] = '';
  });
  return initialErrors;
};


const CreateSettings = () => {
  const {theme, broadcastSettings, imageSettings, quotePostSettings, setBroadcastSettings, setQuotePostSettings, setImageSettings} = useSettingsContext();
  const [newBroadcastSettings, setNewBroadcastSettings] = useState(broadcastSettings);
  const [newQuotePostSettings, setnewQuotePostSettings] = useState<QuotePostSettings>(quotePostSettings);
  const [newImageSettings, setNewImageSettings] = useState(imageSettings);
  const [postErrors, setPostErrors] = useState({
      telegramChannelId: '',
      discordWebhookUrl: '',
    });
  const [quotePostErrors, setQuotePostErrors] = useState(initialQuotePostErrors(quotePostSettings));
  const keysToSkip=['negative_prompt', 'h', 'w', 'seed', 'num_images'];
  const showValue =(key: string) => !keysToSkip.includes(key);
  const darkTheme = theme === 'dark'
  const [imageSettingsError, setImageSettingsErrors] = useState(initialImageErrors(imageSettings))
  const navigation = useNavigation()


  const handleSaveCreateSettings = async () => {
    const isError = handleErrors();
    if(isError){return}
      setQuotePostSettings(newQuotePostSettings)
      setBroadcastSettings(newBroadcastSettings)
      setImageSettings(newImageSettings)
      await saveSettings({broadcastSettings: newBroadcastSettings, imageSettings: newImageSettings, quotePostSettings: newQuotePostSettings})
    navigation.goBack()
  }
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: darkTheme ? themes.dark.background : themes.light.background },
      headerTitleStyle: {fontSize: sizes.font.large },
      headerTintColor:darkTheme? themes.dark.text:themes.light.text,
      headerShadowVisible: false,
      headerTitle: 'Create Settings',
      headerRight: () => (
        <View style={styles.navRowButtons}>
         <Button 
         text='Save'
         height={'auto'}
         onPress={handleSaveCreateSettings} 
         color={darkTheme? themes.dark.icon:themes.light.icon}
         backgroundColor={darkTheme? themes.dark.primary:themes.light.primary}
         width={'auto'}
         />
        </View>
      ),
    });

  }, [theme, handleSaveCreateSettings]);

  const handleBroadcastSettingChange = (newValue: string, key:string) => {
      setNewBroadcastSettings((prevConfig) => ({
          ...prevConfig,
          [key]: newValue,
      }));
  }

  const handleQuotePostSettingChange = (newInput: string, key: QuotePostSettingsKey) => {
    const parsedInput = typeof newInput === 'string' ? parseInt(newInput) : newInput;
    setnewQuotePostSettings((prevSettings: QuotePostSettings) => ({
        ...prevSettings,
        [key]: typeof prevSettings[key] === 'number' ? (parsedInput || 0) : newInput,
    }));
};

const handleImageSettingsChange = (newInput: string, key: ImageSettingsKey) => {
  const parsedInput = typeof newInput === 'string' ? parseInt(newInput) : newInput;
  setNewImageSettings((prevSettings: ImageSettings) => ({
      ...prevSettings,
      [key]: typeof prevSettings[key] === 'number' ? (parsedInput || 0) : newInput,
  }));
};

  const handleQuotePostInputError = () => {
    const errors =  Object.entries(newQuotePostSettings).reduce((errorObject: any, [key, value]) => {
        value? (errorObject[key] = '') : (errorObject[key] = `${key} cannot be empty`)
        return errorObject;
    }, {});
    setQuotePostErrors(errors)
    return Object.values(errors).some( error => error !=='')
  };

  const handleImageInputError = () => {
    const errors =  Object.entries(newImageSettings).reduce((errorObject:any, [key, value]) => {
        value? (errorObject[key] = '') : (errorObject[key] = `${key} cannot be empty`)
        return errorObject;
    }, {});
    setImageSettingsErrors(errors)
    return Object.values(errors).some( error => error !=='')
};

const handleErrors = () => {
  const quotePostError = handleQuotePostInputError();
  const imageError = handleImageInputError();
  return quotePostError || imageError;
}
  

// Commment out for now because for personal use and i have default channel
// In prod - allow users to add new channels and save

// const handleBroadcastInputError = () => {
//   const errors =  Object.entries(newBroadcastSettings).reduce((errorObject:any, [key, value]) => {
//       value? (errorObject[key] = '') : (errorObject[key] = `${key} cannot be empty`)
//       return errorObject;
//   }, {});
//   setPostErrors(errors)
//   return Object.values(errors).some( error => error !=='')
// };



    return (
        <SafeAreaView style={[styles.container, {backgroundColor: darkTheme? themes.dark.background:themes.light.background}]}>
          <ScrollView showsVerticalScrollIndicator={false}> 
          <Text style={[styles.label, {color: darkTheme? themes.dark.text:themes.light.text, fontSize: sizes.font.medium, opacity: 0.8}]}>
            Broadcast Settings
          </Text>
          <View style={[styles.inputContainer, {backgroundColor: darkTheme? themes.dark.card:themes.light.card}]}>
              {Object.entries(newBroadcastSettings).map(([key, value], index) => (
                <View key={index}>
                    <InputField
                    label={key}
                    value={newBroadcastSettings[key as NotifyConfigKey]!.toString()}
                    onChangeText={(newValue)=>handleBroadcastSettingChange(newValue, key)}
                    placeholder={key === 'telegramChannelId'? 'Enter new telegramChannelId' : 'Enter new discordWebhookUrl'}
                    color={ darkTheme? themes.dark.text: themes.light.text}
                    multiline = {true}
                    borderWidth={1}
                    textAlignVertical='center'
                    borderColor={darkTheme? themes.dark.border:themes.light.border}
                    />
                 </View>
              ))}
            </View>  
            <Spacer/>
            <Text style={[styles.label, {color: darkTheme? themes.dark.text:themes.light.text, fontSize: sizes.font.medium, opacity: 0.8}]}>
              Quote Post Settings
            </Text>
            <View style={[styles.inputContainer, {backgroundColor: darkTheme? themes.dark.card:themes.light.card}]}>
              {Object.entries(newQuotePostSettings).map(([key, value], index) => (
                <View key={index}>
                    <InputField
                    label={key}
                    value={newQuotePostSettings[key as QuotePostSettingsKey]!.toString()}
                    onChangeText={(newValue)=>handleQuotePostSettingChange(newValue, key as QuotePostSettingsKey)}
                    placeholder={'Enter value'}
                    color={ darkTheme? themes.dark.text: themes.light.text}
                    multiline = {true}
                    borderWidth={1}
                    borderColor={darkTheme? themes.dark.border:themes.light.border}
                    errorText={quotePostErrors[key as QuotePostSettingsKey]}
                    error={!!(!newQuotePostSettings[key as QuotePostSettingsKey]!.toString() && quotePostErrors[key as QuotePostSettingsKey])}
                    textAlignVertical='center'
                    />
                 </View>
              ))}
            </View>
            <Spacer/>

            <Text style={[styles.label, {color: darkTheme? themes.dark.text:themes.light.text, fontSize: sizes.font.medium, opacity: 0.8}]}>
              Image Settings
            </Text>
            <View style={[styles.inputContainer, {backgroundColor: darkTheme? themes.dark.card:themes.light.card}]}>
            {Object.keys(newImageSettings).map((key: string, index: number) => {
              const settingsKey = key as ImageSettingsKey; // Assert type of key
                return showValue(settingsKey) && (
                  <View key={index}>
                    <InputField
                    key={index}
                    value={newImageSettings[settingsKey].toString()}
                    onChangeText={(newInput: string) => handleImageSettingsChange(newInput, settingsKey)}
                    error={!!(!newImageSettings[settingsKey].toString() && imageSettingsError[settingsKey])}
                    placeholder=''
                    errorText={imageSettingsError[settingsKey]}
                    multiline={settingsKey === 'negative_prompt'}
                    color={darkTheme ? themes.dark.text : themes.light.text}
                    label={settingsKey}
                    borderWidth={1}
                    borderColor={darkTheme? themes.dark.border:themes.light.border}
                    textAlignVertical='center'
                    />
                  </View>
                );
            })}
            </View>
          </ScrollView>   
        </SafeAreaView>
      );
    }      

const styles = StyleSheet.create({
  container:{
      flex: 1,
      position:'relative',    
    },
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-evenly",
    alignItems:'center',
    marginRight: sizes.layout.medium,
    gap:sizes.layout.medium
  },
  inputContainer: {
    justifyContent: 'center',
    padding:sizes.layout.medium,
    gap:sizes.layout.small,
    borderRadius: sizes.layout.medium
  },
  label: {
    fontSize: sizes.font.small,
    color: themes.light.text,
    marginBottom:sizes.layout.xSmall,
    // fontWeight:'500',  
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
});

export default CreateSettings

