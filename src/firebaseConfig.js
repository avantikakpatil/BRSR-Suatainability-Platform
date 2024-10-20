import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
    authDomain: "brsr-9b56a.firebaseapp.com",
    projectId: "brsr-9b56a",
    storageBucket: "brsr-9b56a.appspot.com",
    messagingSenderId: "548279958491",
    appId: "1:548279958491:web:19199e42e0d796ad4185fe",
    measurementId: "G-7SYPSVZR9H"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const storage = getStorage(app);
  const auth = getAuth(app); // Initialize the auth module
  
  // Export the db, storage, and auth objects
  export { db, storage, auth };