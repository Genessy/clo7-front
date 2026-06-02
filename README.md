# CLO7 — Frontend

Application mobile qui génère des tenues vestimentaires adaptées à la météo locale.  
Développée avec **Expo + React Native + TypeScript**.

> POC — certaines fonctionnalités sont mockées en attendant le backend.

---

## Stack

| Couche | Technologie |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81 |
| Navigation | Expo Router (file-based) |
| Langage | TypeScript 5.9 |
| Géolocalisation | expo-location |
| Météo | Open-Meteo (gratuit, sans clé API) |
| Géocodage inverse | Nominatim (OpenStreetMap) |
| Caméra / Galerie | expo-image-picker |
| Stockage local | AsyncStorage |
| Typographie | Manrope (titres) · Inter (corps) |

---

## Fonctionnalités

- **Météo en temps réel** — température, condition et conseil vestimentaire selon la localisation device
- **Génération de tenue** — sélection intelligente par catégorie (haut, vêtement d'extérieur, bas, chaussures) adaptée à la saison et aux conditions météo
- **Garde-robe** — ajout de vêtements via photo ou galerie, avec étiquette et métadonnées
- **Auth locale** — inscription / connexion persistée via AsyncStorage

---

## Architecture

```
app/
├── _layout.tsx          # Root stack + chargement fonts
├── index.tsx            # Garde auth → redirect
├── splash.tsx           # Onboarding
├── login.tsx
├── signup.tsx
├── add-photo.tsx        # Ajout vêtement — étape 1 (photo)
├── add-details.tsx      # Ajout vêtement — étape 2 (métadonnées)
└── (tabs)/
    ├── home.tsx         # Météo + génération outfit
    ├── wardrobe.tsx     # Liste garde-robe
    └── profile.tsx

services/
├── weather.ts           # Open-Meteo + Nominatim
└── outfit.ts            # Appel backend (USE_MOCK = true pour le POC)

constants/
├── colors.ts            # Design tokens
└── mock-data.ts         # Garde-robe de démo
```

---

## Design system

| Token | Valeur |
|---|---|
| Primary | `#8D9B84` |
| Primary hover | `#77856F` |
| Background | `#FAF8F5` |
| Surface | `#FFFFFF` |
| Text | `#111111` |
| Border | `#D8D4CF` |
| Border radius cartes | `16px` |
| Border radius boutons | `999px` |

---

## Installation

```bash
npm install
npx expo start
```

Scanner le QR code avec **Expo Go** (iOS / Android) ou lancer sur simulateur :

```bash
npm run ios      # Simulateur iOS
npm run android  # Émulateur Android
```