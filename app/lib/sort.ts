import { Note } from "../constants/types";

export const sortTasksOnTop = (notes: Note[]) => {
  const tasks = notes.filter(note => note.tag === 'tasks');
  const nonTasks = notes.filter(note => note.tag !== 'tasks');
  return [...tasks, ...nonTasks];
};


export const sortNotesByLastModified = (notes: Note[]) => {
  return notes.slice().sort((a, b) => a.lastModified - b.lastModified);
};