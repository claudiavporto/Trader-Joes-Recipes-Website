exports.getShoppingList = async (req, res) => {
  const { userId } = req.params;
  try {
    const list = await req.db.collection('shoppingList').findOne({ userId: new req.db.bson.ObjectId(userId) });
    res.json(list?.items || []);
  } catch (err) {
    console.error("Get shopping list error:", err);
    res.status(500).json({ error: "Failed to load shopping list" });
  }
};

exports.addItem = async (req, res) => {
  const { userId } = req.params;
  const item = req.body.item?.trim();
  if (!item) return res.status(400).json({ error: "No item provided" });
  try {
    const shoppingList = req.db.collection('shoppingList');
    await shoppingList.updateOne(
      { userId: new req.db.bson.ObjectId(userId) },
      { $addToSet: { items: item } },
      { upsert: true }
    );
    res.json({ message: "Item added to shopping list" });
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};

exports.removeItem = async (req, res) => {
  const { userId } = req.params;
  const { item } = req.body;
  try {
    const result = await req.db.collection('shoppingList').updateOne(
      { userId: new req.db.bson.ObjectId(userId) },
      { $pull: { items: item } }
    );
    res.json({ message: "Item removed from shopping list", result});
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

exports.clearList = async (req, res) => {
  const { userId } = req.params;
  try {
    await req.db.collection('shoppingList').updateOne(
      { userId: new req.db.bson.ObjectId(userId) },
      { $set: { items: [] } }
    );
    res.json({ message: "Shopping list cleared" });
  } catch (err) {
    console.error("Clear list error:", err);
    res.status(500).json({ error: "Failed to clear shopping list" });
  }
};
