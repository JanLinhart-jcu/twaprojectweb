// activities.js - Firebase verze
import { db } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

// Kolekce pro aktivity
const activitiesCollection = collection(db, 'activities');

// ✅ PŘIDAT NOVOU AKTIVITU
export async function addActivity(activityData) {
  try {
    const docRef = await addDoc(activitiesCollection, {
      ...activityData,
      createdAt: serverTimestamp(), // Automatický časový razítko
      updatedAt: serverTimestamp()
    });
    
    console.log('Aktivita přidána s ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Chyba při přidávání aktivity:', error);
    throw error;
  }
}

// ✅ NAČÍST VŠECHNY AKTIVITY
export async function getActivities() {
  try {
    // Seřazené podle data vytvoření (nejnovější první)
    const q = query(activitiesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return activities;
  } catch (error) {
    console.error('Chyba při načítání aktivit:', error);
    throw error;
  }
}

// ✅ SMAZAT AKTIVITU
export async function deleteActivity(activityId) {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
    console.log('Aktivita smazána:', activityId);
  } catch (error) {
    console.error('Chyba při mazání aktivity:', error);
    throw error;
  }
}

// ✅ UPRAVIT AKTIVITU
export async function updateActivity(activityId, newData) {
  try {
    await updateDoc(doc(db, 'activities', activityId), {
      ...newData,
      updatedAt: serverTimestamp()
    });
    console.log('Aktivita upravena:', activityId);
  } catch (error) {
    console.error('Chyba při úpravě aktivity:', error);
    throw error;
  }
}

// ✅ REAL-TIME POSLOUCHÁNÍ ZMĚN
export function listenToActivities(callback) {
  const q = query(activitiesCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(activities); // Zavolá funkci s novými daty
  });
}

// ✅ VYHLEDAT AKTIVITY
export async function searchActivities(searchTerm) {
  try {
    const allActivities = await getActivities();
    
    // Jednoduché vyhledávání v názvu a popisu
    return allActivities.filter(activity => 
      activity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Chyba při vyhledávání:', error);
    throw error;
  }
}