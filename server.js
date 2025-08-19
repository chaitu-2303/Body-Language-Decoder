const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('3d-website'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bodyLanguageDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a schema for user actions
const actionSchema = new mongoose.Schema({
    action: String,
    timestamp: { type: Date, default: Date.now }
});

const Action = mongoose.model('Action', actionSchema);

// API endpoint to save user actions
app.post('/api/actions', async (req, res) => {
    const newAction = new Action(req.body);
    try {
        await newAction.save();
        res.status(201).send(newAction);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Routes for the pages
app.get('/landing', (req, res) => {
    res.sendFile(__dirname + '/3d-website/index.html');
});

app.get('/training', (req, res) => {
    res.sendFile(__dirname + '/3d-website/training.html');
});

app.get('/detection', (req, res) => {
    res.sendFile(__dirname + '/3d-website/detection.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
