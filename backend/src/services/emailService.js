const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"ExamForge" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your ExamForge OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2 style="color: #1F3864;">ExamForge</h2>
        <p>Your OTP for login is:</p>
        <h1 style="letter-spacing: 8px; color: #2E75B6;">${otp}</h1>
        <p>Valid for <strong>10 minutes</strong>. Do not share this with anyone.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };