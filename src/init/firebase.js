// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvAO9riaSjsas9UJbF2TOYynaKBYRLUQM",
  authDomain: "comp3334-79d71.firebaseapp.com",
  databaseURL: "https://comp3334-79d71-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp3334-79d71",
  storageBucket: "comp3334-79d71.appspot.com",
  messagingSenderId: "212070543107",
  appId: "1:212070543107:web:a7d26fc7b771ecb665c336",
  measurementId: "G-5Z8QDF8B43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);