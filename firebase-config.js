// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKqs7eG2nIkM1Nqu1lIMVKJXXR9e3YjHw",
    authDomain: "dataexperience-9e080.firebaseapp.com",
    projectId: "dataexperience-9e080",
    storageBucket: "dataexperience-9e080.firebasestorage.app",
    messagingSenderId: "653577505306",
    appId: "1:653577505306:web:89a8f3eef32382fa351fa3",
    measurementId: "G-J3Z9RNPGQN"
    };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();