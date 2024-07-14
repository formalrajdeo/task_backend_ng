const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()

// Initialize Express app
const app = express();

// Body-parser middleware
app.use(bodyParser.json());
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

// MongoDB Connection
// const mongoURI = process.env.MONGO_URI;
const mongoURI = "mongodb://root:password@127.0.0.1:27018/task-management?authSource=admin&retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Task model
const Task = require('./models/Task');

// Routes
app.get('/', (req, res) => {
    res.send('Task Management API');
});

// Create a task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read one task
app.get('/api/tasks/:id', getTask, (req, res) => {
    res.json(res.task);
});

// Update a task
app.patch('/api/tasks/:id', getTask, async (req, res) => {
    if (req.body.title != null) {
        res.task.title = req.body.title;
    }
    if (req.body.description != null) {
        res.task.description = req.body.description;
    }
    if (req.body.status != null) {
        res.task.status = req.body.status;
    }
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
app.delete('/api/tasks/:id', getTask, async (req, res) => {
    try {
        const id = req.params.id;
        const tasks = await Task.deleteOne({ _id: id })
        res.json({ tasks, message: 'Deleted Task' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get task by id
async function getTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
        res.task = task;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
