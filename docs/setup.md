# Setup Guide

Complete installation and configuration guide for the Smart Operations Dashboard.

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | ≥18.0.0 | LTS recommended |
| **npm** | ≥9.0.0 | Comes with Node.js |
| **Git** | Latest | For cloning the repository |

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-operations-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React 19 with TypeScript
- Vite build tool
- Firebase SDK
- UI libraries (Shadcn, Radix, Recharts)
- State management (Zustand)

---

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure API Keys

Edit `.env` with your credentials:

```env
# OpenWeatherMap API (Required for real weather data)
# Get free key: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Firebase Configuration (Optional - for real-time collaboration)
# Create project: https://console.firebase.google.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# WebSocket URL (Uses echo server by default)
VITE_WEBSOCKET_URL=wss://echo.websocket.events
```

### API Key Sources

| Service | Get Key From | Required |
|---------|--------------|----------|
| OpenWeatherMap | [openweathermap.org/api](https://openweathermap.org/api) | Optional* |
| Firebase | [console.firebase.google.com](https://console.firebase.google.com) | Optional* |

> *The app includes mock data fallbacks when API keys are missing.

---

## Running the Application

### Development Mode

```bash
npm run dev
```

- **URL**: http://localhost:5173
- **Hot Reload**: Enabled
- **Source Maps**: Enabled

### Production Build

```bash
npm run build
```

Build output goes to `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Login Credentials

Use test credentials from [DummyJSON](https://dummyjson.com/users):

| Username | Password |
|----------|----------|
| `emilys` | `emilyspass` |
| `michaelw` | `michaelwpass` |
| `sophiab` | `sophiabpass` |

---

## Firebase Setup (Optional)

For real-time collaboration features:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Follow the setup wizard

### 2. Enable Realtime Database

1. Navigate to **Build → Realtime Database**
2. Click "Create Database"
3. Select your region
4. Start in **test mode** for development

### 3. Set Security Rules

```json
{
  "rules": {
    "operational_notes": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "presence": {
      ".read": "auth != null",
      "$userId": {
        ".write": "auth != null && auth.uid === $userId"
      }
    },
    "activity_feed": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 4. Get Configuration

1. Go to **Project Settings → General**
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Copy the config values to your `.env` file

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `npm install` fails | Delete `node_modules` and `package-lock.json`, then retry |
| Port 5173 in use | Kill the process or use `npm run dev -- --port 3000` |
| Weather API 401 error | Verify your OpenWeatherMap API key is correct |
| Firebase connection fails | Check Firebase Database URL and rules |
| Build errors | Run `npm run lint` to identify issues |

### Debug Mode

Enable verbose logging:

```bash
# Windows
set DEBUG=vite:* && npm run dev

# Mac/Linux
DEBUG=vite:* npm run dev
```

---

## IDE Setup

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- Error Lens

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Next Steps

- 📖 Read [Architecture Guide](./architecture.md) for code structure
- 🎨 Read [System Design](./system-design.md) for technical decisions
- 🧪 Test authentication with the provided credentials
