import { CreateType, Note } from "./types";
import * as Crypto from 'expo-crypto'

export const PLACEHOLDER_NOTES = Array.from({length: 50}, (_, index: number): Note => (
    {   id: Crypto.randomUUID(),
        title: `title ${index + 1}`,
        content: `This is a test note lets see how it looks mate ${index + 1}`, 
        tag: 'dev_diaries', 
        createdAt: Date.now(),
        lastModified: Date.now(),
        type:'text'
    }
  ));

