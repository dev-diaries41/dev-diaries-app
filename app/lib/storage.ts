import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing'
import { Platform, Share } from 'react-native';
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tag, Settings, Note, CreateType } from '../constants/types';
import CryptoJS from "react-native-crypto-js";
import * as Crypto from 'expo-crypto'
import { sortNotesByLastModified, sortTasksOnTop } from './sort';


export const downloadFromUrl = async (url: string) => {
  const filename = `IMG_${Date.now()}`;
  const result = await FileSystem.downloadAsync(
    url,
    FileSystem.documentDirectory + filename
  );

  return save(result.uri, filename, result.headers["Content-Type"]);
};

export async function downloadBase64Image(base64String: string) {
  try {
    // Create a directory for the downloaded images if it doesn't exist
    const directory = `${FileSystem.documentDirectory}images/`;
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    const filename = `POST_${Date.now()}`

    const filePath = `${directory}${filename}.png`; // Change the extension if needed
    await FileSystem.writeAsStringAsync(filePath, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return filePath; // Return the local URI of the downloaded image
  } catch (error) {
    console.error('Error downloading base64 image:', error);
    return null; // Return null if an error occurs
  }
}

export const save = async (uri:string, filename:string = `POST_${Date.now}`, mimetype:string) => {
  if (Platform.OS === 'android') {
    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype);
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        return { success: true, message: 'Image downloaded successfully' };
      } else {
        return { success: false, message: 'Permissions not granted' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  } else {
    shareAsync(uri);
    return { success: true, message: 'Sharing image' };
  }
};


export const shareFromUrl = async (url:string, title = 'Sharing Image') => {
  try {
    const shareOptions = {
      title: title,
      message: url
    };

    const iOSShareOptions = {
      title: title,
      url: url
    };

    if (Platform.OS === 'ios') {
      return await Share.share(iOSShareOptions);
    }
      return await Share.share(shareOptions);
  } catch (error) {
  }
};

export const shareNote = async (noteContent:string, title = 'Sharing Note') => {
  try {
    const shareOptions = {
      title: title,
      message: noteContent
    };

    const iOSShareOptions = {
      title: title,
      url: noteContent
    };

    if (Platform.OS === 'ios') {
      return await Share.share(iOSShareOptions);
    }
      return await Share.share(shareOptions);
  } catch (error) {
  }
};

export const saveSettings = async (settings: Partial<Settings>) => {
  try {
    const currentSettingsJSON = await AsyncStorage.getItem('settings');
    if(currentSettingsJSON){
      const currentSettings = currentSettingsJSON ? JSON.parse(currentSettingsJSON) : {};
      Object.entries(settings).forEach(([key, value]) => currentSettings[key] = value )
      await AsyncStorage.setItem('settings', JSON.stringify(currentSettings));
    }
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const saveTags = async(tags: Tag[]) => {
  try {
    await AsyncStorage.setItem('tags', JSON.stringify(tags));
  } catch (error) {
    console.error('Error saving tags:', error);
  }
}


const genEncryptionKey = () => Crypto.getRandomBytes(32).toString();
// Generate random encryption key and use it to encrypt note content
// Store key in secure store
export const encrypt = async(key: string, string: string) => {
   const encryptionKey = genEncryptionKey() 
   const encryptedString = CryptoJS.AES.encrypt(string, encryptionKey).toString();
   await SecureStore.setItemAsync(key, encryptionKey)
   return encryptedString;

}

// Read key from SecrureStore and decrypt note content
export const decrypt = async(key: string, encryptedString: string) => {  
  const encryptionKey = await SecureStore.getItemAsync(key);
  if(encryptionKey){
    const bytes  = CryptoJS.AES.decrypt(encryptedString, encryptionKey);
    const decryptString = bytes.toString(CryptoJS.enc.Utf8);
    return decryptString;
  }
  return null;
}

export const saveNote = async (note: Note) => {
  const directory = `${FileSystem.documentDirectory}notes/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

  // Create the metadata header
  const metadataHeader = 
  `---
  createdAt: ${note.createdAt}
  tag: ${note.tag}
  lastModified: ${note.lastModified}
  type: ${note.type}
  ---
  `;
  const markdownContent = `${note.title}\n\n${note.content}`;
  const encryptedMarkdownContent = await encrypt(note.id, markdownContent)
  const noteContent = `${metadataHeader}${encryptedMarkdownContent}`;
  const filePath = `${directory}${note.id}.md`;
  await FileSystem.writeAsStringAsync(filePath, noteContent);
};

const parseMetadata= (metadataContent: string): Partial<Note> => {
  const metadataLines = metadataContent.split('\n');
  const metadata: Partial<Note> = {};
  metadataLines.forEach(line => {
    const [key, value] = line.split(':').map(part => part.trim());
    if (key && value) {
      switch (key) {
        case 'createdAt':
        case 'lastModified':
          metadata[key] = parseInt(value, 10);
          break;
        case 'tag':
          metadata[key] = value;
          break;
        case 'type':
          metadata[key] = value as CreateType;
          break;
        default:
          console.warn(`Unrecognized metadata key: ${key}`);
      }
    }
  });
  return metadata;
}

const decryptNoteContent = async(noteId: string, encryptedMarkdownContent: string): Promise<string> =>{
  const decryptedContent = await decrypt(noteId, encryptedMarkdownContent);
  if (!decryptedContent) {
    throw new Error('Error decrypting note');
  }
  return decryptedContent;
}


const extractMetadata = async(fileContent: string, filename: string): Promise<{ metadata: Partial<Note>; content: string; title: string; }> =>{
  try {
    const endOfMetadataIndex = fileContent.indexOf('---', 3);
    const metadataContent = fileContent.substring(3, endOfMetadataIndex).trim();
    const contentStartIndex = endOfMetadataIndex + 3;

    // Parse metadata
    const metadata = parseMetadata(metadataContent);

    // Decrypt content
    const noteId = filename.replace('.md', '');
    const encryptedMarkdownContent = fileContent.substring(contentStartIndex).trim();
    const decryptedMarkdownContent = await decryptNoteContent(noteId, encryptedMarkdownContent);

    // Extract title and content
    const endOfTitleIndex = decryptedMarkdownContent.indexOf('\n\n');
    const title = decryptedMarkdownContent.substring(0, endOfTitleIndex).trim();
    const content = decryptedMarkdownContent.substring(endOfTitleIndex + 2).trim();
    
    return { metadata, content, title: title ? title.trim() : 'untitled' };
  } catch (error) {
    console.error('Error in extractMetadata:', error);
    throw error;
  }
}



const getNote = async(directory: string, filename: string) =>{
  try {
    const filePath = `${directory}/${filename}`;
    const fileContent = await FileSystem.readAsStringAsync(filePath);

    // Extract metadata, title, and content from the note file
    const { metadata, title, content } = await extractMetadata(fileContent, filename);

    return {
      id: filename.replace('.md', ''),
      title: title,
      content: content,
      createdAt: metadata.createdAt || Date.now(),
      lastModified: metadata.lastModified || Date.now(),
      tag: metadata?.tag || 'dev_diaries',
      type: metadata?.type || 'draft'
    };
  } catch (error) {
    console.error(`Error reading note ${filename}:`, error);
    return null;
  }
}

export const fetchNotesInBatch = async (startIndex: number, batchSize: number): Promise<Note[]> => {
  try {
    const directory = `${FileSystem.documentDirectory}notes/`;

    // Check if the directory exists
    const directoryExists = await FileSystem.getInfoAsync(directory);
    if (!directoryExists.exists) {
      return []; // Directory doesn't exist, return empty array
    }

    const files = await FileSystem.readDirectoryAsync(directory);
    const endIndex = files.length - startIndex; // dynamiically calculate the  end for top to bottom scrolling
    const startIndexAdjusted = Math.max(endIndex - batchSize, 0);   
    const selectedFiles = files.slice(startIndexAdjusted, endIndex);
    const notes: Note[] = [];

    for (const filename of selectedFiles.reverse()) {
      const note = await getNote(directory, filename)
      if (note) {
        notes.push(note)
      }
    }

    return sortNotesByLastModified(notes);
    // return notes;
  } catch (error) {
    console.error('Error fetching notes in batch:', error);
    return [];
  }
};


export const deleteNote = async (noteId: string): Promise<boolean> => {
  try {
    const directory = `${FileSystem.documentDirectory}notes/`;
    const filePath = `${directory}${noteId}.md`;

    const fileExists = await FileSystem.getInfoAsync(filePath);

    if (fileExists.exists) {
      await FileSystem.deleteAsync(filePath);
      return true; // Note deleted successfully
    } 
    
    console.warn(`Note with ID ${noteId} does not exist.`);
    return false; // Note doesn't exist, nothing to delete
  
  } catch (error) {
    console.error('Error deleting note:', error);
    return false; // Error occurred while deleting note
  }
};







