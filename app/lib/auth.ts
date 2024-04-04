
import { Session } from '@supabase/supabase-js'
import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'

  
  export const authorizeEmailUpdate = async (currentPassword: string, currentUser: any) => {

    // const credentials = EmailAuthProvider.credential( currentUser.email, currentPassword); 
    // await reauthenticateWithCredential(currentUser, credentials )
    try{
    //   await updateEmail(auth.currentUser, email)
    //   setEmail("");
    // console.log("updated email", currentUser.email)
    }
    catch(error: any){
      console.log("An error occured updating the user's email:", error.message)
    }
  }

  // Function to auth user before changing password by entering current password using firebase
  export  const reauthenticate = async (currentPassword: string)=>{
    try {
      // const credentials = EmailAuthProvider.credential( currentUser.email, currentPassword); 
      // await reauthenticateWithCredential(currentUser, credentials )
      // setChangingPassword(true)
    }
    catch(error: any) {
      console.log("An error occured authenticating the user's password:", error.message)
    }
  }

  // Function to change password using firebase
  export  const handleChangePassword = async (newPassword:string, confirmNewPassword: string) => {
    const validPass = newPassword === confirmNewPassword;
    console.log({validPass})
    try {
      // if (validPass){
      //   await updatePassword(currentUser, newPassword)
      //   showAlert("Password Updated", "Your password was succeessfully changed.")
      // }
      // else{
      //   showAlert("Invalid Password", "The passwords you entered do not match.")
      // }
  }
  catch(error: any){
    console.log("An error occured updating the user's password:", error.message)
  }
}

export const hashPass = async (enteredPasscode: string) => {
  try {
    const hashedPasscode = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, enteredPasscode);
    return hashedPasscode;
  } catch (error) {
    console.error('Error hashing passcode:', error);
    throw new Error('Error hashing passcode')
  }
};

export const validatePasscode = async (enteredPasscode: string, storedHashedPasscode: string | null) => {
  try {
    const hashedPasscode = await hashPass(enteredPasscode);
    return hashedPasscode === storedHashedPasscode;
  } catch (error) {
    console.log('Error validating passcode:', error);
    return false;
  }
};

export const checkHasPassocde = async () => {
  const passcode = await SecureStore.getItemAsync('passHash');
  return !!passcode;

};

export const checkHasSession = async () => {
  const session = await SecureStore.getItemAsync('session');
  return session;
};

export const storeSession = async (session: Session) => {
  await SecureStore.setItemAsync('session', JSON.stringify(session));
};

export const removeSession = async () => {
  await SecureStore.deleteItemAsync('session');

};
