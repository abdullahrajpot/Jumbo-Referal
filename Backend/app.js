// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const userRoutes = require('./routes/userRoutes');
const depositRoutes = require('./routes/deposit');
const mlmRoutes = require('./routes/mlm');


const connectDB = require('./config/db');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

connectDB();

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/users', userRoutes); 

app.use('/api', depositRoutes);

app.use('/api/mlm-tree', mlmRoutes);



app.all('*', (req, res) => {
  console.log('Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}`);
  console.log(`Register URL: http://localhost:${PORT}/api/users/register`);
});
