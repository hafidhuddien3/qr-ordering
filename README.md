# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

Here’s a clean **README-ready architecture section** you can paste directly.

---

# 📁 Project Architecture

This project follows a **feature-friendly layered architecture** designed for scalability, offline support, and clean separation of concerns.

---

## 🧭 Root Structure

```
├── app/                # App Router (screen-level routing)
├── src/
│   ├── api/            # API layer (real, mock, middleware)
│   ├── components/     # Reusable UI components
│   ├── state/          # Global state management
│   ├── models/         # TypeScript types & data models
│   ├── utils/          # Helper functions & formatters
│   ├── hooks/          # Custom React hooks
│   └── constants/      # App constants (config, enums, config values)
```

---

# 📱 `app/` — Routing Layer

Contains screen-level components using file-based routing (e.g. Expo Router / Next-style routing).

* Each file = one screen
* Handles navigation structure
* Should contain minimal business logic

---

# 🌐 `src/api/` — Data Layer

Centralized API handling system.

### Includes:

* Real API client (production backend)
* Mock API (development/testing)
* Middleware layer (switch between mock/real)
* Request handlers (fetch wrappers, interceptors)

### Purpose:

* Abstract all network logic
* Keep UI independent from backend changes

---

# 🧩 `src/components/` — UI Layer

Reusable UI components:

* Buttons
* Cards
* Inputs
* Modals
* Layout components

### Rule:

> No API calls, no business logic — UI only

---

# 🧠 `src/state/` — Global State

State management layer (e.g. Zustand, Redux).

### Used for:

* Cart / orders queue
* User session
* Offline sync state
* UI global states

### Example responsibilities:

* Offline order queue
* Cached shared data between screens

---

# 📦 `src/models/` — Data Models

Central TypeScript definitions:

* API response types
* Domain models (Order, Menu, User)
* Shared interfaces

### Purpose:

> Single source of truth for data structure

---

# 🛠️ `src/utils/` — Helpers

Pure utility functions:

* format currency
* date formatting
* validation
* transformations

---

# 🪝 `src/hooks/` — Custom Hooks

Reusable logic built on top of React:

* `useOrders()`
* `useMenu()`
* `useOfflineQueue()`

### Purpose:

> Extract reusable logic from components

---

# ⚡ Data Flow Architecture

```
API → api/ layer → state/cache → UI screens (app/)
```

---

# 💾 Caching Strategy (Important)

The app uses a **multi-layer caching system**:

## 1. In-memory cache

* React Query cache (fast access)
* Used for screen transitions

## 2. Persistent cache

* AsyncStorage / local storage
* Used for offline support

## 3. Offline queue

* Stored in state + AsyncStorage
* Syncs when internet returns

---

# 🔄 Offline Flow (Orders)

```
User places order
        ↓
Check internet
        ↓
Online → send API immediately
Offline → store in queue (state + AsyncStorage)
        ↓
When online returns → auto-sync queue
```

---

# 🧠 Design Principles

* Separation of concerns (UI / Logic / Data)
* Offline-first capability
* Scalable API abstraction
* Reusable state + hooks
* Minimal coupling between layers

---

# 🚀 Summary

This architecture is designed for:

* Menu-based ordering systems
* Offline-first applications
* Scalable React Native apps
* Clean separation of API, UI, and state

"# qr-ordering" 
