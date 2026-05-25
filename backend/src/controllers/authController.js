const bcrypt = require('bcrypt');
const prisma = require('../utils/prismaClient');
const { generateToken } = require('../utils/jwt');
const { generateOtp, verifyOtp } = require('../services/otpService');
const { sendOtpEmail } = require('../services/emailService');

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = email.endsWith('iitr.ac.in') ? 'admin' : 'student';

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      // ✅ If user exists via Google, allow them to add a password
      if (existing.authProvider === 'google') {
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: {
            passwordHash,
            authProvider: 'both', // can now login via both
          }
        });
        const otp = await generateOtp(existing.id);
        await sendOtpEmail(email, otp);
        res.json({ message: 'OTP sent to email', userId: existing.id, role: existing.role });
      } else {
        return res.status(400).json({ message: 'Email already registered. Please login.' });
      }
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, authProvider: 'email' }
    });

    const otp = await generateOtp(user.id);
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to email', userId: user.id, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Allow login if authProvider is 'email' or 'both'
    if (user.authProvider === 'google') {
      return res.status(400).json({ message: 'This account uses Google login. Please use Google to sign in.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const otp = await generateOtp(user.id);
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to email', userId: user.id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
const verifyOtpController = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = await verifyOtp(userId, otp);
    if (!result.success) return res.status(400).json({ message: result.message });

    const token = generateToken(user.id, user.role, user.email);
    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = await generateOtp(user.id);
    await sendOtpEmail(user.email, otp);

    res.json({ message: 'OTP resent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const googleCallback = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user.id, user.role, user.email);
    // Redirect to frontend with token and role in URL
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&role=${user.role}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/?error=google_failed`);
  }
};

module.exports = { register, login, verifyOtpController, resendOtp, googleCallback };