// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDunx5bq8oZso_ARHK5CFuOVbE1ykNGaSY",
  authDomain: "chatio-5d394.firebaseapp.com",
  projectId: "chatio-5d394",
  storageBucket: "chatio-5d394.appspot.com",
  messagingSenderId: "381106690533",
  appId: "1:381106690533:web:fb02597ad2bffce081f70c",
  measurementId: "G-BXFMKJEZWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);