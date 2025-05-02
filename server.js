const express       = require('express');
const mongoose      = require('mongoose');
const session       = require('express-session');
const path          = require('path');
const bodyParser    = require('body-parser');

const app = express();
const PORT = 3000;

// ——— Middleware ———
app.use(express.static(__dirname));           // serve all .html, .js, .css in this folder
app.use(bodyParser.json());                   // parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'supersecuresecret',
  resave: false,
  saveUninitialized: false
}));

// ——— MongoDB Connection ———
// NOTE: password "tejasgowda@2006" must have the '@' URL‑encoded as '%40'
const MONGODB_URI = 'mongodb://Tejas:tejasgowda%402006@localhost:27017/feedbackDB?authSource=admin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// ——— Schema & Model ———
const feedbackSchema = new mongoose.Schema({
  studentName: String,
  email:       String,
  teacherName: String,
  subject:     String,
  otherSubject:String,
  clarity:     String,
  engagement:  String,
  comments:    String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ——— Routes ———

// Home → welcome.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Feedback form submission
app.post('/submit-feedback', async (req, res) => {
  try {
    const fb = new Feedback(req.body);
    await fb.save();
    res.json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error('Error saving feedback:', err.message);
    res.status(500).json({ message: 'Failed to submit feedback.' });
  }
});

// 2) Directly after your body‑parser middleware:
app.use(session({
  secret: 'supersecuresecret',
  resave: false,
  saveUninitialized: false
}));

// 3) Admin-login endpoint (expects JSON or form data from admin-login.html)
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'Tejas' && password === 'tejasgowda@2006') {
    req.session.isAdmin = true;
    return res.redirect('/dashboard');
  }

  // On invalid credentials, send back to login with an error flag
  return res.redirect('/admin-login.html?error=invalid');
});


// 4) Protected dashboard page
app.get('/dashboard', (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect('/admin-login.html');
  }
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// 5) Feedback-data API for your charts (admin only)
app.get('/feedback-data', async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving data' });
  }
});

// 6) (Optional) Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin-login.html'));
});

// ——— Start Server ———
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
