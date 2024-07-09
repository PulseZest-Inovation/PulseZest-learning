import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMKu_qb0DMUnaetfAZFwT67XADFfmNHMw",
    authDomain: "pulsezest.firebaseapp.com",
    databaseURL: "https://pulsezest-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pulsezest",
    storageBucket: "pulsezest.appspot.com",
    messagingSenderId: "623743936169",
    appId: "1:623743936169:web:92adcb8e4589e8be8eabb8",
    measurementId: "G-B7C9MEGRRM"
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app); // Ensure auth module is initialized
  const db = getFirestore(app); // Example firestore initialization, adjust as per your needs
  
  export { app, auth, db }; 