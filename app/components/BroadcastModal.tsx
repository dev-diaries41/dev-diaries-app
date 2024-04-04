import React, {useRef, useLayoutEffect, useState, useEffect} from 'react';
import { View, Text, Modal, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { DisplayModalProps, NotifyConfig } from '../constants/types';
import IconButton from './IconButton';
import SwitchButton from './SwitchButton';
import { Button } from './Buttons';
import { useSettingsContext } from '../context/SettingsContext';
import InputField from './InputField';

const {height} = Dimensions.get('screen');
export const ALL_PLATFORMS_DESCRIPTION = `Send this message on all platforms`;
export const USE_DEFAULT_CHANNEL = `Send this to your default `;

interface BroadcastModalProps extends Omit<DisplayModalProps, 'onTagSelect' | 'deleteTag'> {
  sendBroadcast: (recipients: NotifyConfig[]) => Promise<void> | void;
}

const BroadcastModal = ({ 
  visible, 
  onClose,
  title,
  contentBackground = themes.dark.card,
  textColor = themes.dark.text,
  loading,
  sendBroadcast
}: BroadcastModalProps) => {
    const {broadcastSettings, setBroadcastSettings} = useSettingsContext();
    const [useDefaultChannels, setUseDefaultChannels] = useState(true);
    const [useDefaultTelegram, setUseDefaultTelegram] = useState(!!broadcastSettings.telegramChannelId);
    const [useDefaultDiscord, setUseDefaultDiscord] = useState(!!broadcastSettings.discordWebhookUrl);
    const [newTelegramChannel, setNewTelegramChannel] = useState('');
    const [newDiscordChannel, setNewDiscordChannel] = useState('');
    const [inputErrors, setInputErrors] = useState({
        telegram: '',
        discord: '',
      });
    const panY = useRef(new Animated.Value(0)).current; // Start the modal off-screen
    const recipients = [
      {telegramChannelId: newTelegramChannel && !useDefaultTelegram? newTelegramChannel : broadcastSettings.telegramChannelId},
      {discordWebhookUrl: newDiscordChannel && !useDefaultDiscord? newDiscordChannel : broadcastSettings.discordWebhookUrl}
    ]


    const handleTelegramChange = (text: string) => {
        setNewTelegramChannel(text);
      };

    const handleDiscordChange = (text: string) => {
        setNewDiscordChannel(text);
    };

    useEffect(()=>{
        if(useDefaultChannels){
            setUseDefaultTelegram(true);
            setUseDefaultDiscord(true);
        }
    },[useDefaultDiscord, useDefaultTelegram, useDefaultChannels])
    
      
      
    const handleInputError = () => {
      return {
        telegram: !newTelegramChannel  && !useDefaultTelegram? "Please enter a valid telegram channel" : '',
        discord: !newDiscordChannel  && !useDefaultDiscord? "Please enter a valid discord webhook" : '',
      };
    };

    const resetState = () => {
      setInputErrors({
        telegram: '',
        discord: '',
      });
      setNewDiscordChannel('');
      setNewTelegramChannel('');
      onClose();
    };
    

    const panResponder = useRef(
        PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            // Check if the gesture is moving downward
            if (gestureState.dy > 0) {
            panY.setValue(gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 50) {
            resetState();
            } else {
            Animated.spring(panY, {
                toValue: 0,
                useNativeDriver: true,
                damping: 15,
                stiffness: 50, 
                velocity: 5,    
            }).start();
                    }
        },
        })
    ).current;

    useLayoutEffect(() => {
        if (visible) {
        // Animate the modal into place when it becomes visible
        Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,      
            stiffness: 100,   
            velocity: 5, 
        }).start();
            }
    }, [visible]);

  const handleSendBroadcast = async() => {
    const errors = handleInputError();
    if(errors.telegram || errors.discord){
      return setInputErrors(errors);
    }
    await sendBroadcast(recipients);
    resetState();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.pullDownButton}>
          <View style={styles.pullDownNotch} />
        </View>

        <View style={[styles.modalContent, {backgroundColor:contentBackground}]}>
          <View style={styles.header}>
            <Text style={[styles.title, {color:textColor, opacity:0.5}]} numberOfLines={2}>{title}</Text>
            <IconButton icon={"close-circle"} onPress={resetState} color={textColor} opacity={0.5}/>
          </View>
          <View style={[styles.mainContent, {backgroundColor:contentBackground}]}>
            {/* <SwitchButton dark={textColor === themes.dark.text} onPress={()=>setAllPlatforms(!allPlatforms)} value={allPlatforms} buttonText='All platforms'/> */}
            <SwitchButton dark={textColor === themes.dark.text} onPress={()=>setUseDefaultChannels(!useDefaultChannels)} value={useDefaultChannels} buttonText='Use default channels'/>
            {(!useDefaultChannels) && (
            <View style={{paddingHorizontal:0, opacity: 0.5}}>
                <SwitchButton dark={textColor === themes.dark.text} onPress={()=>setUseDefaultTelegram(!useDefaultTelegram)} value={useDefaultTelegram} buttonText='Use default telegram channel'/>
                {
                !useDefaultTelegram && (
                <View style={styles.rowContainer}>
                    <InputField
                    value={newTelegramChannel}
                    onChangeText={handleTelegramChange}
                    error={!!(!newTelegramChannel && !useDefaultTelegram && inputErrors.telegram)}
                    errorText={inputErrors.telegram}
                    placeholder="Enter telegram channel id"
                    color={textColor=== themes.dark.text? themes.dark.text : themes.light.text }
                    borderWidth={1}
                    textAlignVertical='center'
                    borderColor={textColor=== themes.dark.text? themes.dark.border:themes.light.border}  
                    />
                </View>
                )}
                <SwitchButton dark={textColor === themes.dark.text} onPress={()=>setUseDefaultDiscord(!useDefaultDiscord)} value={useDefaultDiscord} buttonText='Use default discord channel' />
                {
                !useDefaultDiscord && (
                    <View style={styles.rowContainer}>
                    <InputField
                    value={newDiscordChannel}
                    onChangeText={handleDiscordChange}
                    error={!!(!newDiscordChannel  && !useDefaultDiscord&& inputErrors.discord)}
                    errorText={inputErrors.discord}
                    placeholder="Enter discord webhook"
                    color={textColor=== themes.dark.text? themes.dark.text : themes.light.text }
                    borderWidth={1}
                    textAlignVertical='center'
                    borderColor={textColor=== themes.dark.text? themes.dark.border:themes.light.border}  
                    height={20}
                    />
                </View>
                )}
            </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSendBroadcast}
              text={'Send Broadcast'}
              backgroundColor={textColor === themes.dark.text? themes.dark.primary:themes.light.primary}
              color={themes.dark.text}
              width={"100%"}
              fontSize={sizes.font.medium}
              icon={'megaphone'}
              iconSize={24}
              height={40}
              loading={loading}
            />
          </View>
        </View>
        </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
      position: 'absolute',
      bottom:0,
      left:0,
      right:0,
      alignItems: 'center',
      maxHeight: height * 0.7
    },
    modalContent: {
      backgroundColor: themes.dark.card,
      borderTopLeftRadius: sizes.layout.xLarge,
      borderTopRightRadius: sizes.layout.xLarge,
      padding: sizes.layout.medium,
      width: '100%',
      height:'100%'
    },
    mainContent:{
      borderRadius: sizes.layout.medium,
      backgroundColor: themes.dark.background,
      marginBottom:sizes.layout.medium,
      paddingHorizontal:sizes.layout.small,
      gap: sizes.layout.small
    },
    title: {
      fontSize: sizes.font.large,
      color: themes.dark.text,
      textAlign: "left",
      fontWeight:'500',
    },
    header:{
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: sizes.layout.medium,
    },
    pullDownButton: {
      position: 'absolute',
      top: 0, 
      alignSelf: 'center',
      zIndex: 2, // Ensure it's above other elements
    },
    pullDownNotch: {
      width: 60,
      height: sizes.layout.small,
      backgroundColor: themes.placeholder,
      borderColor:themes.dark.background,
      borderWidth:2,
      borderBottomRightRadius: sizes.layout.small,
      borderBottomLeftRadius: sizes.layout.small,
    },  
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom:sizes.layout.xSmall,
      marginHorizontal: 16,
      borderRadius:sizes.layout.medium,
    },  
    buttonContainer: {
        paddingVertical: sizes.layout.medium,
      },
});

export default BroadcastModal;
