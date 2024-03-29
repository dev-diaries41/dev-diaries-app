import React, {useRef, useLayoutEffect} from 'react';
import { View, Text, Modal, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { DisplayModalProps, Note } from '../constants/types';
import TextWithIconButton from './TextWithIconButton';
import IconButton from './IconButton';

const {height} = Dimensions.get('screen')

interface CreateModalProps extends Omit<DisplayModalProps, 'onTagSelect' | 'deleteTag'> {
  handleCreateNote: () => void;
  handleCreateQuotePost: () => void;
  handleCreateImage: () => void;
  handleCreateBroadcast: () => void;
}

const CreateModal = ({ 
  visible, 
  onClose,
  title,
  contentBackground = themes.dark.card,
  textColor = themes.dark.text,
  handleCreateImage,
  handleCreateQuotePost,
  handleCreateNote,
  handleCreateBroadcast
}: CreateModalProps) => {

  const panY = useRef(new Animated.Value(0)).current; // Start the modal off-screen

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
          onClose();
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
            <IconButton icon={"close-circle"} onPress={onClose} color={textColor} opacity={0.5}/>
          </View>
          <View style={[styles.mainContent, {backgroundColor:contentBackground}]}>
          <View style={styles.rowContainer}>
              <TextWithIconButton buttonText='Create Note' icon={"document"} onPress={handleCreateNote}  color={textColor} justifyContent='flex-start' iconColor = {themes.dark.primary}/>
            </View>
            <View style={styles.rowContainer}>
              <TextWithIconButton buttonText='Create Image' icon={"image"} onPress={handleCreateImage}  color={textColor} justifyContent='flex-start' iconColor = {themes.dark.primary}/>
            </View>
            <View style={styles.rowContainer}>
              <TextWithIconButton buttonText='Create Quote Post' icon={"chatbox"} onPress={handleCreateQuotePost} color={textColor} justifyContent='flex-start' iconColor = {themes.dark.primary}/>
            </View>
            <View style={styles.rowContainer}>
              <TextWithIconButton buttonText='Create Channel Broadcast' icon={"megaphone"} onPress={handleCreateBroadcast} color={textColor} justifyContent='flex-start' iconColor = {themes.dark.primary}/>
            </View>
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
      marginBottom:sizes.layout.small,
      borderRadius:sizes.layout.medium,
    },  
});

export default CreateModal;
