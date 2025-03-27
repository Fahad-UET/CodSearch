import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  Auth,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';
import { createDefaultBoard } from './boards';
import { useProductStore } from '../../store/productStore';

// Set persistence to local
setPersistence(auth, browserLocalPersistence);

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create default board for new user
    await createDefaultBoard(userCredential.user.uid);
    
    // Load user's products
    await useProductStore.getState().loadUserProducts(userCredential.user.uid);
    
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('Registration failed:', authError.code, authError.message);
    throw new Error(getErrorMessage(authError));
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Load user's products
    await useProductStore.getState().loadUserProducts(userCredential.user.uid);
    
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('Login failed:', authError.code, authError.message);
    throw new Error(getErrorMessage(authError));
  }
};

export const logoutUser = async () => {
  try {
    if (!auth.currentUser) {
      console.warn('No user is currently signed in');
      return;
    }
    await signOut(auth);
    
    // Clear products from store on logout
    useProductStore.getState().loadUserProducts('');
  } catch (error) {
    const authError = error as AuthError;
    console.error('Logout failed:', authError.code, authError.message);
    throw new Error(getErrorMessage(authError));
  }
};

function getErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/network-request-failed':
      return 'Network error - please check your connection';
    case 'auth/too-many-requests':
      return 'Too many attempts - please try again later';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    default:
      return error.message || 'An error occurred during authentication';
  }
}