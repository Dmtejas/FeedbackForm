const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/teacher_feedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  clarity: String,
  engagement: String,
  comments: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serves static files (HTML, CSS, JS)

// Routes
app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'feedback.html'));
});

app.post('/submit-feedback', async (req, res) => {
  try {
    const { name, email, clarity, engagement, comments } = req.body;
    const newFeedback = new Feedback({ name, email, clarity, engagement, comments });
    await newFeedback.save();
    res.redirect('/feedback');
  } catch (err) {
    console.error('❌ Error saving feedback:', err);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
