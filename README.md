# Classromm Connect

A full-stack application with a NestJS backend and React Native (Expo) frontend for Classroom Connect - an educational platform empowering early literacy.

## Project Structure

```
foundation_project/
├── backend/          # NestJS backend API
├── frontend/         # React Native (Expo) frontend
└── README.md         # This file
```

## Frontend Setup & Running

### Prerequisites

Before running the frontend, make sure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Expo CLI** (optional, but recommended)
  ```bash
  npm install -g expo-cli
  ```

### Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Application

#### Start the Development Server

```bash
npm start
```

or

```bash
yarn start
```

This will start the Expo development server and open the Expo Dev Tools in your browser.

#### Run on Specific Platforms

**For iOS Simulator:**

```bash
npm run ios
```

**For Android Emulator:**

```bash
npm run android
```

**For Web Browser:**

```bash
npm run web
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app in iOS simulator
- `npm run android` - Start the app in Android emulator
- `npm run web` - Start the app in web browser
- `npm run deploy` - Build and deploy the web version

### Development Workflow

1. Start the Expo development server with `npm start`
2. Scan the QR code with:

   - **iOS**: Camera app (requires Expo Go app)
   - **Android**: Expo Go app
   - **Web**: Press `w` in the terminal or open the URL shown

3. The app will automatically reload when you make changes to the code

### Tech Stack

**Frontend:**

- React Native 0.81.4
- Expo SDK 54
- Expo Router (File-based routing)
- NativeWind (Tailwind CSS for React Native)
- Zustand (State management)
- React Native SVG
- Expo Linear Gradient

### Frontend Architecture

The frontend follows a scalable folder structure:

```
frontend/src/
├── app/              # Expo Router pages/screens
├── components/       # Reusable React components
│   ├── layout/      # Layout components
│   ├── navigation/  # Navigation components
│   └── ui/          # UI components
├── stores/          # Zustand state management
├── hooks/           # Custom React hooks
├── services/        # API services
├── utils/           # Utility functions
├── constants/       # Application constants
└── config/          # Configuration files
```

For more details on the frontend structure, see `frontend/STRUCTURE.md`.

### Key Features

- **Authentication Flow**: Splash screen → Sign Up / Login → Home Dashboard
- **Bottom Navigation**: Consistent navigation across main screens
- **State Management**: Zustand stores for auth and app state
- **Responsive Design**: Works on iOS, Android, and Web
- **Modern UI**: Tailwind CSS styling with gradient backgrounds

### Troubleshooting

**Issue: Metro bundler errors**

- Clear cache: `npm start -- --clear` or `yarn start --clear`

**Issue: Port already in use**

- Kill the process using port 8081 or use `--port` flag

**Issue: Dependencies not installing**

- Delete `node_modules` and `package-lock.json`, then reinstall

**Issue: Expo Go app not connecting**

- Ensure your device and computer are on the same network
- Try using tunnel mode: `npm start -- --tunnel`

### Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on multiple platforms (iOS, Android, Web)
4. Submit a pull request
