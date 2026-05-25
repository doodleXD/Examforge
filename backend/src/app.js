const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/api/student', require('./routes/studentRoutes'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

module.exports = app;