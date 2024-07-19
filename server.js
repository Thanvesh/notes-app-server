const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');

const cors = require('cors');
const scheduledTasks = require('./scheduledTasks'); // Ensure the correct path


const app = express();

app.use(express.json());

app.use(cors());

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());

app.use('/api/noteusers', userRoutes);
app.use('/api/notes', noteRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
