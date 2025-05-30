// Function to load activities from the server and display them
function loadActivities() {
    fetch('http://localhost:3000/activities')
        .then(response => response.json())
        .then(activities => {
            const activityList = document.getElementById('activityList');
            activityList.innerHTML = ''; // Clear the list before adding

            activities.forEach(activity => {
                const li = document.createElement('li');
                li.textContent = `${activity.activity} - ${activity.duration} minutes on ${activity.date}`;
                
                // Create a delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'; // Assign a class for styling
                deleteButton.onclick = () => deleteActivity(activity);
                li.appendChild(deleteButton);
                
                activityList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching activities:', error));
}

// Function to handle form submission
document.getElementById('activityForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const activity = document.getElementById('activity').value;
    const duration = document.getElementById('duration').value;
    const date = document.getElementById('date').value;

    // Create an activity object
    const newActivity = {
        activity: activity,
        duration: duration,
        date: date
    };

    // Send the new activity to the server
    fetch('http://localhost:3000/activities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newActivity)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(() => {
        // Clear the form fields
        document.getElementById('activityForm').reset();
        // Reload the activities to display the new one
        loadActivities();
    })
    .catch(error => console.error('Error adding activity:', error));
});

// Function to delete an activity
function deleteActivity(activity) {
    fetch('http://localhost:3000/activities', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
    })
    .then(response => {
        if (response.ok) {
            loadActivities(); // Reload activities after deletion
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => console.error('Error deleting activity:', error));
}

// Load activities when the page is loaded
window.onload = loadActivities;