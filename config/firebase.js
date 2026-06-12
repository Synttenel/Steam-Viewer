// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRPoFBWlCMA3aM33qKDgoYJS0un450GUQ",
  authDomain: "steam-viewer-d7c72.firebaseapp.com",
  projectId: "steam-viewer-d7c72",
  storageBucket: "steam-viewer-d7c72.firebasestorage.app",
  messagingSenderId: "708395927153",
  appId: "1:708395927153:web:8d8e7ab0fbc8338683bdd0",
  measurementId: "G-9EF9N450JM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

