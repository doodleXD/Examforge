const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Let Nodemailer automatically figure out the best host/port
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  family: 4, // Keep the IPv4 fix!
  tls: {
    rejectUnauthorized: false // Bypasses strict SSL handshake freezes on cloud servers
  },
  connectionTimeout: 10000 
});

const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"ExamForge" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your ExamForge OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #1F3864; text-align: center; margin-bottom: 24px;">ExamForge</h2>
          <p style="color: #333333; font-size: 16px;">Hello,</p>
          <p style="color: #333333; font-size: 16px;">Your One-Time Password (OTP) for login is:</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <h1 style="letter-spacing: 8px; color: #2E75B6; background-color: #f4f7fa; padding: 12px 20px; border-radius: 6px; display: inline-block; margin: 0;">
              ${otp}
            </h1>
          </div>
          
          <p style="color: #666666; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
          <p style="color: #999999; font-size: 12px; text-align: center;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`✅ OTP Email sent successfully to: ${email}`);
  } catch (error) {
    console.error("🚨 CRASH in sendOtpEmail:", error);
    throw error; // Passes the error up so the route knows it failed
  }
};

module.exports = { sendOtpEmail };