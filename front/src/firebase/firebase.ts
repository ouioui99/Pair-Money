// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2VsPvjlakQ9eOgVTZRckVIpilU3FwTlw",
  authDomain: "pair-money-760bd.firebaseapp.com",
  projectId: "pair-money-760bd",
  storageBucket: "pair-money-760bd.appspot.com",
  messagingSenderId: "578123700555",
  appId: "1:578123700555:web:b1b049295ee8b8004070ce",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
