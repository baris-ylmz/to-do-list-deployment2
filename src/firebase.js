
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWtq-KzKrVHDmisZzXdVMHVQEAgYiiLuQ",
  authDomain: "todolistdeneme-dc860.firebaseapp.com",
  projectId: "todolistdeneme-dc860",
  storageBucket: "todolistdeneme-dc860.appspot.com",
  messagingSenderId: "797899765675",
  appId: "1:797899765675:web:2aaededc6024ebf645c4ee",
  measurementId: "G-TPXGN7HB4M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

