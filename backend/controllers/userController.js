const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const users = req.db.collection('users');
    const existing = await users.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      favorites: []
    };

    const result = await users.insertOne(newUser);

    const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'User registered', userId: result.insertedId, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout user 
exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful — token should be deleted client-side' });
};

// Get favorites
exports.getFavorites = async (req, res) => {
  const users = req.db.collection('users');
  const { userId } = req.params;

  try {
    const user = await users.findOne({ _id: new req.db.bson.ObjectId(userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.favorites || []);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add favorite
exports.addFavorite = async (req, res) => {
  const { userId } = req.params;
  const recipe = req.body;

  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ _id: new req.db.bson.ObjectId(userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const already = (user.favorites || []).some(f => f.title === recipe.title);
    if (already) return res.status(409).json({ error: 'Already in favorites' });

    await users.updateOne(
      { _id: new req.db.bson.ObjectId(userId) },
      { $push: { favorites: recipe } }
    );

    res.json({ message: 'Added to favorites' });
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  const { userId } = req.params;
  const { title } = req.body;

  try {
    const users = req.db.collection('users');
    await users.updateOne(
      { _id: new req.db.bson.ObjectId(userId) },
      { $pull: { favorites: { title: title } } }
    );

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

// Clear all favorites
exports.clearFavorites = async (req, res) => {
  const { userId } = req.params;
  try {
    const users = req.db.collection('users');
    await users.updateOne(
      { _id: new req.db.bson.ObjectId(userId) },
      { $set: { favorites: [] } }
    );
    res.json({ message: "Favorites cleared" });
  } catch (err) {
    console.error("Clear favorites error:", err);
    res.status(500).json({ error: "Failed to clear favorites" });
  }
};

// Add item to shopping cart
exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  const { item } = req.body;

  try {
    const users = req.db.collection('users');
    const user = await users.findOne({ _id: new req.db.bson.ObjectId(userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.cart) user.cart = [];

    // Prevent duplicate cart items
    if (user.cart.includes(item)) {
      return res.status(409).json({ error: 'Item already in cart' });
    }

    await users.updateOne(
      { _id: new req.db.bson.ObjectId(userId) },
      { $push: { cart: item } }
    );

    res.json({ message: 'Item added to cart' });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

