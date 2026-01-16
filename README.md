# Smart Operations Dashboard

<div align="center">

![Dashboard](https://img.shields.io/badge/Dashboard-Smart%20Operations-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?style=flat-square&logo=firebase)

**A production-grade React.js application for real-time monitoring, collaboration, and system alerts.**

[Setup Guide](./docs/setup.md) • [Architecture](./docs/architecture.md) • [System Design](./docs/system-design.md)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | JWT-based login with auto-refresh, 15-min session timeout, role-based access |
| 📊 **Real-Time Monitoring** | Live weather data, global statistics, and aggregated analytics |
| 🤝 **Collaboration** | Real-time notes and user presence via Firebase RTDB |
| ⚡ **Live Events** | WebSocket-based alerts with auto-reconnection & event buffering |
| 📈 **Analytics Dashboard** | Multi-API aggregation with Recharts visualizations |
| 🔄 **Offline Support** | Firebase persistence + background sync |

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19, TypeScript, Vite 7 |
| **State** | Zustand |
| **Styling** | TailwindCSS 4, Shadcn/UI, Radix UI |
| **Real-Time** | Firebase RTDB, Native WebSockets |
| **Charts** | Recharts |
| **Forms** | React Hook Form, Zod validation |

---

## 🚀 Quick Start

```bash
# Clone & Install
git clone <repository-url>
cd smart-operations-dashboard
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

**Access**: http://localhost:5173

> **Note**: The app includes mock data fallbacks if API keys are missing.

---

## 📁 Project Structure

```
src/
├── app/           # App config, routing, providers
├── components/ui/ # Shadcn/UI components
├── features/      # Feature modules
│   ├── auth/      # Authentication & session
│   ├── dashboard/ # Dashboard widgets
│   ├── collaboration/ # Firebase real-time
│   └── alerts/    # WebSocket events
├── services/      # API, Firebase, WebSocket
├── shared/        # Utilities, hooks, components
└── hooks/         # Global hooks
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Setup Guide](./docs/setup.md) | Detailed installation and configuration |
| [Architecture](./docs/architecture.md) | Code structure and patterns |
| [System Design](./docs/system-design.md) | Technical design and decisions |

---

## 🧪 Testing

| Test Scenario | How to Test |
|---------------|-------------|
| **Session Timeout** | Wait 15 min idle or modify `IDLE_TIMEOUT` |
| **Offline Mode** | Disconnect network, observe buffering & re-sync |
| **Collaboration** | Open multiple tabs to see live presence |
| **WebSocket** | Disconnect/reconnect to test auto-recovery |

---

## 📜 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

---

## 🔑 Test Credentials

Use any credentials from [DummyJSON Auth](https://dummyjson.com/users):

```
Username: emilys
Password: emilyspass
```

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.
