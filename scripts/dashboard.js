// scripts/dashboard.js
import {
  auth,
  db,
  collection,
  addDoc,
  getDocs,
  query,
  signOut,
} from './firebase-config.js';

import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js';

const activityForm = document.getElementById('activityForm');
const activityFeed = document.getElementById('activityFeed');
const totalPlasticEl = document.getElementById('totalPlastic');
const totalProductsEl = document.getElementById('totalProducts');
const teamMembersEl = document.getElementById('teamMembers');
const logoutBtn = document.getElementById('logoutBtn');

let plasticChart;
let productChart;

async function loadActivities() {
  const q = query(collection(db, 'activities'));
  const querySnapshot = await getDocs(q);
  const activities = [];

  querySnapshot.forEach(doc => {
    activities.push(doc.data());
  });

  activities.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());

  activityFeed.innerHTML = '';
  activities.forEach(activity => {
    const dateStr = activity.timestamp?.toDate().toLocaleString();
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-date">${dateStr}</div>
      <span class="activity-type">${activity.type}</span>
      <div class="activity-content">
        <p>${activity.notes || 'No additional notes'}</p>
        ${activity.amount ? `<p><strong>Amount:</strong> ${activity.amount} kg</p>` : ''}
        ${activity.plasticType ? `<p><strong>Plastic:</strong> ${activity.plasticType}</p>` : ''}
      </div>
    `;
    activityFeed.appendChild(item);
  });
}

async function loadStats() {
  const q = query(collection(db, 'activities'));
  const snapshot = await getDocs(q);

  let totalPlastic = 0;
  let productCount = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.amount) totalPlastic += parseFloat(data.amount);
    if (data.type === 'product') productCount++;
  });

  totalPlasticEl.textContent = `${totalPlastic.toFixed(1)} kg`;
  totalProductsEl.textContent = productCount;
  teamMembersEl.textContent = '4';
}

function renderCharts() {
  const plasticCtx = document.getElementById('plasticChart').getContext('2d');
  const productCtx = document.getElementById('productChart').getContext('2d');

  plasticChart = new Chart(plasticCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Plastic Processed (kg)',
        data: [5, 12, 19, 7, 25, 15],
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });

  productChart = new Chart(productCtx, {
    type: 'doughnut',
    data: {
      labels: ['Benches', 'Chairs', 'Other'],
      datasets: [{
        data: [12, 20, 5],
        backgroundColor: [
          'rgba(46, 204, 113, 0.7)',
          'rgba(52, 152, 219, 0.7)',
          'rgba(155, 89, 182, 0.7)'
        ]
      }]
    },
    options: { responsive: true }
  });
}

activityForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const activityType = document.getElementById('activityType').value;
  const plasticType = document.getElementById('plasticType').value;
  const plasticAmount = document.getElementById('plasticAmount').value;
  const notes = document.getElementById('notes').value;

  try {
    await addDoc(collection(db, 'activities'), {
      type: activityType,
      plasticType: plasticType || null,
      amount: plasticAmount ? parseFloat(plasticAmount) : null,
      notes: notes || null,
      timestamp: new Date(),
      userId: auth.currentUser?.uid || 'anon'
    });
    await loadActivities();
    await loadStats();
    activityForm.reset();
    alert('Activity logged!');
  } catch (err) {
    console.error(err);
    alert('Failed to log activity.');
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('userLoggedIn');
    window.location.href = 'login.html';
  } catch (err) {
    alert('Logout failed.');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await loadActivities();
  await loadStats();
  renderCharts();
});
