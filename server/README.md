# EmotionTamer Email Service

This is the backend email service for the EmotionTamer app using Node.js, Express, and Nodemailer.

## Setup Instructions

### 1. Install Dependencies

Navigate to the server directory and install the required packages:

```bash
cd server
npm install
```

### 2. Email Configuration

#### For Gmail (Recommended for development):

1. Create a `.env` file in the server directory
2. Copy the contents from `env.example` to `.env`
3. Configure your Gmail settings:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Server Configuration
PORT=3001
NODE_ENV=development

# App Configuration
APP_NAME=EmotionTamer
FRONTEND_URL=http://localhost:3000
```

#### Getting a Gmail App Password:

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. At the bottom, select "App passwords"
4. Generate a new app password for "Mail"
5. Use this generated password in the `EMAIL_PASS` field

#### For Other Email Providers:

Update the `EMAIL_HOST` and `EMAIL_PORT` values according to your provider:

- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's SMTP settings

### 3. Start the Server

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The email service will start on port 3001 (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- **GET** `/health`
- Returns the service status

### Send Verification Email
- **POST** `/send-verification-email`
- Body: `{ "email": "user@example.com", "code": "123456" }`
- Sends a verification code email to the user

### Send Password Reset Email
- **POST** `/send-password-reset-email`
- Body: `{ "email": "user@example.com", "code": "123456" }`
- Sends a password reset code email to the user

### Test Email (Development Only)
- **POST** `/test-email`
- Body: `{ "email": "user@example.com" }`
- Sends a test email to verify the email service is working

## Usage in React Native App

The email service is automatically integrated with the AppContext. The app will:

1. Generate verification/reset codes
2. Call the email service API to send emails
3. Handle email sending success/failure gracefully

## Email Templates

The server includes beautifully designed HTML email templates for:
- **Verification emails**: Welcome message with verification code
- **Password reset emails**: Security-focused reset code email

Both templates include:
- Responsive design
- Brand colors and styling
- Clear call-to-action
- Security notices
- Professional layout

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check your email credentials and app password
2. **Connection refused**: Ensure the server is running on the correct port
3. **CORS errors**: Make sure CORS is properly configured for your frontend URL

### Development Tips:

1. Use the `/test-email` endpoint to verify your email configuration
2. Check the server console for detailed error messages
3. Ensure your firewall allows connections on port 3001

## Security Considerations

- Never commit your `.env` file to version control
- Use app passwords instead of regular passwords
- Consider using environment-specific configurations
- Implement rate limiting in production
- Use HTTPS in production environments

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Configure your production SMTP settings
4. Update the `EMAIL_SERVER_URL` in the React Native app
5. Implement proper logging and monitoring 