import { ReactNode } from "react";
import { TextStyle, DimensionValue, Falsy, Animated } from "react-native";
import { z } from "zod";
import { DrawTextParamsSchema } from "./schemas";
import { Session } from "@supabase/supabase-js";


export interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => Promise<void> | void;
  text?: string;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  icon?: any;
  fontSize?: number;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
  iconSize?: number
  transformIcon?: Boolean ;
}

export interface GradientButtonProps extends Omit<ButtonProps, 'backgroundColor'> {
  gradientColor: string[];
}

export interface PickerProps { 
  selectedValue: string; 
  onValueChange: (selectedValue: string) => void; 
  options: string [];
  borderRadius?: number;
  borderColor?: string;
  dropdownIconRippleColor?: string;
  dropdownIconColor?: string;
  label?: string;
  textColor?: string;
}

export interface DisplayModalProps { 
  visible: boolean; 
  onClose: () => void;
  onTagSelect: (tag: Tag) => void;
  deleteTag: (tagToDelete: Tag) => void;
  description?: string; 
  title: string;
  contentBackground: string;
  textColor : string;
  loading?: boolean;
}

export interface MnemonicModalProps extends DisplayModalProps { 
  mnemonic?: string[]
}

export interface ButtonConfig {
  condition?: boolean;    //Conditionally render button. Default: condition === false
  onPress: () => void | Promise<void>;
  icon: string;
  iconColor: string;
  width?: DimensionValue;
  text:string;
  loading?: boolean;
}

export interface FooterButtonsProps { 
  buttonsConfig: ButtonConfig[]; 
  buttonsColor: string;
  backgroundColor?: string; 
 }

 export interface IconButtonProps {
  onPress: (() => Promise<void> | void)
  onLongPress?:(() => Promise<void> | void)
  color?: string;
  icon:any;
  size?: number;
  opacity?: number
}

