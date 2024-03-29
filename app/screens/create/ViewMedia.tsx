import { StyleSheet, View, SafeAreaView, Dimensions, Image, StatusBar, BackHandler} from 'react-native'
import React, {useEffect, useState} from 'react'
import { themes, sizes } from '../../constants/layout'
import {FooterButtons } from '../../components';
import { useImageGenContext } from '../../context/imageContext';
import { downloadFromUrl, save, shareFromUrl } from '../../lib/storage';
import { generate } from '../../lib/generate';
import { useSettingsContext } from '../../context/settingsContext';
import { useLayoutContext } from '../../context/layoutContext';

const {height, width} = Dimensions.get('screen');


const ViewMedia = ({navigation, route}: any) => {
    const {assets, setAssets} = useImageGenContext();
    const {theme, imageSettings} = useSettingsContext()
    const {shouldHideTabBar, setShouldHideTabBar} = useLayoutContext();
    const darkTheme = theme === 'dark'
    const {url, prompt} = route.params;
    const [loading, setLoading] = useState(false);
    console.log({url})

      // Back button shows tab bar again
      useEffect(() => {
        const backAction = () => {
        if (shouldHideTabBar && url) {
            handleGoBack();
            return true;
        }

        return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [shouldHideTabBar]);
    
      const handleRemoveImage = () => {
        setAssets([]);
        handleGoBack();
    }

    const handleGoBack = () => {
        // this is the case where going back is to the create screen in which case tab needs to be shown
        if(url){
            setShouldHideTabBar(false);
        }
        navigation.goBack()
    }

    const handleGenerateImage = async () => {
        if(!prompt){return}
        setLoading(true); 

        try {
            const { data } = await generate(prompt, imageSettings);
            if (data && data.status === 'COMPLETED') {
                setAssets([data.output.image_url]);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert('An error occurred while generating the image.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadLocalUrl = async() => {
        const result = await save(url, `POST_${Date.now()}`, 'image/png')
        result.success? alert(result.message) : alert(result.error)
    }

    const handleDownloadUrl = async() => {
        const result = await downloadFromUrl(assets[0])
        result.success? alert(result.message) : alert(result.error)
    }

    const handleShare = async() => {
        const result = await shareFromUrl(assets[0])
        console.log(result)
    }

    const footerButtonsConfig = [
     
        {
            onPress:  prompt? handleDownloadUrl : handleDownloadLocalUrl,
            icon: 'download',
            iconColor:themes.colors.darkWhite,
            text: 'Download',
            condition: true
        },
        {
            onPress:  handleShare,
            icon: 'send',
            iconColor:themes.colors.darkWhite,
            text: 'Post',
            condition: url
        },
        {
            onPress:  handleShare,
            icon: 'share-social',
            iconColor:themes.colors.darkWhite,
            text: 'Share',
            condition: !url
        },
        {
            onPress:  handleGenerateImage,
            icon: 'refresh',
            iconColor:themes.colors.darkWhite,
            text: 'Regenerate',
            loading: loading && prompt,
            condition: prompt
        },
        {
            onPress: handleRemoveImage,
            icon: 'trash',
            iconColor:themes.colors.darkWhite,
            text: 'Bin',
            condition: true

            },
        ];
      
  
  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: darkTheme? themes.dark.background : themes.light.background}]}>
        <StatusBar backgroundColor="transparent" barStyle={darkTheme? "light-content" : "dark-content"} translucent />  
        {assets.length > 0 && <Image source={{ uri: assets[0]}} style={StyleSheet.absoluteFillObject} blurRadius={10}/>}
        {/* AI Generated Image */}
        {assets.length > 0 && (
            <View style={{ width:"100%", height:"100%", justifyContent:'center'}}>
            <Image source={{ uri: assets[0]}} style={styles.image} />
            </View>
        )}

         {/* Media Post Image */}
        {url && (
            <View style={{ width:"100%", height:"100%", justifyContent:'center'}}>
            <Image source={{ uri: url}} style={styles.postImage} />
        </View>
        )}
    
         {(url || assets) && 
        <View style = {styles.footer}>
            <FooterButtons 
              buttonsConfig={footerButtonsConfig} 
              buttonsColor={darkTheme? themes.dark.primary: themes.light.primary}
              backgroundColor={darkTheme? themes.dark.card: themes.light.card}
            />  
        </View>
        }
    </SafeAreaView>
  )
}

export default ViewMedia

const styles = StyleSheet.create({
    container:{
        position:'relative',
        flex: 1,
        padding: sizes.layout.small,
        alignItems: 'center',
    },
    image:{
        // position:'absolute',
        height: height,
        borderRadius: sizes.layout.medium,
        resizeMode:'contain',
    },
    postImage:{
        height: height,
        borderRadius: sizes.layout.medium,
        resizeMode:'contain',
    },
    buttonContainer:{
        marginVertical: sizes.layout.medium,
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
        flexDirection:'column'
      },
      label: {
        fontSize: sizes.font.small,
        color: themes.dark.text,
        marginVertical:sizes.layout.xSmall,
        
      },
})