// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAUillguCiDkazyDeTrb_Kszu4yCYGx-Bs',
  authDomain: 'cod-app-c801c.firebaseapp.com',
  projectId: 'cod-app-c801c',
  storageBucket: 'cod-app-c801c.firebasestorage.app',
  messagingSenderId: '316119589314',
  appId: '1:316119589314:web:025e2577f9f998b6aa765b',
  measurementId: 'G-DMC5YCG5H1',
};

// Initialize Firebase with compatibility version
firebase.initializeApp(firebaseConfig);

// Export Firebase services
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();
