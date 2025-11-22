# Classroom Connect - Frontend

Expo Router and Tailwind CSS based mobile application.

## 🚀 Quick Start

```sh
npm install
npm start
```

## ⚙️ Configuration

### API URL Configuration

The app connects to the backend API. Configure the API URL using environment variables:

1. **Create a `.env` file** in the `frontend/` directory:

   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

2. **For Physical Devices/Emulators:**

   - Replace `localhost` with your machine's IP address
   - Find your IP:
     - Linux: `hostname -I` or `ip addr show`
     - macOS: `ipconfig getifaddr en0` or `ifconfig | grep "inet "`
     - Windows: `ipconfig` (look for IPv4 Address)
   - Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:8000`

3. **Important Notes:**
   - Environment variables must be prefixed with `EXPO_PUBLIC_`
   - Restart Expo server after changing `.env` file
   - Ensure your device and computer are on the same network
   - Make sure your firewall allows connections on port 8000

### Troubleshooting Network Errors

If you see "Network error. Please check your connection":

1. **Check Backend Status:**

   ```bash
   cd ../backend
   # Verify backend is running on port 8000
   curl http://localhost:8000/api/docs
   ```

2. **Check API URL:**

   - Look at the console logs when the app starts
   - You should see: `🔌 API Configuration: { baseURL: "...", ... }`
   - Verify the URL is correct for your setup

3. **Common Issues:**
   - **ECONNREFUSED**: Backend not running or wrong port
   - **ENOTFOUND**: Wrong hostname/IP address
   - **ETIMEDOUT**: Firewall blocking or network issues

## 📱 Development

- **Web**: `npm run web`
- **Android**: `npm run android`
- **iOS**: `npm run ios`

## Deploy

Deploy on all platforms with Expo Application Services (EAS).

- Deploy the website: `npx eas-cli deploy` — [Learn more](https://docs.expo.dev/eas/hosting/get-started/)
- Deploy on iOS and Android using: `npx eas-cli build` — [Learn more](https://expo.dev/eas)
