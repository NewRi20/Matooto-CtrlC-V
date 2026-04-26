# Matooto

Matooto is a learning app for reading comprehension, with:
- A mobile frontend for students/teachers (Expo + React Native)
- A backend API for AI-powered story/question generation and comprehension tagging (Express + Gemini)
- Firebase for authentication, Firestore data, and storage

## Project Overview

### Frontend (`/frontend`)
- Built with Expo Router + React Native + TypeScript
- Uses Firebase client SDK for auth/data/storage
- Teacher flow includes generating and posting assessments

### Backend (`/backend`)
- Built with Node.js + Express + TypeScript
- Exposes endpoints like:
  - `POST /api/stories/generate`
  - `POST /api/questions/generate`
  - `POST /api/comprehension/evaluate`
  - `GET /health`
- Uses Google Gemini API for AI generation
- Includes RAG-related service code with Firebase Admin

## Credits / Tools / Frameworks

- [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/) for mobile app development
- [Expo Router](https://docs.expo.dev/router/introduction/) for routing
- [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- [Express](https://expressjs.com/) for backend API
- [Google Gemini API](https://ai.google.dev/) via `@google/generative-ai`
- [TypeScript](https://www.typescriptlang.org/) across frontend and backend
- [Ngrok](https://ngrok.com/) (currently used in frontend assessment create flow for public backend URL during development)

## Run on Localhost

### 1. Prerequisites

- Node.js 18+ (recommended LTS)
- npm
- Expo Go app (if using a physical device) or Android/iOS emulator

### 2. Environment Variables

Create/populate the existing `.env` files:

#### `backend/.env`
- `GEMINI_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- Optional: `PORT` (defaults to `3000`)

#### `frontend/.env`
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

### 3. Install dependencies

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 4. Start backend (Terminal 1)

```bash
cd backend
npm run dev
```

Expected: backend listens on `http://localhost:3000` unless `PORT` is set.

### 5. Point frontend to localhost backend

Current file:
- `frontend/app/(teacher)/assessments/create.tsx`

Current constant:
- `API_BASE_URL = "https://geriatric-radial-coroner.ngrok-free.dev"`

For local backend testing, change it to one of:
- `http://localhost:3000` (iOS simulator / web)
- `http://10.0.2.2:3000` (Android emulator)
- `http://<your-local-ip>:3000` (physical phone on same Wi-Fi)

### 6. Start frontend (Terminal 2)

```bash
cd frontend
npm run start
```

Then open in:
- Expo Go (scan QR)
- Android emulator (`npm run android`)
- iOS simulator (`npm run ios`)
- Web (`npm run web`)

### 7. Quick health check

Open:
- `http://localhost:3000/health`

You should see:
- `{"status":"ok","message":"Matooto backend is running"}`
