import config from './config.js';
import nodemailer from 'nodemailer';
import AppError from '../utils/AppError.js';

const smtpPort = Number(config.smtpPort || 465);

const transporter = nodemailer.createTransport({
  secure: smtpPort === 465,
  host: config.smtpHost,
  port: smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error(`SMTP server connection check failed: ${error.message}`);
    return;
  }

  console.log('SMTP server is ready to take messages');
});

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"BrainWave AI" <${config.smtpUser}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}\n info: ${JSON.stringify(info)}`);
    return { info };
  } catch (error) {
    throw new AppError(`Failed to send email: ${error.message}`, 500);
  }
};

export default sendMail;