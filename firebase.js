// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7ov2PUjMiVyGiRM96daTmP1Q4SaXUIHM",
  authDomain: "twa---project-web.firebaseapp.com",
  projectId: "twa---project-web",
  storageBucket: "twa---project-web.firebasestorage.app",
  messagingSenderId: "297435710962",
  appId: "1:297435710962:web:52d15a9cac6e37b215176b",
  measurementId: "G-BMMK2M8JM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
