import { auth } from '../firebase-config';

export const authService = {
  async login(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  },

  async register(email, password) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  },

  async logout() {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
};