// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3k7VKpe0bS4HMs7nidPsiZA9_BEzaZV0",
  authDomain: "precious-plastic-e6586.firebaseapp.com",
  projectId: "precious-plastic-e6586",
  storageBucket: "precious-plastic-e6586.appspot.com",
  messagingSenderId: "816596846839",
  appId: "1:816596846839:web:aa6fa29a920c9c9dce6bf2",
  measurementId: "G-E4RD7C7JQK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInWithEmailAndPassword, collection, addDoc, getDocs, query, where };
