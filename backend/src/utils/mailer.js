import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'your_smtp_host') {
    console.log(`\n================================`);
    console.log(`📧 [MOCK EMAIL SENT]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html}`);
    console.log(`================================\n`);
    return;
  }
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM || 'noreply@scanthemall.com', to, subject, html });
  } catch (error) {
    console.error('Email send error:', error);
  }
};
