
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZUn8cdSpeoK2o1E0zCscLBuX3vsKi3ds",
  authDomain: "musicapp-c5b03.firebaseapp.com",
  databaseURL: "https://musicapp-c5b03-default-rtdb.firebaseio.com",
  projectId: "musicapp-c5b03",
  storageBucket: "musicapp-c5b03.appspot.com",
  messagingSenderId: "371399013830",
  appId: "1:371399013830:web:e227d28307c546a3be2ec7",
  measurementId: "G-FB79P250KG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getAuth(app);
const userInfo = getFirestore();

const sheets = getFirestore(app); // Initialize the Firestore service
const musicSheetCollectionRef = collection(sheets, 'classical');
console.log('Type of db:', typeof db);

const imgDB = getStorage(app);



export { db, sheets,  musicSheetCollectionRef, imgDB, userInfo};