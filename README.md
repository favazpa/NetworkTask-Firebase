# NetworkTask

A React Native app that uses **Firebase** for authentication, chat, and push notifications.

---

## 🚀 How to Run

1. Clone the repo

   ```bash
   git clone <repo-url>
   cd NetworkTask
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. iOS setup (if needed)

   ```bash
   cd ios && pod install && cd ..
   ```

4. Add Firebase config files

   * `google-services.json` → `android/app/`
   * `GoogleService-Info.plist` → `ios/`

5. Create a `.env` file in the root (not included in git). Example:

   ```dotenv
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   FIREBASE_PROJECT_ID=your-app
   FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=1234567890
   FIREBASE_APP_ID=1:1234567890:web:abcdef123456
   ```

6. Run the app

   ```bash
   npm start
   npm run android   # for Android
   npm run ios       # for iOS
   ```

---

## 🔑 Main Features

* Firebase Authentication (sign up / login)
* Send & receive chat messages via Firebase
* Push Notifications (FCM)
* Simple navigation flow (Login → Home → Chat)

---

## 🛠 Tools & Stack

* React Native (TypeScript)
* Firebase (Auth, Firestore/RTDB, FCM)
* Zustad (Global State Management)
* React Navigation
* npm (package manager)

---

## ⚠️ Notes

* `.env` is required for backend config (not committed to git)
