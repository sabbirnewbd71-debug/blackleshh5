import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDgcOMktV2WUxwJoh0ySBPzfhwicxxb7sM",
  authDomain: "admin-4bc65.firebaseapp.com",
  databaseURL: "https://admin-4bc65-default-rtdb.firebaseio.com",
  projectId: "admin-4bc65",
  storageBucket: "admin-4bc65.firebasestorage.app",
  messagingSenderId: "1049052911788",
  appId: "1:1049052911788:web:17343a2b41154c7e0d2709",
  measurementId: "G-03ZQ7CJTSV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
