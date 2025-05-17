import { auth, signInWithEmailAndPassword } from '../firebase-config.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Handle login form submission
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard after successful login
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    }
  });
}

// Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log("User logged in:", user.email);
    
    // If on login page, redirect to dashboard
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // User is signed out
    console.log("User logged out");
    
    // If on protected page, redirect to login
    if (window.location.pathname.includes('dashboard.html')) {
      window.location.href = 'login.html';
    }
  }
});
