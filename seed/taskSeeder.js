// taskSeeder.js
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const Task = require('../models/Task'); // Adjust the path as needed

// Define data to seed into the tasks collection
const tasksData = require('../data/Tasks.json');


// MongoDB connection URL
// const mongoURI = process.env.MONGO_URI;
const mongoURI = "mongodb://root:password@127.0.0.1:27018/task-management?authSource=admin&retryWrites=true&w=majority";
console.log({ mongoURI })
// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Function to seed data into the database
const seedTasks = async () => {
    try {
        // Delete existing tasks before seeding (optional)
        await Task.deleteMany();

        // Insert the tasks data into the database
        await Task.insertMany(tasksData);

        console.log('Seeding complete');
    } catch (err) {
        console.error('Error seeding database:', err.message);
    } finally {
        // Close the connection
        mongoose.disconnect();
    }
};

// Call the seeding function
seedTasks();