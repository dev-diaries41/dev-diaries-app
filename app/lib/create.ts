import { Time } from "../constants/defaultSettings";
import { themes } from "../constants/layout";
import { DrawTextParams, CreateType } from "../constants/types";

export const post = async(message: string, chatId?: string | number) => {
    const notificationsUrl = process.env.NOTIFY_URL || '';
    try{
        const reqBody = {message, chatId}
        const response = await fetch(notificationsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'api-key':  process.env.EWAY_API_KEY || ''
          },
          body: JSON.stringify(reqBody),
        });
        const data = await response.json()
        return data;

    }catch(error: any){
        console.error('Error in notify: ', error.response.data.error)
        return null;
    }
}

export const quotePost = async(postOptions: DrawTextParams) => {
  const newMediaPostUrl = process.env.NEW_POST_URL || '';
  try{
      const reqBody = {postOptions}
      const response = await fetch(newMediaPostUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'api-key':  process.env.EWAY_API_KEY || ''
        },
        body: JSON.stringify(reqBody),
      });
      const data = await response.json()
      return data;

  }catch(error: any){
      console.error('Error in notify: ', error.response.data.error)
      return null;
  }
}

export const formatTimeElapsed = (timestamp: number) => {
  const currentTime = Date.now();
  const diffMs = currentTime - timestamp; // difference between current time and provided timestamp

  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor((diffMs / (1000 * 60 * 60 * 24)));

  let result = '';

  if (days >= 7) {
    result += `${Math.floor(days / 7)}w`; // w for weeks
  } else if (days > 0) {
    result += `${days}d`;
  } else if (hours > 0) {
    result += `${hours}h`;
  } else if (minutes > 0) {
    result += `${minutes}m`;
  } else {
    result += `${seconds}s`;
  }

  return result;
};
type TimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

interface FormattedTimestampObject {
  unit: TimeUnit;
  count: number;
}


export const getButtonText = (type: CreateType) => {
  switch(type){
    case 'text':
      return 'Create Note';
    case 'quote':
      return 'Create Quote';
    case 'broadcast':
      return 'Create Broadcast';
    default:
      return 'Create Note';
  }
}

export const getButtonColor = (type: CreateType) => {
  switch(type){
    case 'quote':
      return themes.dark.primary;
    case 'broadcast':
      return themes.colors.red;
    default:
      return themes.dark.primary;
  }
}

export const getButtonIcon= (type: CreateType) => {
  switch(type){
    case 'text':
      return 'document';
    case 'quote':
      return 'chatbox';
    case 'broadcast':
      return 'megaphone';
    default:
      return 'document';
  }
}

export const isMaxCharacters = (noteType: CreateType, note:string) => {
  switch (noteType){
    case 'quote':
      return  note.length > 250;
    case 'broadcast':
      return  note.length > 4096;
  }
}
