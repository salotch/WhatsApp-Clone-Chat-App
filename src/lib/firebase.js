import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6R_3_cpiHwOPZhSQvpN-XLQAJ5WQPEJI",
  authDomain: "react-chat-d4a1e.firebaseapp.com",
  projectId: "react-chat-d4a1e",
  storageBucket: "react-chat-d4a1e.firebasestorage.app",
  messagingSenderId: "91692988571",
  appId: "1:91692988571:web:9b4f782f2d9622225fae3e",
  measurementId: "G-J7W1LFE59W",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
