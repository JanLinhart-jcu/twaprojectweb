// firebase-script.js - Nahrazuje původní script.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query,
    orderBy,
    serverTimestamp,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Reference na kolekci aktivit
const activitiesCollection = collection(window.db, 'activities');

// Funkce pro načtení a zobrazení aktivit
async function loadActivities() {
    try {
        // Zobrazit loading zprávu
        const loadingMessage = document.getElementById('loadingMessage');
        const activityList = document.getElementById('activityList');
        
        loadingMessage.style.display = 'block';
        activityList.innerHTML = '';

        // Načíst aktivity seřazené podle data (nejnovější první)
        const q = query(activitiesCollection, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        loadingMessage.style.display = 'none';

        if (querySnapshot.empty) {
            activityList.innerHTML = '<li>No activities logged yet. Add your first activity!</li>';
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const activity = docSnapshot.data();
            const activityId = docSnapshot.id;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${activity.activity} - ${activity.duration} minutes on ${activity.date}</span>
                <button class="delete-button" onclick="deleteActivity('${activityId}')">Delete</button>
            `;
            
            activityList.appendChild(li);
        });

    } catch (error) {
        console.error('Error loading activities:', error);
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('activityList').innerHTML = '<li>Error loading activities. Please refresh the page.</li>';
    }
}

// Funkce pro přidání aktivity
async function addActivity(activityData) {
    try {
        await addDoc(activitiesCollection, {
            ...activityData,
            createdAt: serverTimestamp()
        });
        
        console.log('Activity added successfully');
        // Znovu načíst aktivity
        loadActivities();
    } catch (error) {
        console.error('Error adding activity:', error);
        alert('Error adding activity. Please try again.');
    }
}

// Funkce pro smazání aktivity
window.deleteActivity = async function(activityId) {
    if (!confirm('Are you sure you want to delete this activity?')) {
        return;
    }
    
    try {
        await deleteDoc(doc(window.db, 'activities', activityId));
        console.log('Activity deleted successfully');
        // Znovu načíst aktivity
        loadActivities();
    } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Error deleting activity. Please try again.');
    }
}

// Event listener pro formulář
document.getElementById('activityForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const activity = document.getElementById('activity').value.trim();
    const duration = parseInt(document.getElementById('duration').value);
    const date = document.getElementById('date').value;

    // Validace
    if (!activity || !duration || !date) {
        alert('Please fill in all fields');
        return;
    }

    if (duration <= 0) {
        alert('Duration must be greater than 0');
        return;
    }

    // Vytvořit objekt aktivity
    const newActivity = {
        activity: activity,
        duration: duration,
        date: date
    };

    // Přidat aktivitu do Firebase
    await addActivity(newActivity);
    
    // Vyčistit formulář
    document.getElementById('activityForm').reset();
});

// Načíst aktivity při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    loadActivities();
});

// Volitelně: Real-time poslouchání změn (aktivuje se automatické aktualizace)
function enableRealTimeUpdates() {
    const q = query(activitiesCollection, orderBy('date', 'desc'));
    
    onSnapshot(q, (querySnapshot) => {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';

        if (querySnapshot.empty) {
            activityList.innerHTML = '<li>No activities logged yet. Add your first activity!</li>';
            return;
        }

        querySnapshot.forEach((docSnapshot) => {
            const activity = docSnapshot.data();
            const activityId = docSnapshot.id;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${activity.activity} - ${activity.duration} minutes on ${activity.date}</span>
                <button class="delete-button" onclick="deleteActivity('${activityId}')">Delete</button>
            `;
            
            activityList.appendChild(li);
        });
    }, (error) => {
        console.error('Error in real-time listener:', error);
    });
}

// Uncomment the line below to enable real-time updates
// enableRealTimeUpdates();