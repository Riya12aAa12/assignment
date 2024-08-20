const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors()); // Add this line to allow CORS

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth')); // For registration and login
app.use('/api/protected', require('./routes/protected')); // For protected routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
