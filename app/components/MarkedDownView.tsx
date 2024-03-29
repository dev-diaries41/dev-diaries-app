import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { sizes, themes } from '../constants/layout';
import { useNotesContext } from '../context/noteContext';
import IconButton from './IconButton';

interface MarkedDownViewProps {
    noteContent: string,
    darkTheme?: boolean;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
}

const MarkedDownView = ({
    noteContent,
    darkTheme = true,
    fontSize = sizes.font.large,
    color = themes.dark.text,
    backgroundColor = darkTheme? themes.dark.card : themes.light.card,

}: MarkedDownViewProps) => {
    const {setViewMode} = useNotesContext()
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.mdView}
          showsVerticalScrollIndicator={false}
        >
        <Markdown
            style={{
            body: {color: color, fontSize: fontSize, padding: sizes.layout.small},
            heading1: {color: color, fontSize: fontSize * 1.5, fontWeight: 'bold'},
            heading2: {color: color, fontSize: fontSize * 1.3},
            blockquote: {color, fontSize, backgroundColor: backgroundColor},
            code_block: {color, fontSize, backgroundColor: backgroundColor},
            table: {color, fontSize, borderColor: themes.light.icon, borderWidth: 2},
            tbody: {color, fontSize, borderColor: color, backgroundColor},
            }}
            >
            {noteContent}
          </Markdown>
        </ScrollView>
        <View style={[styles.viewModeButtonContainer, {
            backgroundColor: darkTheme? themes.dark.primary : themes.light.primary,
            borderColor: darkTheme? themes.dark.primary : themes.light.primary,

            }]}>
          <IconButton
            onPress={()=>setViewMode(false)}
            color={darkTheme? themes.dark.icon : themes.light.icon}
            icon={'pencil'}
            size={30}
          />
        </View>
      </SafeAreaView>
    </>
  );
};


const styles = StyleSheet.create({
    container: { 
      flex: 1,
      padding: sizes.layout.small,
      position:'relative',
    },
    viewModeButtonContainer:{
      position:'absolute',
      bottom:60,
      right: 16,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:30,
      borderWidth:2,
      height:60,
      width:60,
      opacity:0.8,
      elevation: 4,
      shadowColor: themes.light.text,
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: sizes.layout.medium,
    },
    mdView:{
      height: '100%',
      paddingBottom: sizes.layout.small
    }
  
  
   
  });
export default MarkedDownView;