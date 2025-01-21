// src/firebase.js
import { initializeApp } from 'firebase/app';  // Import Firebase initialization
import { getAuth } from 'firebase/auth';        // Import Firebase Auth

const firebaseConfig = {
  apiKey: "AIzaSyDa5KFS2TRtGoNuCwpdtvszksw0QQ7i_d0",
  authDomain: "library-dc1bf.firebaseapp.com",
  projectId: "library-dc1bf",
  storageBucket: "library-dc1bf.firebasestorage.app",
  messagingSenderId: "1023070031203",
  appId: "1:1023070031203:web:9acf94bf00ace38c4b9756",
  measurementId: "G-LX59WJCMH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth after app initialization
export const auth = getAuth(app);  // Export the Auth instance

export default app;  // Export the Firebase app
