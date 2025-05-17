import { auth, db, collection, addDoc, getDocs, query, where, signOut } from '../firebase-config.js';
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js';

// DOM Elements
const activityForm = document.getElementById('activityForm');
const activityFeed = document.getElementById('activityFeed');
const totalPlasticEl = document.getElementById('totalPlastic');
const totalProductsEl = document.getElementById('totalProducts');
const teamMembersEl = document.getElementById('teamMembers');
const logoutBtn = document.getElementById('logoutBtn');

// Chart instances
let plasticChart, productChart;

// Initialize dashboard
async function initDashboard() {
  try {
    // Load activities
    await loadActivities();
    
    // Load stats
    await loadStats();
    
    // Initialize charts
    initCharts();
    
  } catch (error) {
    console.error("Dashboard initialization error:", error);
    alert("Error loading dashboard data");
  }
}

// Load activities from Firestore
async function loadActivities() {
  const q = query(collection(db, "activities"));
  const querySnapshot = await getDocs(q);
  
  activityFeed.innerHTML = '';
  
  querySnapshot.forEach((doc) => {
    const activity = doc.data();
    const activityDate = new Date(activity.timestamp?.toDate()).toLocaleString();
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-date">${activityDate}</div>
      <span class="activity-type">${activity.type}</span>
      <div class="activity-content">
        <p>${activity.notes || 'No additional notes'}</p>
        ${activity.amount ? `<p><strong>Amount:</strong> ${activity.amount} kg</p>` : ''}
        ${activity.plasticType ? `<p><strong>Plastic:</strong> ${activity.plasticType}</p>` : ''}
      </div>
    `;
    
    activityFeed.prepend(activityItem);
  });
}

// Load statistics
async function loadStats() {
  // In a real app, you would query these from Firestore
  // For now we'll use mock data
  totalPlasticEl.textContent = "127.5 kg";
  totalProductsEl.textContent = "42";
  teamMembersEl.textContent = "19";
}

// Initialize charts
function initCharts() {
  const plasticCtx = document.getElementById('plasticChart').getContext('2d');
  const productCtx = document.getElementById('productChart').getContext('2d');
  
  // Plastic processing chart
  plasticChart = new Chart(plasticCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Plastic Processed (kg)',
        data: [12, 19, 15, 25, 30, 26],
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Product output chart
  productChart = new Chart(productCtx, {
    type: 'doughnut',
    data: {
      labels: ['Benches', 'Chairs', 'Other'],
      datasets: [{
        data: [15, 22, 5],
        backgroundColor: [
          'rgba(46, 204, 113, 0.7)',
          'rgba(52, 152, 219, 0.7)',
          'rgba(155, 89, 182, 0.7)'
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(155, 89, 182, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });
}

// Handle activity form submission
activityForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const activityType = document.getElementById('activityType').value;
  const plasticType = document.getElementById('plasticType').value;
  const plasticAmount = document.getElementById('plasticAmount').value;
  const notes = document.getElementById('notes').value;
  
  try {
    // Add new activity to Firestore
    await addDoc(collection(db, "activities"), {
      type: activityType,
      plasticType: plasticType || null,
      amount: plasticAmount ? parseFloat(plasticAmount) : null,
      notes: notes || null,
      timestamp: new Date(),
      userId: auth.currentUser.uid
    });
    
    // Refresh data
    await loadActivities();
    await loadStats();
    
    // Reset form
    activityForm.reset();
    
    alert('Activity logged successfully!');
    
  } catch (error) {
    console.error("Error logging activity:", error);
    alert("Failed to log activity");
  }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initDashboard);
