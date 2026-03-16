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

async function sendContactEmail(name, type, message) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"DevFolio" <noreply@devfolio.app>',
    to: 'gaganch17210@gmail.com',
    subject: `DevFolio Contact: ${type}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
        <h2 style="color: #111; font-size: 22px; font-weight: 700; margin-bottom: 24px;">New Contact Request</h2>
        <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 14px; width: 100px;">Name</td>
              <td style="padding: 8px 0; color: #111; font-size: 14px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 14px;">Type</td>
              <td style="padding: 8px 0; color: #111; font-size: 14px; font-weight: 600;">${type}</td>
            </tr>
          </table>
        </div>
        <div style="margin-bottom: 24px;">
          <p style="color: #888; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
          <p style="color: #333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #bbb; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px;">Sent via DevFolio Contact Form</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail, sendContactEmail };
