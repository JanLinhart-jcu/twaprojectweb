// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'activities.txt');

app.use(cors());
app.use(bodyParser.json());

// Function to read activities from the text file
function readActivities(callback) {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        const activities = data ? data.split('\n').filter(Boolean).map(line => {
            const [activity, duration, date] = line.split('|');
            return { activity, duration, date };
        }) : [];
        callback(null, activities);
    });
}

// Endpoint to get activities
app.get('/activities', (req, res) => {
    readActivities((err, activities) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        res.json(activities);
    });
});

// Endpoint to add an activity
app.post('/activities', (req, res) => {
    const newActivity = req.body;
    const activityLine = `${newActivity.activity}|${newActivity.duration}|${newActivity.date}\n`;

    fs.appendFile(DATA_FILE, activityLine, (err) => {
        if (err) {
            return res.status(500).send('Error writing to data file');
        }
        res.status(201).send('Activity added');
    });
});

// Endpoint to delete an activity
app.delete('/activities', (req, res) => {
    const { activity, duration, date } = req.body;
    readActivities((err, activities) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }

        // Filter out the activity to delete
        const updatedActivities = activities.filter(act => 
            !(act.activity === activity && act.duration === duration && act.date === date)
        );

        // Rewrite the file with the updated activities
        const updatedData = updatedActivities.map(act => `${act.activity}|${act.duration}|${act.date}`).join('\n');
        fs.writeFile(DATA_FILE, updatedData, (err) => {
            if (err) {
                return res.status(500).send('Error writing to data file');
            }
            res.send('Activity deleted');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});