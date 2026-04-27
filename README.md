# Privy POC (Register/Login + embedded wallet)

POC minimal pour tester Privy sur un projet independant de Darvest.
# Privy Wallet Onboarding POC

Production-style proof of concept for frictionless Web3 onboarding:
- Email OTP authentication (passwordless)
- Automatic embedded wallet creation (Privy)
- Wallet dashboard with address + explorer link
- SPA routing + Netlify-ready deployment

## Tech Stack
- React 18 + TypeScript + Vite
- Privy (`@privy-io/react-auth`)
- React Router
- Netlify (`netlify.toml`)

## Features
- Register/Login with email OTP
- Auto wallet creation for users without wallet
- Wallet fallback creation flow (`createWallet`) if needed
- Wallet address display + Polygon Amoy explorer link
- Clean, structured UI for demo/presentation use

## Environment Variables
Create `.env` from `.env.example`:

VITE_PRIVY_APP_ID=your_app_id
VITE_PRIVY_CLIENT_ID=your_client_id
VITE_POLYGONSCAN_BASE_URL=https://amoy.polygonscan.com

## 1) Prérequis

- Node.js 18+ (recommandé)

## 2) Configuration Privy

Dans le dashboard Privy, récupère:

- **App ID**
- **Client ID**

Puis:

```bash
cd privy-poc
cp .env.example .env
```

Renseigne `.env`:

```env
VITE_PRIVY_APP_ID=...
VITE_PRIVY_CLIENT_ID=...
VITE_POLYGONSCAN_BASE_URL=https://amoy.polygonscan.com
```

## 3) Lancer le projet

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5174`.

## 4) Ce que tu dois observer

- Sur Register ou Login, tu reçois un OTP par email.
- Après validation, tu arrives sur `/wallet`.
- L'écran affiche `Wallet (address)` : c'est l'adresse du wallet embedded.
- Le bouton "Voir sur explorer" ouvre PolygonScan avec l'adresse wallet.

Note: le wallet embedded est configuré pour se créer automatiquement:

`embeddedWallets.ethereum.createOnLogin = "users-without-wallets"`

## 5) Deploiement Netlify

### Option A - UI Netlify (recommande)

1. Pousser le dossier `privy-poc` sur GitHub.
2. Dans Netlify: **Add new project** -> **Import from Git**.
3. Selectionner le repo et configurer:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Ajouter les variables d'environnement Netlify:
   - `VITE_PRIVY_APP_ID`
   - `VITE_PRIVY_CLIENT_ID`
   - `VITE_POLYGONSCAN_BASE_URL` (optionnel, ex: `https://amoy.polygonscan.com`)
5. Deploy.

Le fichier `netlify.toml` est deja fourni avec la redirection SPA vers `index.html`.

### Option B - Netlify CLI

```bash
cd privy-poc
npm run build
npx netlify deploy --prod --dir=dist
```

