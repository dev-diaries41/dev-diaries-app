import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions} from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';

const {width} = Dimensions.get('screen');
let timeoutId: NodeJS.Timeout | null;

const createFlashMsg = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(themes.dark.card);
  const [successMsg, setSuccessMsg] = useState(false);


  const showMessage = (alertMessage: string, success: boolean, alertBackgroundColor?: string, timeout = 2000) => {
    setMessage(alertMessage);
    if(alertBackgroundColor){
      setBackgroundColor(alertBackgroundColor);
    }
    setSuccessMsg(success)
    setVisible(true);

    timeoutId = setTimeout(() => closeModal(), timeout);
  };

  const closeModal = () => {
    setVisible(false);
    setMessage('');
    if(timeoutId){
      clearTimeout(timeoutId)
    }
    timeoutId = null;
  };

  return {
    showMessage,
    FlashMessage: () => (
      <Modal visible={visible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
              <Ionicons name={'notifications-circle'} size={24} color={successMsg ? themes.colors.green :  themes.colors.red} />
              <Text style={styles.modalMessage}>{message}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    ),
  };
};


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent:'flex-end',
      alignItems:'center',
      position:'absolute',
      bottom:80,  // account for bottom tab navigator
      left:0,
      right:0,
      marginBottom: sizes.layout.small
    },
    modalContent: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: sizes.layout.large,
        maxWidth: '100%',
        padding: sizes.layout.small,
        paddingHorizontal:sizes.layout.medium,
        height:'auto'
    },
    modalMessage: {
      fontSize: sizes.font.medium,
      marginLeft: sizes.layout.small, // or another suitable value
      color: themes.dark.text,
      textAlign: "center",
    },
    
  });
  

export default createFlashMsg;
