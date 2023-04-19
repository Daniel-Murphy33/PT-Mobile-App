// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore, collection, addDoc, getDocs, onSnapshot,
  setDoc, doc, getDoc, } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYo2-B4yQVU3I0YaT9NLsygoUKhg8GuzY",
  authDomain: "backend-fyp.firebaseapp.com",
  projectId: "backend-fyp",
  storageBucket: "backend-fyp.appspot.com",
  messagingSenderId: "926928198367",
  appId: "1:926928198367:web:af64cc798c832317a8e76a",
  measurementId: "G-4T1BF70577"
};

// Initialize Firebase
let app;
//if app not initialised
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);    
}
//app greater then 0 === app initialised 
else {
    app = firebase.app()
}

//init services
const db = getFirestore(app);
//get authentication
const auth = firebase.auth()

export { auth, app, db, getFirestore, collection, addDoc, getDocs, getDoc, onSnapshot,
setDoc, doc, };