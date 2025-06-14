// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBrojEtAFzh9cCMmQgxDtX70lQ00HKcEo",
  authDomain: "subscriptionmanager-ca07a.firebaseapp.com",
  projectId: "subscriptionmanager-ca07a",
  storageBucket: "subscriptionmanager-ca07a.firebasestorage.app",
  messagingSenderId: "471606162315",
  appId: "1:471606162315:web:2dfadfda52fde7d8beb58e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);