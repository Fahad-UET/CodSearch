import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);

// Initialize Firestore with offline persistence
const db = getFirestore(app);
try {
  await enableIndexedDbPersistence(db);
} catch (err: any) {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
}

// ✅ Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Analytics only if supported
let analytics = null;
isSupported()
  .then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      console.info('Firebase Analytics initialized');
    } else {
      console.info('Firebase Analytics not supported in this environment');
    }
  })
  .catch(error => {
    console.warn('Failed to initialize Firebase Analytics:', error);
  });

// Export initialized services
export { app, analytics, auth, db, storage };

// Export initialization status
export const isInitialized = !!app && !!auth && !!db;