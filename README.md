# Emotion Tamer 🧘‍♂️

A comprehensive mindfulness and emotional regulation app built with Expo, designed to help users manage their emotions through various breathing and sensory exercises with full user authentication, progress tracking, and gamified statistics.

## Features

### **Breathing Exercises**
- **4-7-8 Breathing** - Classic breathing technique for relaxation
- **Box Breathing** - Four-count breathing pattern for focus
- **Alternate Nostril Breathing** - Traditional yogic breathing practice

### **Sensory Exercises**
- **5-4-3-2-1 Method** - Grounding technique using five senses
- **Color Noticing** - Mindfulness exercise focusing on specific colors
- **Soothing Sounds** - Audio-based relaxation sessions

### **Gamified Progress System**
- **Level & XP System** - Earn experience points from exercise duration
- **Achievement Badges** - Unlock rewards for milestones and variety
- **Weekly Progress Tracking** - Visual progress circles and goals
- **Streak Counter** - Track consistent daily practice
- **Comprehensive Stats Dashboard** - Charts, analytics, and progress visualization

### **User Management**
- **Complete Authentication System**
  - Email-based signup with verification codes
  - Secure login with password validation
  - Password reset with email verification
  - Automatic login with 1-hour session caching
- **Professional Email Service**
  - Dedicated Node.js/Express server with Nodemailer
  - Beautifully designed HTML email templates
  - Verification and password reset emails
  - Hosted on Vercel for reliable delivery
- **Exercise History Tracking**
  - Detailed exercise logs with duration and date
  - Firebase cloud storage with offline caching
  - User-specific data isolation
- **Tab Navigation**
  - Home tab with exercises and gamified stats
  - Data tab with detailed exercise history

## Tech Stack

### **Frontend (React Native)**
- **Framework**: Expo (SDK 53)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing) + Expo Tabs
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: React Context API
- **Animations**: React Native Reanimated, React Native Animatable
- **Charts & Progress**: Victory Native, React Native Circular Progress
- **Icons**: Expo Vector Icons
- **Media**: Expo AV (audio playback)
- **Testing**: Jest + React Native Testing Library

### **Backend Services**
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Email Service**: Node.js + Express + Nodemailer (hosted on Vercel)
- **Local Storage**: AsyncStorage (with 1-hour caching)

### **Testing Infrastructure**
- **Framework**: Jest with React Native Testing Library
- **Coverage**: Full test coverage tracking
- **Mock System**: 
  - Firebase services (Auth, Firestore)
  - React Native components
  - Expo modules
  - Third-party libraries
