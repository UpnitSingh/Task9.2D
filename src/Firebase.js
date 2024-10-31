
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your Firebase config object (copy this from Firebase Console > Project Settings)
const firebaseConfig = {
    apiKey: "AIzaSyCyZ4slfYMY-gruGeQITy9DA7eQ2rWvsaA",
    authDomain: "task-1afa9.firebaseapp.com",
    projectId: "task-1afa9",
    storageBucket: "task-1afa9.appspot.com",
    messagingSenderId: "792680800845",
    appId: "1:792680800845:web:9115f14335d22a4c0a3204"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore(); // Firestore
const storage = firebaseApp.storage(); // Storage

export { db, storage };
