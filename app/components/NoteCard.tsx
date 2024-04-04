import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { useSettingsContext } from '../context/SettingsContext';
import { NoteCardProps } from '../constants/types';
import { useNavigation } from '@react-navigation/native';
import { useNotesContext } from '../context/NoteContext';
import { formatTimeElapsed } from '../lib/create';
import IconButton from './IconButton';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('screen');
const ITEM_HEIGHT = height / 8 - (sizes.layout.medium);

const NoteCard = ({note, index, handleEditNote}: NoteCardProps) => {
  const { theme } = useSettingsContext();
  const {tagFilter, setCurrentOpenedNote, setViewMode} = useNotesContext();
  const navigation = useNavigation();
  const { content, tag, title, lastModified, type  } = note
  const darkTheme = theme === 'dark';

  if(tagFilter && tagFilter.tagName !== tag){return null}


const handleNotePress = () => {
    setCurrentOpenedNote(note)
    setViewMode(true)
    navigation.navigate('Create') //ignore this error
}
  return (
    <>
      <View
        style={[styles.cardContainer, { borderColor: darkTheme ? themes.dark.border : themes.light.border}]}
      >
        <TouchableOpacity onPress={handleNotePress} onLongPress={()=>handleEditNote(note)}>
          <View style={styles.cardContent}>
            <View style={[styles.rowContainer, { justifyContent: 'space-between' }]}>
              <View style={[styles.rowContainer, {gap: sizes.layout.small, marginBottom: sizes.layout.xSmall}]}>
                <Text numberOfLines={2} style={[styles.tag, { color: tag === 'tasks'? themes.colors.darkBlue:(darkTheme ? themes.dark.primary : themes.light.primary) }]}>
                  {`@${tag}`}
                </Text>
                <Text style={[styles.text, { color: darkTheme ? themes.dark.text : themes.light.text, opacity:0.5}]} numberOfLines={1}>
                {/* {new Date(lastModified).toLocaleString()} */}
                {formatTimeElapsed(lastModified)}
                </Text> 
               {type === 'broadcast' && <Ionicons name={'megaphone'} size={18} color={darkTheme ? themes.dark.icon : themes.light.icon} style={styles.typeTag}/>}
              </View>
              <View style={styles.navRowButtons}>
                <IconButton size={18} icon={"ellipsis-vertical"} onPress={()=>handleEditNote(note)} color={darkTheme ? themes.dark.icon : themes.light.icon}/>
              </View>
            </View>
            <View style={[styles.noteTextContainer]}>
              <Text style={[styles.title, { color: darkTheme ? themes.dark.text : themes.light.text }]}>
              {title.replaceAll('#', '').trim()}
              </Text>
            </View>
            <View style={[styles.noteTextContainer]}>
              <Text numberOfLines={5} ellipsizeMode='tail' style={[styles.text, { color: darkTheme ? themes.dark.text : themes.light.text, fontSize: sizes.font.medium, opacity:0.9 }]}>
              {content}
              </Text>
            </View>
            </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position:'relative',
    paddingHorizontal: sizes.layout.medium,
    paddingVertical: sizes.layout.medium,
    minHeight: ITEM_HEIGHT,
    borderBottomColor: themes.borderColor,
    borderBottomWidth: 1,
  },
  cardContent: {
    borderRadius: sizes.layout.medium,
    gap: sizes.layout.xSmall,
  },
  tag: {
    fontSize: sizes.font.small,
    color: themes.dark.text,
    overflow: 'hidden',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: sizes.font.small,
    color: themes.dark.text,
  },
  title: {
    fontSize: sizes.font.large,
    color: themes.dark.text,
    marginBottom: sizes.layout.small,
    fontWeight:'bold'
  },
  noteTextContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-evenly",
    alignItems:'center',
    gap:sizes.layout.small
  },
  typeTag: {
    opacity: 0.7, 
    padding: sizes.layout.small,
    borderRadius: sizes.layout.medium,
    marginLeft: sizes.layout.small
  }
});

export default NoteCard;
