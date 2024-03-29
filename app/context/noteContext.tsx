import React, { createContext, useState, useContext } from 'react';
import { Tag, Note, NotesContextProps, NotesProps } from '../constants/types';

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

const NotesProvider  = ({ children, currentTags, initialNotes }: NotesProps) => {
  const [myNotes, setMyNotes] = useState<Note[]>(initialNotes)
  const [selectedTag, setSelectedTag] = useState<Tag | null>({tagName: 'dev_diaries'});
  const [tags, setTags] = useState<Tag[]>(currentTags);
  const [addingTag, setAddingTag] = useState<boolean>(false);
  const [tagFilter, setTagFilter] = useState<Tag | null>(null)
  const [currentOpenedNote, setCurrentOpenedNote] = useState<Note | null>(null)
  const [viewMode, setViewMode] = useState(false)



  return (
    <NotesContext.Provider value={{ 
      selectedTag,
      setSelectedTag,
      addingTag,
      setAddingTag,
      tags,
      setTags,
      myNotes, 
      setMyNotes,
      tagFilter, 
      setTagFilter,
      currentOpenedNote, 
      setCurrentOpenedNote,
      viewMode, 
      setViewMode
      }}>
      {children}
    </NotesContext.Provider>
  );
};

// Hook for using the NotesContext
const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};

export { NotesContext, NotesProvider, useNotesContext };
