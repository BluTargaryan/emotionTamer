import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

// Middleware
const corsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const getVerificationEmailTemplate = (code: string, appName = 'EmotionTamer') => {
  return {
    subject: `${appName} - Email Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">${appName}</h1>
          <p style="color: #6B7280; margin: 10px 0;">Welcome to your emotional wellness journey</p>
        </div>
        
        <div style="background-color: #F9FAFB; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="color: #4B5563; margin-bottom: 30px;">
            Thank you for signing up! Please use the verification code below to complete your registration:
          </p>
          
          <div style="background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
            This code will expire in 15 minutes for your security.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>&copy; 2024 ${appName}. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      ${appName} - Email Verification
      
      Welcome to your emotional wellness journey!
      
      Thank you for signing up! Please use the verification code below to complete your registration:
      
      Verification Code: ${code}
      
      This code will expire in 15 minutes for your security.
      
      If you didn't request this verification, please ignore this email.
    `
  };
};

const getPasswordResetEmailTemplate = (code: string, appName = 'EmotionTamer') => {
  return {
    subject: `${appName} - Password Reset Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">${appName}</h1>
          <p style="color: #6B7280; margin: 10px 0;">Your emotional wellness companion</p>
        </div>
        
        <div style="background-color: #FEF3F2; padding: 30px; border-radius: 10px; text-align: center; border-left: 4px solid #EF4444;">
          <h2 style="color: #1F2937; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #4B5563; margin-bottom: 30px;">
            We received a request to reset your password. Use the code below to create a new password:
          </p>
          
          <div style="background-color: #EF4444; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
            This code will expire in 15 minutes for your security.
          </p>
        </div>
        
        <div style="background-color: #FEF9C3; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #92400E; font-size: 14px; margin: 0;">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and consider updating your account security.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
          <p>&copy; 2024 ${appName}. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      ${appName} - Password Reset
      
      Password Reset Request
      
      We received a request to reset your password. Use the code below to create a new password:
      
      Reset Code: ${code}
      
      This code will expire in 15 minutes for your security.
      
      If you didn't request this password reset, please ignore this email and consider updating your account security.
    `
  };
};

// API Routes

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Email service is running' });
});

// Send verification email
app.post('/send-verification-email', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    const transporter = createTransporter();
    const emailTemplate = getVerificationEmailTemplate(code, process.env.APP_NAME);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Verification code sent to ${email}`
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }
});

// Send password reset email
app.post('/send-password-reset-email', async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and reset code are required'
      });
    }

    const transporter = createTransporter();
    const emailTemplate = getPasswordResetEmailTemplate(code, process.env.APP_NAME);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Password reset code sent to ${email}`
    });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email'
    });
  }
});

// Test email endpoint (for development)
app.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'EmotionTamer - Email Service Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Service Test</h2>
          <p>This is a test email from the EmotionTamer email service.</p>
          <p>If you received this email, the email service is working correctly!</p>
        </div>
      `,
      text: 'This is a test email from the EmotionTamer email service. If you received this email, the email service is working correctly!',
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Test email sent to ${email}`
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Verify email configuration on startup
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Warning: EMAIL_USER and EMAIL_PASS environment variables are not set');
    console.warn('   Please configure your email settings in the .env file');
  } else {
    console.log('✅ Email service configured and ready');
  }
});

module.exports = app; 