# BoarCast Mobile Setup

## Prerequisites

Before starting, make sure you have installed:

* Node.js
* npm
* Expo Go (iOS or Android)

---

# Backend

The backend is deployed using Railway, so no local backend setup is required.

Make sure the frontend environment variables are configured to use the deployed Railway API URL.

Example:

```env id="mmtif6"
EXPO_PUBLIC_API_URL=https://your-railway-url.up.railway.app
```

---

# Frontend Setup

Navigate to the frontend folder:

```bash id="n0n7qd"
cd frontend
```

Install frontend dependencies:

```bash id="1a9cwa"
npm install
```

Start the Expo development server:

```bash id="r6n97u"
npx expo start
```

---

# Running the Mobile App

1. Install Expo Go on your mobile device
2. Open the Expo Go app
3. Scan the QR code shown in the terminal or browser
4. The app will launch on your device
