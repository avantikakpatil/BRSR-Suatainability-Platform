import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // Import ref and set
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth, Database, and Storage
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize the auth module

// Export db, storage, auth, ref, and set
export { db, storage, auth, ref, set };
