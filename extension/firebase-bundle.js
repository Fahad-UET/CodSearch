// Import and bundle Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUillguCiDkazyDeTrb_Kszu4yCYGx-Bs",
  authDomain: "cod-app-c801c.firebaseapp.com",
  projectId: "cod-app-c801c",
  storageBucket: "cod-app-c801c.firebasestorage.app",
  messagingSenderId: "316119589314",
  appId: "1:316119589314:web:025e2577f9f998b6aa765b",
  measurementId: "G-DMC5YCG5H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other scripts
window.firebaseAuth = auth;
window.firebaseDb = db;