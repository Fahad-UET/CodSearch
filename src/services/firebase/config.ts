import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAUillguCiDkazyDeTrb_Kszu4yCYGx-Bs",
  authDomain: "cod-app-c801c.firebaseapp.com",
  projectId: "cod-app-c801c",
  storageBucket: 'cod-app-c801c.firebasestorage.app',
  messagingSenderId: "316119589314",
  appId: "1:316119589314:web:025e2577f9f998b6aa765b",
  measurementId: "G-DMC5YCG5H1"
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