export const SUPERBASE_URL = process.env.SUPABSE_PROJECT_URL || ''
export const SUPERBASE_KEY = process.env.SUPABASE_KEY || ''

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { decrypt, encrypt } from "../storage";

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
//Used own encryption solution as aes-js was causing issues
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    return await encrypt(key, value)
  }

  private async _decrypt(key: string, value: string) {
   return await decrypt(key, value);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) { return encrypted; }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    await AsyncStorage.setItem(key, encrypted);
  }
}

const supabaseUrl =SUPERBASE_URL
const supabaseAnonKey = SUPERBASE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});