export interface InfoCardProps { 
  title: string;
  description?: string;
  metadata?: string;
  icon: any, 
  metadataIcon?: any, 
  color?: string;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface HeaderProps { 
  title: string; 
  icon: any;
  backgroundColor?: string;
  fontSize?: number;
  textAlign?: TextStyle["textAlign"];
  textDecorationLine: TextStyle["textDecorationLine"];
  iconSize?: number;
  iconColor: string;
  textColor: string;
}

export interface HeaderButtonProps extends HeaderProps { 
  buttonText: string;
  onPress: () => void;
}


export interface InputFieldProps { 
  value: string; 
  onChangeText: (text: string) => Promise<void> | void;
  error?: boolean | Falsy
  placeholder: string; 
  secureTextEntry?: boolean; 
  errorText?: string; 
  color: string;
  multiline?: boolean
  height?: DimensionValue;
  width?: DimensionValue
  label?: string;
  maxHeight?: DimensionValue
  minHeight?: DimensionValue
  borderColor?: string;
  borderBottomWidth?: DimensionValue
  borderWidth?:DimensionValue
  fontSize?: number;
  paddingBottom?: DimensionValue
  backgroundColor?: string;
  textAlignVertical?: "auto" | "top" | "bottom" | "center"
  fontFamily?: string;
}


export interface SettingsCardProps {
  onPress: () => Promise<void> | void; 
  dark: boolean, 
  settingDescription?: string; 
  settingTitle: string; 
  isSwitch?: boolean;
  value?: boolean;
  disabled?: boolean;
}


export interface TextButtonProps {
  onPress: () => Promise<void> | void; 
  onLongPress?: () => Promise<void> | void; 
  buttonText: string; 
  fontSize?: number;
  color?: string; 
  margin?: number; 
  textAlign?: TextStyle['textAlign']; 
  fontFamily?: string;
}

export interface TextWithIconButtonProps extends TextButtonProps {
  icon: any;
  iconSize?: number;
  justifyContent?: 'flex-start' | 'flex-end' | 'center';
  reverse?: boolean;
  iconColor?: string; 
}

export interface ImageSettings {
    negative_prompt: string;
    num_steps: number;
    guidance_scale: number;
    sampler:string;
    prior_cf_scale:number;
    prior_steps:string;
    num_images:number;
    seed:number;
    h:number,
    w:number,
}


export interface Settings {
  enablePasscode: boolean;
  theme: string;
  broadcastSettings: NotifyConfig;
  imageSettings: ImageSettings;
  quotePostSettings: QuotePostSettings;
}

export interface NotifyConfig{
    telegramChannelId?: string | number;
    discordWebhookUrl?: URL | string;
}

export interface SettingsContextProps {
  enablePasscode: boolean;
  setEnablePasscode: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  broadcastSettings: NotifyConfig;
  setBroadcastSettings: React.Dispatch<React.SetStateAction<NotifyConfig>>;
  imageSettings: ImageSettings
  setImageSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  quotePostSettings: QuotePostSettings
  setQuotePostSettings: React.Dispatch<React.SetStateAction<QuotePostSettings>>;}

export interface SettingsProviderProps {
  children: ReactNode;
  settings: Settings;
}

export type PostButtonsOptions ={
  key: string;
  text: string;
  icon: string;
  onPress: () => void;
  loading?: boolean;
}

export type CreateType = 'text' | 'quote' | 'scheduled' | 'draft' | 'image' | 'quote' | 'broadcast'

export type DrawTextParams = z.infer<typeof DrawTextParamsSchema>;

export interface QuotePostSettings extends Omit<DrawTextParams, 'postText' | 'alignment'> {
  // Define additional properties specific to quote post settings here
  alignment: AlignmentType;
}

export type AlignmentType = 'left' | 'center' | 'right';

export type Tag = {
  tagName: string;
}

export type QuotePostSettingsKey = keyof QuotePostSettings;

export type NotifyConfigKey = keyof NotifyConfig;

export type ImageSettingsKey = keyof ImageSettings;

export type Theme = 'dark' | 'light'

export interface Note {
  id: string;
  title:string; 
  content: string; 
  createdAt: number;
  lastModified: number;  
  tag: string | undefined;
  type: CreateType;
  pinned?: boolean;
}
export interface NotesContextProps { 
  myNotes: Note[];
  setMyNotes:React.Dispatch<React.SetStateAction<Note[]>>; 
  selectedTag: Tag | null; 
  setSelectedTag: React.Dispatch<React.SetStateAction<Tag | null>>;  
  addingTag: boolean; //
  setAddingTag: React.Dispatch<React.SetStateAction<boolean>>;
  tags: Tag[]; //
  setTags: React.Dispatch<React.SetStateAction< Tag[]>>;  
  tagFilter: Tag | null; //
  setTagFilter: React.Dispatch<React.SetStateAction< Tag | null>>; 
  currentOpenedNote: Note | null; //
  setCurrentOpenedNote: React.Dispatch<React.SetStateAction< Note | null>>; 
  viewMode: boolean;
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;

}

export interface NoteCardProps {
  note: Note;
  index?: number;
  scale?: Animated.AnimatedInterpolation<number>; // Update the type to Animated.AnimatedInterpolation<number>
  opacity?:Animated.AnimatedInterpolation<number>;
  handleEditNote: (note: Note) => void;
}

export interface NotesProps {
  children: ReactNode;
  currentTags: Tag[];
  initialNotes: Note[];
}

export interface TimerProps {
    duration: number;
    onFinished: () => void;
    message?: string;
};

export type Order = {
  orderId: string;
  productId: string;
  buyerAddress: string;
  chain: string;
  timestamp: number;
  quantity: number;
  totalPrice: number;
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface OrderCardProps {
  order: Order;
}


export interface SearchContextProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: Note [];
  setSearchResults: React.Dispatch<React.SetStateAction<Note[] | []>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SearchProps {
  notes: Note [], 
  placeholder?: string;
  backgroundColor?: string;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  color?: string;
}

export interface UserContextProps {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction< Session | null>>; 
}

export interface TabLayoutContextProps {
  shouldHideTabBar: boolean;
  setShouldHideTabBar: React.Dispatch<React.SetStateAction<boolean>>; 
}

