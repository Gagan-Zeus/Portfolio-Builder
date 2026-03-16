const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"DevFolio" <noreply@devfolio.app>',
    to,
    subject: 'Your DevFolio verification code',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h2 style="color: #111; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.5; margin-bottom: 32px;">
          Enter this code to complete your sign-in to DevFolio:
        </p>
        <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
