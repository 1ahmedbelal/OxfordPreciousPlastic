import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import * as firebaseui from 'https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js';

// Auth state observer
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.getElementById('loginBtn');
  const dashboardLink = document.getElementById('dashboardLink');
  
  if (user) {
    // User is signed in
    console.log("User logged in:", user.email);
    if (loginBtn) loginBtn.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'block';
    
    // Redirect from login page
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'dashboard.html';
    }
    
    // Protect dashboard
    if (window.location.pathname.includes('dashboard.html') && !user) {
      window.location.href = 'login.html';
    }
  } else {
    // User is signed out
    console.log("User logged out");
    if (loginBtn) loginBtn.style.display = 'block';
    if (dashboardLink) dashboardLink.style.display = 'none';
    
    // Redirect from protected pages
    if (window.location.pathname.includes('dashboard.html')) {
      window.location.href = 'login.html';
    }
  }
});

// Email/password login
if (document.getElementById('emailLoginForm')) {
  document.getElementById('emailLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error("Login error:", error);
      errorElement.textContent = error.message;
      errorElement.style.display = 'block';
    }
  });
}

// Logout handler
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'index.html';
    } catch (error) {
      console.error("Logout error:", error);
    }
  });
}

// Initialize Firebase UI for Google Auth
if (document.getElementById('firebaseui-auth-container')) {
  const uiConfig = {
    signInSuccessUrl: 'dashboard.html',
    signInOptions: [
      {
        provider: firebaseui.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          prompt: 'select_account'
        }
      },
      {
        provider: firebaseui.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      }
    ],
    tosUrl: 'index.html',
    privacyPolicyUrl: 'index.html'
  };
  
  const ui = new firebaseui.auth.AuthUI(auth);
  ui.start('#firebaseui-auth-container', uiConfig);
}
