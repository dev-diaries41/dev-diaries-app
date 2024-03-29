import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from './sb_config'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.

  export async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    return error;
  }

  export async function signUpWithEmail(email: string, password: string) {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    return {error, session}
  }
  
  export async function signOut(){
    const { error } = await supabase.auth.signOut();
    return error;
  }

  export async function resetPassowrd(email: string){
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com/update-password',
    })
    return { data, error };
  }

  export async function updatePassword(new_password: string){
    const { data, error } = await supabase.auth.updateUser({
      password: new_password
    })

    return {data, error};
  }

