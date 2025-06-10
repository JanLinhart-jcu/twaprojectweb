import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCdDo7vug0DyJ37IZG-S-SVZxDPnL22Ujg",
  authDomain: "twa---project-web-1ff94.web.app",
  projectId: "twa---project-web-1ff94",
  storageBucket: "twa---project-web-1ff94.appspot.com",
  messagingSenderId: "266224242618",
  appId: "1:266224242618:web:a1ba523da310e9b4add783"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

