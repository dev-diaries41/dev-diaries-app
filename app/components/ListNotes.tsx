import React, { useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { Note } from '../constants/types'; 
import { AnimatedFlashList } from '@shopify/flash-list';
import { sizes } from '../constants/layout';
import NoteCard from './NoteCard';
import { useSearchContext } from '../context/searchContext';
import { useNotesContext } from '../context/noteContext';

interface ListNotesProps {
  handleLoadMore: () => void;
  handleEditNote: (note: Note) => void;
}

const {height} = Dimensions.get('screen');
const ITEM_HEIGHT = (height / 8) - (sizes.layout.medium);

const ListNotes = ({
  handleLoadMore,
  handleEditNote,
}: ListNotesProps) => {
    const {myNotes} = useNotesContext();
    const {searchResults, query} = useSearchContext();
    const scrollY = useRef(new Animated.Value(0)).current;
    const renderNote = ({ item, index }: any) => {
        return (
            <NoteCard note={item} index={index} handleEditNote={handleEditNote}/>
        );
      };
  return (
      <AnimatedFlashList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={searchResults && query ? searchResults : myNotes}
        keyExtractor={(item: Note, index: number) => index.toString()}
        estimatedItemSize={ITEM_HEIGHT}
        renderItem={renderNote}
        getItemLayout={(data: any, index: number) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={true}
      />
  );
};

const styles = StyleSheet.create({
    notesContainer:{
      height: '100%',
      position:'absolute',
      left:0,
      right:0,
      verticalAlign:'top',
      marginBottom: 'auto',
      paddingTop: sizes.layout.large,
  
    },
  });

export default ListNotes;
