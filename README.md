# Emotion Tamer 🧘‍♂️

A mindfulness and emotional regulation app built with Expo, designed to help users manage their emotions through various breathing and sensory exercises.

## Features

- **Breathing Exercises**
  - 4-7-8 Breathing
  - Box Breathing
  - Alternate Nostril Breathing

- **Sensory Exercises**
  - 5-4-3-2-1 Method
  - Color Noticing
  - Soothing Sounds

- **User Features**
  - User authentication
  - Exercise history tracking
  - Progress monitoring
  - Customizable experience

## Tech Stack

- **Framework**: Expo (SDK 53)
- **Navigation**: Expo Router
- **Styling**: NativeWind (TailwindCSS)
- **State Management**: React Context
- **Storage**: AsyncStorage
- **Animations**: React Native Reanimated
- **UI Components**: Expo Vector Icons, Expo Blur

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo Go app (for mobile testing)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
   ```bash
   git clone [your-repo-url]
   cd emotionTamer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run on your preferred platform
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
app/
├── (auth)/           # Authentication screens
├── (main)/           # Main app screens
├── (breathing)/      # Breathing exercise screens
├── (FiveFourThreeTwoOne)/ # 5-4-3-2-1 exercise screens
├── (box)/            # Box breathing screens
├── (alternateNostrils)/ # Alternate nostril breathing screens
├── (soothingSounds)/ # Soothing sounds screens
├── (colorNoticing)/  # Color noticing exercise screens
├── components/       # Reusable components
├── context/         # React Context providers
└── utils/           # Utility functions and constants
```

## Development

- The app uses file-based routing with Expo Router
- Styling is done using NativeWind (TailwindCSS)
- Animations are implemented using React Native Reanimated
- State management is handled through React Context

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
