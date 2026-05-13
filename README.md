# BidHub — Malawi Marketplace

A mobile-first Progressive Web App (PWA) that connects buyers and sellers in Malawi. Buyers post requests describing what they need and their budget; sellers browse those requests and compete by submitting bids. When a buyer accepts a bid, both parties can continue the conversation through in-app messaging.

## How it works

**Buyers**
1. Sign up and select the *Buy / Request* role.
2. Post a request — title, description, budget (MWK), category, location, and optional photos.
3. Receive bids from sellers and accept or decline each one.
4. Chat with an accepted seller directly in the app.

**Sellers**
1. Sign up and select the *Sell / Bid* role.
2. Browse open buyer requests, filtered by category or searched by keyword.
3. Submit a bid with a price and offer description.
4. Chat with buyers who accept your bid.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Routing | React Router v7 |
| State management | Zustand |
| Backend / Auth | Firebase (Auth — phone OTP, Firestore, Storage) |
| Internationalisation | i18next (English + Chichewa) |
| PWA | vite-plugin-pwa (auto-update service worker) |
| Icons | Lucide React |
| Image handling | browser-image-compression |

## Project structure

```
src/
├── features/
│   ├── auth/        # Onboarding, phone OTP, role selection
│   ├── buyer/       # Home feed, post request, view bids
│   ├── seller/      # Browse requests, request detail, my bids
│   ├── messages/    # In-app chat
│   ├── profile/     # User profile & settings
│   ├── layout/      # Shared shell & bottom navigation
│   └── search/      # Search bar component
├── models/          # TypeScript interfaces (Product, BuyerRequest, Bid)
├── services/        # Firebase initialisation, image utilities, mock data
├── store/           # Zustand auth store
├── hooks/           # Shared custom hooks
├── i18n/            # English & Chichewa translation strings
└── styles/          # Global CSS variables
```

## Getting started

### Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com/) project with **Phone Authentication**, **Firestore**, and **Storage** enabled.

### 1. Clone and install

```bash
git clone <repo-url>
cd bidhub2
npm install
```

### 2. Configure Firebase

Open `src/services/firebase.ts` and replace the placeholder values with your Firebase project credentials:

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check then produce a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Categories

Phones · Fashion · Electronics · Cars · Farming · Household · Beauty

## Languages

The UI supports **English** and **Chichewa (Nyanja)**. The language is selected during onboarding and can be changed from the profile screen.
