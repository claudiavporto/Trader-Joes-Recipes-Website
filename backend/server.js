const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../views')));
app.use(express.static(path.join(__dirname, '../')));

// TEMP test route
app.get('/test', (req, res) => {
  res.send("Server is working!");
});

let db;

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    db = client.db('PortoCSC240');

    // Attach db + ObjectId to every request
    app.use((req, res, next) => {
      req.db = db;
      req.db.bson = { ObjectId };
      next();
    });

    // Routes
    app.use('/api/recipes', recipeRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/shopping', shoppingListRoutes);
    app.use('/api/contact', contactRoutes);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();
