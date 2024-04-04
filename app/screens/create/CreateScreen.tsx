import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import {View, SafeAreaView, StyleSheet, StatusBar, ScrollView, Text, Alert} from 'react-native';
import {useSettingsContext } from '../../context/SettingsContext';
import {themes, sizes, TAB_HEIGHT } from '../../constants/layout';
import {InputField, DisplayModal, DialogueAlert, Button, IconButton, MarkedDownView, createFlashMsg, BroadcastModal } from '../../components';
import {downloadBase64Image, saveNote, saveTags } from '../../lib/storage';
import {hideTabBar, setTabLayout } from '../../lib/layout';
import {CreateType, NotifyConfig, Tag } from '../../constants/types';
import { getButtonColor, getButtonIcon, getButtonText, isMaxCharacters, notify, quotePost } from '../../lib/create';
import { useNotesContext } from '../../context/NoteContext';
import * as Crypto from 'expo-crypto'
import { TextInput } from 'react-native-gesture-handler';
import TerminalPath from '../../components/TerminalPath';
import CreateModal from '../../components/CreateModal';
import debounce from 'debounce';
import { useTabLayout } from '../../context/TabLayoutContext';
import { useHideKeyboard } from '../../hooks/useHideKeyboard';

const CreateScreen = ({navigation}: any) => {
  const {theme, quotePostSettings, broadcastSettings} = useSettingsContext();
  const {viewMode, setViewMode, selectedTag, setSelectedTag, addingTag, setAddingTag, tags, setTags, myNotes, setMyNotes, currentOpenedNote, setCurrentOpenedNote} = useNotesContext();
  const {setShouldHideTabBar} = useTabLayout();
  const {isKeyboardVisible} = useHideKeyboard();

  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [type, setType] = useState<CreateType>('text');
  const [noteError, setNoteError] = useState('')
  const [selectingTag, setSelectingTag] = useState(false);
  const [initiateBroadcast, setInitiateBroadcast] = useState(false)
  const [viewCreateOptions, setViewCreateOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const darkTheme = theme === 'dark';
  const maxChars = isMaxCharacters(type, noteContent)
  const autoSave = (!!title || !!noteContent) && (currentOpenedNote?.content !== noteContent || currentOpenedNote?.title !== title);
 
  const memoizedButtonText = useMemo(() => getButtonText(type), [type]);
  const memoizedButtonColor = useMemo(() => getButtonColor(type), [type]);
  const memoizedButtonIcon = useMemo(() => getButtonIcon(type), [type]);
  const {showMessage, FlashMessage} = createFlashMsg();

  // Hnadle UI changes when the component mounts
  useLayoutEffect(() => {
    if(viewMode){
      hideTabBar(navigation)
    }else{
      setTabLayout(darkTheme, navigation)
    }

    navigation.setOptions({
     headerRight: () => (
       <View style={styles.navRowButtons}>
         <View style = {styles.tagContainer}>
         <TerminalPath
           onPress={toggleSelectTag}
           color={selectedTag?.tagName === 'tasks'? themes.colors.darkBlue:(darkTheme ? themes.dark.primary : themes.light.primary)}
           fontSize={sizes.font.medium}
           icon={'chevron-down'}
           iconSize={18}
           buttonText={selectedTag? `/${selectedTag.tagName}` : '/dev_diaries'}
           darkTheme={darkTheme}
           />       
         </View>
         <IconButton icon={"ellipsis-vertical"} onPress={handleViewCreateOptions} color={darkTheme ? themes.dark.icon : themes.light.icon}/>
     </View>
      ),
   })
 }, [theme, selectedTag, viewMode])

  // Handle opened notes
  useLayoutEffect(() => {
    if(currentOpenedNote){
      setNoteContent(currentOpenedNote.content)
      setTitle(currentOpenedNote.title)
      setSelectedTag({tagName: currentOpenedNote.tag || 'dev_diaries'})
    }
  }, [currentOpenedNote]);
 
// Close note on screen exit
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      const closeNote = () => {
        setSelectedTag(null)
        setCurrentOpenedNote(null)
        setNoteContent('');
        setTitle('');
        setViewMode(false)
      }
      closeNote();
  });

  return unsubscribe;
}, [navigation]);


  const handleSaveOpenedNote = async() => {
    try{
      if(currentOpenedNote){
        const openedNote = {
          id: currentOpenedNote?.id,
          content: noteContent, 
          type: type, 
          tag: selectedTag?.tagName || currentOpenedNote?.tag, 
          createdAt: currentOpenedNote?.createdAt,
          lastModified: Date.now(),
          title: title === ''? '# Untitled' : (title.includes('#')? title : `# ${title}`)   // ensure md format
        }
        const index = myNotes.findIndex(note => note.id === currentOpenedNote.id);
        // Update the notes array with the new note at the top
        // Place the new note at the beginning
        // Include previous notes before currentOpenedNote (if any)
        // Include notes after currentOpenedNote
        if (index !== -1) {
          const updatedNotes = [
            openedNote, 
            ...myNotes.slice(0, index), 
            ...myNotes.slice(index + 1) 
          ];
          setMyNotes(updatedNotes);
        }
        await saveNote(openedNote)

    }
    }catch(error){
      console.error('Error in handleSaveOpenedNote: ', error)
      throw error
    }
  }

  const handleSaveNewNote = async() => {
    try{
      const newNote = {
        id: Crypto.randomUUID(),
        content: noteContent, 
        type: type, 
        tag: selectedTag?.tagName || 'dev_diaries', 
        createdAt: Date.now(),
        lastModified: Date.now(),
        title: title === ''? '# Untitled' : (title.includes('#')? title : `# ${title}`)   // ensure md format
      }

        setMyNotes(prevNotes => [newNote, ...prevNotes]);
        await saveNote(newNote)
        setCurrentOpenedNote(newNote)

    }catch(error){
      console.error(`Error in handleSaveNewNote: `, error)
      throw error
    }
  }

  const handleSaveNote = async() => {
    if(currentOpenedNote){
      return await handleSaveOpenedNote();
    }
    await handleSaveNewNote();
  }

  const debouncedHandleSaveNote = debounce(handleSaveNote, 500, {immediate:false})

  // Auto save note when new content and if it type 'text'
  useEffect(() => {
    if(autoSave && type === 'text'){
      debouncedHandleSaveNote();
    }
  }, [ noteContent,title, type]);
  
  const handleNewQuote = async() => {
    try{
      setLoading(true);
      const base64 = await quotePost({...quotePostSettings, ...{postText: noteContent}})
      const filePath = await downloadBase64Image(base64.newPost)
      setNoteContent('');
      setShouldHideTabBar(true);
      navigation.navigate('View Media', {url: filePath})
    }catch(error){
      console.error('Error in handleNewQuote: ', error)
    }finally{
      setLoading(false)
    }
  }

  const handleInitiateBroadcast = () => {
    setInitiateBroadcast(true)
  }

  const handleNewBroadcast = async(recipients: NotifyConfig[]) => {
    setLoading(true)
    try{
      const data = await notify(recipients, noteContent);
      if(!data.success){
        return showMessage('Broadcast failed', false)
      }
      await handleSaveNewNote();
      showMessage('Broadcast sent', true)
      setNoteContent('')
      setTitle('');
    }catch(error){
      console.error('Error in handleNewBroadcast: ', error)
    }finally{
      setLoading(false)
    }
  }

  const handleNoteChange = (text: string) => {
    setNoteContent(text);
    debouncedHandleSaveNote.clear()  //clear pending function calls to save
  }

  const handleTitleChange = (text: string) => {
    setTitle(text);
    debouncedHandleSaveNote.clear()  
  }

  const toggleSelectTag = () => setSelectingTag(!selectingTag)

  const onSelectTag = (tag: Tag) =>  setSelectedTag(tag)

  // /* Handle create modes */
  const handleViewCreateOptions = () => setViewCreateOptions(!viewCreateOptions)

  const handleCreateNote = () => {
    setType('text')
    setViewCreateOptions(false)
  }

  const handleCreateQuotePost = () => {
    if(!process.env.NEW_POST_URL){
      return Alert.alert('Pro feautre', 'Cannot use pro-feature without API key')
    }
    setType('quote')
    setViewCreateOptions(false)

  }

  const handleCreateBroadcast = () => {
    if(!process.env.NOTIFY_URL){
      return Alert.alert('Pro feautre', 'Cannot use pro-feature without API key')
    }
    setType('broadcast')
    setViewCreateOptions(false)
  }

  const handleCreateImage = () => {
    if(!process.env.CREATE_IMAGE_URL){
      return Alert.alert('Pro feautre', 'Cannot use pro-feature without API key')
    }
    setViewCreateOptions(false)
    setShouldHideTabBar(true)
    navigation.navigate('Create Image', {shouldHideTab: true})

  }

  const handleAddTag = async (tagName: string) => {
    try{
      if(!tagName){
        throw new Error('Missing tag name')
      }
      setTags((prevTags: Tag[]) => [...prevTags, {tagName}])
      await saveTags([...tags, {tagName}])  // use object instead of string incase i decide to add metadata to tag {tagName, metadata}
    }catch(error){
      console.error('Error adding tag: ', error)
    }
 
  }

  const deleteTag = async(tagToDelete: Tag) => {
    const updatedTags = tags.filter(tag => tag.tagName !== tagToDelete.tagName);
    setTags(updatedTags);
    await saveTags(updatedTags);
  }

  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: darkTheme? themes.dark.background: themes.light.background,}]}>
      <StatusBar backgroundColor="transparent" barStyle={darkTheme? 'light-content':'dark-content'} translucent />
      {viewMode? (
      <MarkedDownView 
        noteContent={`${title}\n\n${noteContent}`} 
        darkTheme={darkTheme} 
        color={darkTheme? themes.dark.text: themes.light.text}/>
      ):(
      <ScrollView contentContainerStyle={{flex:1, height: "100%", width: "100%", opacity: (selectingTag||addingTag)? 0.3:1}}>
        <View style = {{height:'100%'}}>
        {type !=='text' && 
        <View style={[styles.rowContainer]}>
          <Text style={[styles.label, {color: maxChars? themes.colors.red: themes.placeholder},]}>
            {`Characters: ${noteContent.length} /${type === 'broadcast'? 4096 : 300}`}
          </Text>
            <Button
              onPress={type === 'broadcast'? handleInitiateBroadcast: handleNewQuote}
              text={memoizedButtonText}
              backgroundColor={memoizedButtonColor}
              loading={loading}
              color={themes.dark.text}
              width={"auto"}
              fontSize={sizes.font.small}
              icon={memoizedButtonIcon}
              iconSize={16}
              height={40}
              disabled={loading || !noteContent || maxChars}
              />
        </View>
        }
        { (type === 'text' ||  type === 'broadcast') && 
        <TextInput
            placeholder={'Title'}
            value={title}
            onChangeText={handleTitleChange}
            style={[styles.titleInput, {opacity: 1, color:darkTheme? themes.dark.text: themes.light.text}]}
            placeholderTextColor={darkTheme? themes.dark.text: themes.light.text}        
            secureTextEntry={false}
            scrollEnabled
            textAlignVertical={'top'}
            multiline = {true}
          />
          }
          <InputField
            value={noteContent}
            onChangeText={handleNoteChange}
            error={!!(!noteContent && noteError)}
            placeholder={`Whats on your mind...? 💭`}
            errorText={noteError}
            multiline={true}
            color={darkTheme? themes.dark.text: themes.light.text}
            maxHeight={"100%"}
            minHeight={"100%"}
            fontSize={sizes.font.large}
            paddingBottom={ isKeyboardVisible? TAB_HEIGHT : TAB_HEIGHT + 50}
          />
        </View>
      </ScrollView>
      )}
      <DisplayModal 
        visible={selectingTag}
        onClose={()=>setSelectingTag(false)}
        onTagSelect={onSelectTag}
        deleteTag={deleteTag}
        title='Select Tag'
        contentBackground={darkTheme? themes.dark.card:themes.light.card}
        textColor={darkTheme? themes.dark.text:themes.light.text}
        />
      <CreateModal 
        visible={viewCreateOptions}
        onClose={()=>setViewCreateOptions(false)}
        handleCreateImage={handleCreateImage}
        handleCreateNote={handleCreateNote}
        handleCreateQuotePost={handleCreateQuotePost}
        handleCreateBroadcast={handleCreateBroadcast}
        title='Create'
        contentBackground={darkTheme? themes.dark.card:themes.light.card}
        textColor={darkTheme? themes.dark.text:themes.light.text}
        />
      <BroadcastModal 
        visible={initiateBroadcast}
        onClose={()=>setInitiateBroadcast(false)}
        sendBroadcast={handleNewBroadcast}
        title='Broadcast'
        contentBackground={darkTheme? themes.dark.card:themes.light.card}
        textColor={darkTheme? themes.dark.text:themes.light.text}
        loading={loading}
        />
      <DialogueAlert
        visible={addingTag}
        onConfirm={handleAddTag}
        onClose={() => setAddingTag(false)}
        title='Add Tag'
        description='Add a new tag for your notes'     
        />
        <FlashMessage/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: sizes.layout.small,
    position:'relative',
  },
  label: {
    fontSize: sizes.font.small,
    color: themes.dark.text,
    marginLeft: 8
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent:'flex-end',
    marginBottom:8
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:sizes.layout.medium,
    marginHorizontal:'auto'
  },
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-evenly",
    alignItems:'center',
    marginHorizontal: sizes.layout.medium,
    gap:sizes.layout.medium
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
  titleInput: {
    padding: sizes.layout.small,
    marginBottom:sizes.layout.xSmall,
    fontWeight:'500',    
    maxWidth: "100%",
    maxHeight:'50%',
    fontSize: sizes.font.xLarge,
  },
});
export default CreateScreen;
