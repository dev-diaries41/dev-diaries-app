import React, {useRef, useLayoutEffect} from 'react';
import { View, Text, Modal, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { DisplayModalProps, Note } from '../constants/types';
import { useNotesContext } from '../context/NoteContext';
import TextWithIconButton from './TextWithIconButton';
import IconButton from './IconButton';
import { shareNote } from '../lib/storage';

const {height} = Dimensions.get('screen')

interface NotesModalProps extends Omit<DisplayModalProps, 'onTagSelect' | 'deleteTag'> {
  handleDeleteNote: (note: Note | null) => void,
  note: Note | null;
}

const NotesModal = ({ 
  visible, 
  onClose,
  title,
  contentBackground = themes.dark.card,
  textColor = themes.dark.text,
  handleDeleteNote,
  note
}: NotesModalProps) => {

  const {setAddingTag, tags} = useNotesContext()
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

  // May not work on iOS
  const handleShare = async() => {
    if(note){
      await shareNote(note.content)
      onClose();
    }
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
            <IconButton icon={"close-circle"} onPress={onClose} color={textColor} opacity={0.5}/>
          </View>
          <View style={[styles.mainContent, {backgroundColor:contentBackground}]}>
            <View style={styles.rowContainer}>
              <TextWithIconButton buttonText='Delete' icon={"trash"} onPress={() => handleDeleteNote(note)} color={textColor} justifyContent='flex-start' iconColor={themes.colors.red}/>
            </View>
            <View style={styles.rowContainer}>
              <TextWithIconButton buttonText='Share' icon={"share-social"} onPress={handleShare} color={textColor} justifyContent='flex-start'iconColor={themes.dark.primary}/>
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

export default NotesModal;
