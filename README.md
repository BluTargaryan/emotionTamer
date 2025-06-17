# Emotion Tamer 🧘‍♂️

A comprehensive mindfulness and emotional regulation app built with Expo, designed to help users manage their emotions through various breathing and sensory exercises with full user authentication and progress tracking.

## Features

### **Breathing Exercises**
- **4-7-8 Breathing** - Classic breathing technique for relaxation
- **Box Breathing** - Four-count breathing pattern for focus
- **Alternate Nostril Breathing** - Traditional yogic breathing practice

### **Sensory Exercises**
- **5-4-3-2-1 Method** - Grounding technique using five senses
- **Color Noticing** - Mindfulness exercise focusing on specific colors
- **Soothing Sounds** - Audio-based relaxation sessions

### **User Management**
- **Complete Authentication System**
  - Email-based signup with verification codes
  - Secure login with password validation
  - Password reset with email verification
  - Automatic login with 1-hour session caching
- **Exercise History Tracking**
  - Detailed exercise logs with duration and date
  - Firebase cloud storage with offline caching
  - User-specific data isolation
- **Progress Monitoring**
  - Visual history display
  - Exercise completion tracking
  - Duration and frequency analytics

## Tech Stack

- **Framework**: Expo (SDK 53)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: React Context API
- **Backend**: Firebase Firestore
- **Local Storage**: AsyncStorage (with 1-hour caching)
- **Animations**: React Native Reanimated
- **UI Components**: 
  - Expo Vector Icons
  - Expo Blur
  - React Native SVG
  - Custom components with Tailwind styling

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

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
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

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
app/
├── (auth)/                    # Authentication flow
│   ├── signin.tsx            # Login screen
│   ├── signup.tsx            # Registration screen
│   ├── signupCodeVerification.tsx
│   ├── signUpPasswordSetup.tsx
│   ├── forgotPassword.tsx
│   ├── forgotPasswordCodeVerification.tsx
│   └── forgotPasswordReset.tsx
├── (main)/                   # Main app screens
│   └── home.tsx             # Dashboard with exercises and history
├── (breathing)/             # 4-7-8 Breathing exercise
├── (box)/                   # Box breathing exercise
├── (alternateNostrils)/     # Alternate nostril breathing
├── (FiveFourThreeTwoOne)/   # 5-4-3-2-1 grounding exercise
├── (colorNoticing)/         # Color noticing mindfulness
├── (soothingSounds)/        # Audio relaxation sessions
├── components/              # Reusable UI components
│   ├── CustomButton.tsx
│   ├── CustomTextInput.tsx
│   ├── CircleView.tsx
│   ├── ExerciseListItem.tsx
│   ├── HistoryListItem.tsx
│   ├── HomeExercises.tsx
│   ├── HomeHistory.tsx
│   └── TitleText.tsx
├── context/                 # React Context providers
│   └── AppContext.tsx      # Main app state and Firebase integration
├── config/                  # Configuration files
│   └── firebase.ts         # Firebase setup with environment variables
├── utils/                   # Utility functions and constants
│   └── ExerciseListValues.ts
└── index.tsx               # App entry point with auto-login
```

## Architecture

### **Authentication Flow**
1. **Signup**: Email → Verification Code → Password Setup → Auto-login
2. **Login**: Email/Password → Session Creation → Dashboard
3. **Password Reset**: Email → Verification Code → New Password

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

## Development Features

- **File-based routing** with Expo Router
- **TypeScript** for type safety
- **Custom Tailwind theme** with app-specific colors
- **Responsive design** with NativeWind
- **Error handling** with graceful fallbacks
- **Offline support** with AsyncStorage caching
- **Auto-login** with session management

## Color Scheme

```css
primary: #1E4335    /* Dark green */
secondary: #EBB87D  /* Light brown */
accent: #F4A54B     /* Orange */
background: #EDE6DE /* Cream */
text: #0F0C09       /* Dark brown */
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons from [Expo Vector Icons](https://icons.expo.fyi)
- Styling with [NativeWind](https://www.nativewind.dev)
- Backend powered by [Firebase](https://firebase.google.com)
- SVG graphics with [React Native SVG](https://github.com/software-mansion/react-native-svg)
