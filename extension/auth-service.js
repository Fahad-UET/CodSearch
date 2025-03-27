import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from './firebase.js';

// Configure la persistance locale pour éviter les problèmes de session
await setPersistence(auth, browserLocalPersistence);

export const authService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password,
        browserPopupRedirectResolver
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  },

  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password,
        browserPopupRedirectResolver
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email, {
        resolver: browserPopupRedirectResolver
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
};