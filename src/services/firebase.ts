import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // These should be populated with actual values from Firebase Console
  apiKey: "YOUR_API_KEY",
  authDomain: "bidhub2-malawi.firebaseapp.com",
  projectId: "bidhub2-malawi",
  storageBucket: "bidhub2-malawi.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