- **Test Types**:
  - Unit tests for utilities and services
  - Component tests with mock interactions
  - Integration tests for complex features
  - Snapshot tests for UI consistency

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app (for mobile testing)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd emotionTamer
   ```

2. **Install main app dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase environment variables**
   - Create `.env.local` in the project root
   - Add your Firebase configuration:
   ```bash
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up the email server (optional for development)**
   ```bash
   cd server
   npm install
   ```
   - Create `.env` in the server directory with your email configuration
   - See [Server Setup](#server-setup) for detailed instructions

5. **Start the development server**
   ```bash
   # From the project root
   npx expo start
   ```

6. **Run tests**
   ```bash
   # Run all tests
   npm test

   # Run tests with coverage
   npm run test:coverage

   # Run tests in watch mode
   npm run test:watch
   ```

## Testing

### **Test Structure**
Tests are organized alongside their corresponding components in `__tests__` directories:

```
app/
├── components/
│   ├── __tests__/
│   │   ├── GamifiedStats.test.tsx
│   │   ├── SimpleGamifiedStats.test.tsx
│   │   ├── CustomButton.test.tsx
│   │   └── ... (other component tests)
│   └── ... (component files)
├── services/
│   ├── __tests__/
│   │   └── emailService.test.ts
│   └── ... (service files)
└── ... (other app files)
```

### **Mock System**
The testing environment includes comprehensive mocks for:
- React Native components and APIs
- Firebase services
- Expo modules
- Third-party libraries
- Custom components and services

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests for a specific file
npm test GamifiedStats

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Test Coverage**
Coverage reports are generated for:
- Statements
- Branches
- Functions
- Lines

Coverage reports can be found in the `coverage` directory after running tests with coverage.

## Server Setup

The app includes a dedicated email service server for sending verification and password reset emails.

### **Quick Setup (Using Hosted Version)**
The app is configured to use a hosted email service by default. No additional setup required for basic functionality.

### **Local Development Setup**

1. **Navigate to server directory**
   ```bash
   cd server
   npm install
   ```

2. **Configure email settings**
   Create a `.env` file in the server directory:
   ```bash
   # Email Configuration (Gmail example)
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

3. **Start the email server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

4. **Update app configuration**
   - In `app/services/emailService.ts`, update `EMAIL_SERVER_URL` to point to your local server
   - For React Native development, use your computer's IP address instead of localhost

### **Email Service Features**
- **Professional HTML Templates** - Branded verification and password reset emails
- **Multiple Provider Support** - Gmail, Outlook, Yahoo, custom SMTP
- **API Endpoints**:
  - `GET /health` - Service health check
  - `POST /send-verification-email` - Send signup verification
  - `POST /send-password-reset-email` - Send password reset
  - `POST /test-email` - Development testing endpoint
- **Production Ready** - Hosted on Vercel with CORS and security headers

## Project Structure

```
emotionTamer/
├── app/                          # Main application code
│   ├── (auth)/                   # Authentication flow
│   │   ├── signin.tsx           # Login screen
│   │   ├── signup.tsx           # Registration screen
│   │   ├── signupCodeVerification.tsx
│   │   ├── signUpPasswordSetup.tsx
│   │   ├── forgotPassword.tsx
│   │   ├── forgotPasswordCodeVerification.tsx
│   │   └── forgotPasswordReset.tsx
│   ├── (main)/                  # Main app screens with tab navigation
│   │   ├── _layout.tsx         # Tab navigator (Home & Data)
│   │   ├── home.tsx            # Dashboard with exercises and stats
│   │   └── data.tsx            # Exercise history and analytics
│   ├── (breathing)/            # 4-7-8 Breathing exercise flow
│   ├── (box)/                  # Box breathing exercise flow
│   ├── (alternateNostrils)/    # Alternate nostril breathing flow
│   ├── (FiveFourThreeTwoOne)/  # 5-4-3-2-1 grounding exercise flow
│   ├── (colorNoticing)/        # Color noticing mindfulness flow
│   ├── (soothingSounds)/       # Audio relaxation sessions flow
│   ├── components/             # Reusable UI components
│   │   ├── CustomButton.tsx
│   │   ├── CustomTextInput.tsx
│   │   ├── CustomNumberInput.tsx
│   │   ├── CircleView.tsx
│   │   ├── ExerciseListItem.tsx
│   │   ├── HistoryListItem.tsx
│   │   ├── HomeExercises.tsx
│   │   ├── HomeHistory.tsx
│   │   ├── GamifiedStats.tsx           # Full stats with charts
│   │   ├── SimpleGamifiedStats.tsx     # Lightweight stats version
│   │   ├── MiniAuthRedirect.tsx
│   │   └── TitleText.tsx
│   ├── context/                # React Context providers
│   │   └── AppContext.tsx     # Main app state and Firebase integration
│   ├── services/              # External service integrations
│   │   └── emailService.ts    # Email service API client
│   ├── config/                # Configuration files
│   │   └── firebase.ts        # Firebase setup with environment variables
│   ├── utils/                 # Utility functions and constants
│   │   └── ExerciseListValues.ts
│   └── index.tsx              # App entry point with auto-login
├── server/                    # Email service backend
│   ├── server.ts             # Express server with Nodemailer
│   ├── package.json          # Server dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   ├── vercel.json           # Vercel deployment config
│   └── README.md             # Server setup instructions
├── assets/                   # Static assets
│   ├── images/              # Icons, illustrations, and graphics
│   └── fonts/               # Custom fonts
└── config files             # Babel, ESLint, Tailwind, Metro configs
```

## Architecture

### **Authentication Flow**
1. **Signup**: Email → Email Verification Code → Password Setup → Auto-login
2. **Login**: Email/Password → Session Creation → Dashboard
3. **Password Reset**: Email → Email Verification Code → New Password → Auto-login

### **Data Storage**
- **Firebase Firestore**: Primary data storage
  - User accounts (`users/{email}`)
  - Exercise history (`history/{userId}`)
  - Session management (`sessions/current`)
  - Verification codes (temporary)
- **AsyncStorage**: Local caching with 1-hour expiration
  - User sessions
  - Exercise history (offline access)

### **State Management**
- React Context API for global state
- User authentication state
- Exercise history management
- Loading states and error handling
- Gamification statistics and achievements

### **Email System Architecture**
- **Decoupled Design**: Separate Node.js server for email functionality
- **Fallback Handling**: Graceful degradation if email service is unavailable
- **Template System**: HTML email templates with inline CSS for compatibility
- **Environment Flexibility**: Supports local development and production deployment

## Gamification System

### **Experience & Levels**
- Earn **1 XP per second** of exercise time
- Level up every **1,800 XP** (30 minutes of practice)
- Visual level badges and progress indicators

### **Achievement System**
- **First Steps** - Complete your first exercise
- **Getting Started** - Complete 5 exercises
- **Marathon** - Accumulate 30 minutes (1,800 XP) total
- **Variety Seeker** - Try 3 different exercise types

### **Progress Tracking**
- **Weekly Goals** - Track progress toward weekly exercise targets
- **Streak Counter** - Monitor consistent daily practice
- **Statistics** - Total sessions, minutes practiced, XP earned
- **Visual Dashboards** - Circular progress indicators and achievement galleries

## Development Features

- **File-based routing** with Expo Router
- **TypeScript** for type safety throughout
- **Custom Tailwind theme** with app-specific colors
- **Responsive design** with NativeWind
- **Comprehensive error handling** with graceful fallbacks
- **Offline support** with AsyncStorage caching
- **Auto-login** with session management
- **Hot reloading** for rapid development
- **Modular architecture** with reusable components

## Color Scheme

```css
primary: #1E4335      /* Dark green - headers, buttons, text */
secondary: #EBB87D    /* Light brown - secondary buttons */
accent: #F4A54B       /* Orange - highlights, notifications */
background: #EDE6DE   /* Cream - main background */
text: #0F0C09         /* Dark brown - body text */
success: #10B981      /* Green - achievements, success states */
warning: #F59E0B      /* Amber - warnings, incomplete states */
error: #EF4444        /* Red - errors, destructive actions */
```

## Available Scripts

### **Main App**
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint code quality checks

### **Email Server**
- `cd server && npm run dev` - Start development server with auto-restart
- `cd server && npm start` - Start production server
- `cd server && npm run build` - Build TypeScript to JavaScript

## Deployment

### **App Deployment**
- **Expo Application Services (EAS)** for app store deployment
- **Web deployment** supported via Expo web build

### **Server Deployment**
- **Vercel** (configured) - Serverless functions with global CDN
- **Railway**, **Heroku**, or any Node.js hosting service
- **Docker** support for containerized deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use NativeWind classes for styling
- Add proper error handling for all async operations
- Test on both iOS and Android platforms
- Update documentation for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
- Icons from [Expo Vector Icons](https://icons.expo.fyi)
- Styling with [NativeWind](https://www.nativewind.dev)
- Backend powered by [Firebase](https://firebase.google.com)
- Email service with [Nodemailer](https://nodemailer.com)
- Charts and visualizations with [Victory Native](https://commerce.nearform.com/open-source/victory-native)
- SVG graphics with [React Native SVG](https://github.com/software-mansion/react-native-svg)
- Animations with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated)

---

**Note**: This app focuses on mental wellness and emotional regulation. The gamification features are designed to encourage healthy habits and consistent practice, not to create addictive engagement patterns.
