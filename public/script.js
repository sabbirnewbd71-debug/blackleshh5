import { db } from './firebaseConfig.js';
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const textarea = document.getElementById("welcomeText");
const form = document.getElementById("welcomeForm");

// Load current welcome message from Firebase
const welcomeRef = ref(db, 'welcomeMessage');
onValue(welcomeRef, snapshot => {
  if(snapshot.exists()){
    textarea.value = snapshot.val();
  } else {
    textarea.value = "✨ আমাদের সার্ভারে স্বাগতম 🎉";
  }
});

// Update Firebase when form is submitted
form.addEventListener("submit", (e)=>{
  e.preventDefault();
  set(welcomeRef, textarea.value);
  alert("✅ Welcome message live updated!");
});
