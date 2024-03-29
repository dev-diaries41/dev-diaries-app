import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Keyboard } from 'react-native';
import { useNotesContext } from '../../context/noteContext';
import { useSettingsContext } from '../../context/settingsContext';
import { themes, sizes } from '../../constants/layout';
import { createFlashMsg, EmptyScreen, IconButton, DisplayModal, NotesModal, ListNotes } from '../../components';
import { Note, Tag } from '../../constants/types';
import { setTabLayout } from '../../lib/layout';
import { fetchNotesInBatch, deleteNote, saveTags } from '../../lib/storage';
import TerminalPath from '../../components/TerminalPath';
import { useSearchContext } from '../../context/searchContext';
import Search from '../../components/Search';


//Constants
const MAX_NOTES = 500;

const MyNotesScreen = ({navigation}: any) => {
  const {myNotes, tagFilter, tags, setTags, setTagFilter, setMyNotes} = useNotesContext();
  const {isSearching, setIsSearching} = useSearchContext();
  const [loadedAllNotes, setLoadedAllNotes] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note|null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectingTag, setSelectingTag] = useState(false);
  const {theme} = useSettingsContext();
  const {showMessage, FlashMessage} = createFlashMsg();
  const darkTheme = theme === 'dark';


  useLayoutEffect(() => {
    setTabLayout(darkTheme, navigation)
    if(isSearching){
      navigation.setOptions({
        headerRight: () => (
         <View style={[styles.searchBar]}>
          <Search 
            notes={myNotes}
            color={darkTheme? themes.dark.text: themes.light.text}
            backgroundColor={darkTheme? themes.dark.card: themes.light.card}
          />
         </View>
        ),
      })
    }else{
      navigation.setOptions({
        headerRight: () => (
         <View style={styles.navRowButtons}>
           <View style = {styles.tagContainer}>
           <TerminalPath
             onPress={toggleSelectTag}
             color={tagFilter?.tagName === 'tasks'? themes.colors.darkBlue:(darkTheme ? themes.dark.primary : themes.light.primary)}
             fontSize={sizes.font.medium}
             icon={'chevron-down'}
             iconSize={18}
             buttonText={tagFilter? `/${tagFilter.tagName}` : '/dev_diaries'}
             darkTheme={darkTheme}
           />        
           </View>
           <IconButton icon={"search"} onPress={() => setIsSearching(true)} color={darkTheme ? themes.dark.icon : themes.light.icon}/>
       </View>
        ),
      })
    }

 }, [theme, tagFilter, isSearching])

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


  const toggleSelectTag = () => setSelectingTag(true)

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  }

  const onEndEditing = () => {
    setIsEditing(false);
    setSelectedNote(null);
  }

  // dev_diaries === all
  const onSelectTag = (tag: Tag) => setTagFilter(tag.tagName=== 'dev_diaries'? null : tag)
  
  const handleDeleteNote = async(noteToDelete : Note | null) => {
    try{
      if(!noteToDelete){throw new Error('A valid note was not selected to delete')}
      const filteredNotes = myNotes.filter(note => note.id !== noteToDelete.id )
      setMyNotes(filteredNotes)
      const isDeleted = await deleteNote(noteToDelete.id);
      if(!isDeleted) {showMessage('Note note deleted', false)}
    }catch(error){
      console.error('Error in deleteNote: ', error)
    }finally{
      onEndEditing();
    }
  }


  const handleLoadMore = async() => {
    // Early returning if all notes loaded or no notes
    if(loadedAllNotes || myNotes.length <= 0){return}
    try{
      //Early exit if no notes
      const startIndex = (myNotes.length)
      const loadedNotes = await fetchNotesInBatch(startIndex, 20);

      // Early returning if no loaded notes
      if(loadedNotes.length === 0){
        return setLoadedAllNotes(true)
      }

      // Check if adding loadedNotes will exceed the max threshold
      // if so, remove notesToRemoveCount notes from the beginning of myNotes
      // If adding loadedNotes doesn't exceed the max threshold, simply concatenate loadedNotes
      setMyNotes((prevNotes: Note[]) => {
        let updatedNotes: Note[];
        if (prevNotes.length + loadedNotes.length > MAX_NOTES) {
          const notesToRemoveCount = prevNotes.length + loadedNotes.length - MAX_NOTES;
          updatedNotes = [ ...prevNotes.slice(notesToRemoveCount), ...loadedNotes];
        } else {
          updatedNotes = [ ...prevNotes, ...loadedNotes];
        }
      
        return updatedNotes;
      });   
    }catch(error){
      console.error('Error in handleLoadMore: ', error)
    }
 
  }

  const deleteTag = async(tagToDelete: Tag) => {
    const updatedTags = tags.filter(tag => tag.tagName !== tagToDelete.tagName);
    setTags(updatedTags);
    await saveTags(updatedTags);
  }
      
  if(myNotes.length === 0){
    return (
      <SafeAreaView style = {[styles.container, {backgroundColor: darkTheme? themes.dark.background: themes.light.background}]}>
        <EmptyScreen text='Notes' description='No notes were found' icon='document'/>
      </SafeAreaView>
    )
  }

  return (
  <SafeAreaView style = {[styles.container, {
    backgroundColor: darkTheme? themes.dark.background: themes.light.background,
    paddingBottom: isKeyboardVisible? 0: 60
  }
    ]}>  
    {/* Before adding React.memo analyse performance metrics to see the difference if any*/}
    <View style={[styles.notesContainer, { opacity: selectingTag ? 0.3 : 1 }]}> 
    <ListNotes
      handleEditNote={handleEditNote}
      handleLoadMore={handleLoadMore}
      />
    </View>
    <FlashMessage/>
    <DisplayModal 
      visible={selectingTag}
      onClose={()=>setSelectingTag(false)}
      onTagSelect={onSelectTag}
      deleteTag={deleteTag}
      title='Select Tag'
      contentBackground={darkTheme? themes.dark.card:themes.light.card}
      textColor={darkTheme? themes.dark.text:themes.light.text}
      />
    <NotesModal 
      visible={isEditing}
      onClose={onEndEditing}
      handleDeleteNote={handleDeleteNote}
      note={selectedNote}
      title='Edit Note'
      contentBackground={darkTheme? themes.dark.card:themes.light.card}
      textColor={darkTheme? themes.dark.text:themes.light.text}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.dark.background,
    padding: sizes.layout.small,
  },
  notesContainer:{
    height: '100%',
    position:'absolute',
    left:0,
    right:0,
    verticalAlign:'top',
    marginBottom: 'auto',
    paddingTop: sizes.layout.large,

  },
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-between",
    alignItems:'center',
    marginHorizontal: sizes.layout.medium,
    gap:sizes.layout.medium
  },
  buttonContainer: {
    marginTop: sizes.layout.medium,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  label: {
    fontSize: sizes.font.medium,
    color: themes.placeholder,  
  },
  tagContainer:{
    justifyContent:"flex-start",
    alignItems:'flex-start',
    maxHeight:50,
    borderColor: '#333',
    borderWidth:1,
    borderRadius: sizes.layout.medium,
    paddingHorizontal: sizes.layout.small,
    width:'auto'
  },
  searchBar:{
    flex: 1,
    justifyContent:"center",
    alignItems:'center',
    marginEnd: sizes.layout.small,
  }
});
export default MyNotesScreen;
