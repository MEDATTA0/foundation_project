# Frontend Setup Guide

## Quick Fix for Network Connection Issues

If you're seeing "Failed to connect to localhost/127.0.0.1:8000" errors, you're running the app on a physical device or emulator. You need to use your machine's IP address instead of `localhost`.

### Step 1: Create `.env` file

Create a `.env` file in the `frontend/` directory:

```bash
EXPO_PUBLIC_API_URL=http://172.16.17.160:8000
```

**Note:** Replace `172.16.17.160` with your actual machine IP if it's different.

### Step 2: Find Your IP Address (if needed)

- **Linux:** `hostname -I` or `ip addr show`
- **macOS:** `ipconfig getifaddr en0` or `ifconfig | grep "inet "`
- **Windows:** `ipconfig` (look for IPv4 Address)

### Step 3: Restart Expo

After creating/updating the `.env` file, restart your Expo server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

### Step 4: Verify Connection

Check the console logs when the app starts. You should see:

```
🔌 API Configuration: { baseURL: "http://172.16.17.160:8000", ... }
```

### Troubleshooting

1. **Still can't connect?**

   - Make sure your device and computer are on the same network
   - Check your firewall allows connections on port 8000
   - Verify the backend is running: `curl http://localhost:8000/api/docs`

2. **For Web Development:**

   - You can use `localhost` when running in a web browser
   - Create a `.env.local` file with: `EXPO_PUBLIC_API_URL=http://localhost:8000`

3. **For Physical Devices:**
   - Always use your machine's IP address
   - Make sure both devices are on the same Wi-Fi network
