import { StyleSheet, View, SafeAreaView, Dimensions, StatusBar, Keyboard, Text, Image, BackHandler} from 'react-native'
import React, {useState, useLayoutEffect, useEffect} from 'react'
import { themes, sizes } from '../../constants/layout'
import {AIImageStylesWrapper, Button, InputField, Spacer, Loader, IconButton } from '../../components';
import { useImageGenContext } from '../../context/imageContext';
import { generate } from '../../lib/generate';
import { useSettingsContext } from '../../context/settingsContext';
import { useLayoutContext } from '../../context/layoutContext';

const {height} = Dimensions.get('screen');

const CreateImageScreen = ({navigation, route}: any) => {
    const {assets, setAssets} = useImageGenContext();
    const {theme, imageSettings} = useSettingsContext()
    const {shouldHideTabBar, setShouldHideTabBar} = useLayoutContext();
    const [prompt, setPrompt] = useState('');
    const [promptError, setPromptError] = useState('');
    const [loading, setLoading] = useState(false);
    const darkTheme = theme === 'dark'
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    // console.log(route)


    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardVisible(false);
        });
    
        // Cleanup listeners
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);
    
    useLayoutEffect(() => {
        navigation.setOptions({
        headerStyle: { backgroundColor: darkTheme ? themes.dark.background : themes.light.background },
        headerTitleStyle: { color: darkTheme ? themes.dark.text : themes.light.text, fontSize:sizes.font.large },
        headerTintColor: darkTheme ? themes.dark.text : themes.light.text,
        headerShadowVisible: false,
        headerTitle: 'Create Image'
        });
    }, [theme, navigation]);

    // Back button shows tab bar again
    useEffect(() => {
        const backAction = () => {
        if (shouldHideTabBar) {
            handleGoBack();
            return true;
        }

        return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [shouldHideTabBar]);

    const handlePromptChange = (prompt: string) => {
        setPrompt(prompt)
        if(promptError){
            setPromptError('')
        }
    }

    const handlePromptError = () => {
        setPromptError('Prompt cannot be empty')
    }

    const handleGenerateImage = async () => {
        setLoading(true); 
        if (!prompt) {
            handlePromptError();
            setLoading(false); 
            return;
        }

        try {
            const { data } = await generate(prompt, imageSettings);
            if (data && data.status === 'COMPLETED') {
                setAssets([data.output.image_url]);
                navigation.navigate('View Media', { prompt})
                return;
            } 
            alert(`Error: ${data.error}`);
        } catch (error) {
            console.error('Error generating image:', error);
            alert('An error occurred while generating the image.');
        } finally {
            setLoading(false); 
        }
    };

    const handleGoBack = () => {
        setShouldHideTabBar(false);
        navigation.goBack()
    }


    if(loading){
        return <Loader size={90} loaderText='Generating image, this may take a few seconds...'/>
    }
  
  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: darkTheme? themes.dark.background : themes.light.background}]}>
        <StatusBar backgroundColor="transparent" barStyle={darkTheme? "light-content" : "dark-content"} translucent />
        <View style={styles.backButton}>
        <IconButton icon={'arrow-back'} color={themes.dark.icon} onPress={handleGoBack}/>
        </View>
        <Image
        source={require('../../../assets/bg2.png')}
        style={[StyleSheet.absoluteFillObject, {resizeMode:'cover', height: height}]}
        blurRadius={20}
        />
        <View style={styles.inputContainer}>
            <InputField
                value={prompt}
                onChangeText={handlePromptChange}
                error={!!(!prompt && promptError)}
                placeholder='Enter the prompt for the image you want to generate...'
                errorText={promptError}
                multiline={true}
                color={darkTheme? themes.dark.text: themes.light.text}
                backgroundColor={darkTheme? themes.dark.card: themes.light.card}
                height={120}
            />
        </View>
        <Spacer/>
        <View style={styles.styleOptions}>
            <Text style={[styles.label,{color: darkTheme? themes.dark.text: themes.light.text}]}>Pick a style (optional)</Text>   
            <AIImageStylesWrapper/>
        </View>

        {assets.length === 0 &&<Spacer/>}
        <View style={styles.buttonContainer}>
            <Button
                text = {'Generate'}
                icon={'color-wand-outline'}
                onPress={handleGenerateImage}
                loading={loading}
                color={themes.dark.text}
                backgroundColor={darkTheme? themes.dark.primary: themes.light.primary}
            />
        </View>
    </SafeAreaView>
  )
}

export default CreateImageScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: sizes.layout.small,
        paddingTop: StatusBar.currentHeight! + sizes.layout.small,
        alignItems: 'center',
    },
    buttonContainer:{
        marginTop: 'auto',
        marginBottom: sizes.layout.medium,
        width: "100%"
    },
    footer:{
        marginVertical: sizes.layout.medium,
        marginTop: "auto",
        width: "100%"
    },
    navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginRight: sizes.layout.medium,
        gap:sizes.layout.medium
      },
      styleOptions:{
        maxHeight: 100,
        gap:4,
        flexDirection:'column',
    
      },
      label: {
        fontSize: sizes.font.small,
        color: themes.dark.text,
        marginVertical:sizes.layout.xSmall,
      },
      inputContainer:{
        height:120, 
        width:'100%',
      },
      backButton: {
        zIndex:100, 
        marginRight: 'auto', 
        marginBottom: sizes.layout.medium
    }
})