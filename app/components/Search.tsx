import React, { useEffect, useRef } from 'react';
import {View, TextInput,TouchableOpacity,StyleSheet,BackHandler,} from 'react-native';
import { useSearchContext } from '../context/SearchContext';
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../constants/layout';
import debounce from 'debounce';
import { Note, SearchProps } from '../constants/types';


const Search = ({
  notes, 
  placeholder = 'Search...', 
  backgroundColor =  'rgba(100, 100, 100, 0.5)',
  borderRadius= sizes.layout.xLarge,
  paddingHorizontal= sizes.layout.small,
  paddingVertical = sizes.layout.small,
  color = themes.dark.text,
}: SearchProps) => {
  const {query, setQuery, setSearchResults, setIsSearching} = useSearchContext();
  const searchInputRef = useRef<TextInput>(null);
  const userSearching = query !== '';
  const customizableStyles = {backgroundColor, borderRadius,paddingHorizontal, paddingVertical};

  // Allow the back button to clear the search bar (optional)
  useEffect(() => {
    const backAction = () => {
      if (userSearching) {
        handleCancel();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [userSearching]);

  
  const handleSearch = () => {
    try {
      const filtredNotes = notes.filter((note: Note) => note.title.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(filtredNotes);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Use debouncing to optimize search
  // This stops the handleSearch function being called for every keystroke
  const debouncedSearch = debounce(handleSearch, 500);

  const handleQueryChange = (text: string) => {
    setQuery(text);
  }

  const handleCancel = () => {
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    setQuery('')
    setSearchResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    if(notes.length > 0){
      debouncedSearch();
    }
  }, [query]);

  return (
    <View style={[styles.searchContainer, customizableStyles]}>
      <Ionicons name='search-outline' size={24} color={themes.placeholder} style={styles.icon}/>
      <TextInput
        ref={searchInputRef}
        style={[styles.searchInput, {color}]}
        placeholder={placeholder}
        placeholderTextColor={themes.placeholder}        
        value={query}
        onChangeText={(text) => handleQueryChange(text)}
      />
      <TouchableOpacity onPress={handleCancel} style={styles.icon}>
        <Ionicons name='close-circle' size={24} color={themes.placeholder}/>
      </TouchableOpacity>
  </View>
  );
  }  

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: themes.dark.text,
    height:20,
    width: '100%',
    marginLeft: sizes.layout.xSmall,

  },

  icon: {
    marginLeft: 'auto',
  },
});

export default Search;