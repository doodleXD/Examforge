const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',                   // Local development
  'https://examforge-peach.vercel.app'       // Production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.FRONTEND_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/api/student', require('./routes/studentRoutes'));
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ExamForge API is awake!' });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

module.exports = app;