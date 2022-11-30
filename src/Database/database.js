import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCi88r8U0f7Axd9kF8EgwE9y9ebAmAHyf8",
  authDomain: "warheimregistration.firebaseapp.com",
  databaseURL:
    "https://warheimregistration-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "warheimregistration",
  storageBucket: "warheimregistration.appspot.com",
  messagingSenderId: "887853716764",
  appId: "1:887853716764:web:36c473bed1dc44d58456d9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
