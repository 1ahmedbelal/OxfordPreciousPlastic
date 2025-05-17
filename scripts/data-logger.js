import { db, collection, addDoc, getDocs } from '../firebase-config.js';

class DataLogger {
  constructor() {
    this.activitiesRef = collection(db, "activities");
    this.productsRef = collection(db, "products");
    this.membersRef = collection(db, "members");
  }
  
  // Log a new activity
  async logActivity(activityData) {
    try {
      const docRef = await addDoc(this.activitiesRef, {
        ...activityData,
        timestamp: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error logging activity:", error);
      throw error;
    }
  }
  
  // Get all activities
  async getActivities(limit = 10) {
    try {
      const querySnapshot = await getDocs(this.activitiesRef);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    } catch (error) {
      console.error("Error getting activities:", error);
      throw error;
    }
  }
  
  // Get plastic processing stats
  async getPlasticStats() {
    try {
      const querySnapshot = await getDocs(this.activitiesRef);
      let total = 0;
      const byMonth = {};
      
      querySnapshot.forEach((doc) => {
        const activity = doc.data();
        if (activity.amount) {
          total += activity.amount;
          
          const month = activity.timestamp.toDate().getMonth();
          byMonth[month] = (byMonth[month] || 0) + activity.amount;
        }
      });
      
      return {
        total: parseFloat(total.toFixed(2)),
        byMonth
      };
    } catch (error) {
      console.error("Error getting plastic stats:", error);
      throw error;
    }
  }
  
  // Get product stats
  async getProductStats() {
    try {
      const productsSnapshot = await getDocs(this.productsRef);
      const productCount = productsSnapshot.size;
      
      const byType = {};
      productsSnapshot.forEach((doc) => {
        const type = doc.data().type || 'Other';
        byType[type] = (byType[type] || 0) + 1;
      });
      
      return {
        total: productCount,
        byType
      };
    } catch (error) {
      console.error("Error getting product stats:", error);
      throw error;
    }
  }
}

export default DataLogger;
