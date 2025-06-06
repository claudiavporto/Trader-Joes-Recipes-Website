exports.submitForm = async (req, res) => {
  const { name, email, message } = req.body;
  console.log('CONTACT FORM SUBMISSION:', { name, email, message });

  const messages = req.db.collection('messages');

  try {
    await messages.insertOne({ name, email, message, date: new Date() });
    res.status(201).json({ message: 'Message received!' });
  } catch (err) {
    console.error('ERROR SAVING MESSAGE:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
};
