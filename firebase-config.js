// firebase-config.js - Aktualizovaná konfigurace s vašimi údaji
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7ov2PUjMiVyGiRM96daTmP1Q4SaXUIHM",
  authDomain: "twa---project-web.firebaseapp.com",
  projectId: "twa---project-web",
  storageBucket: "twa---project-web.firebasestorage.app",
  messagingSenderId: "297435710962",
  appId: "1:297435710962:web:52d15a9cac6e37b215176b",
  measurementId: "G-BMMK2M8JM4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);