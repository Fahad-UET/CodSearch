import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp({
  ...firebaseConfig,
  authDomain: chrome.runtime.id + ".firebaseapp.com"
});

export const auth = getAuth(app);
auth.useDeviceLanguage();
auth._popupRedirectResolver = browserPopupRedirectResolver;

export const db = getFirestore(app);