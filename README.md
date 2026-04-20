# 🌸 MindBloom — Mental Health & Mood Tracker



![MindBloom](https://img.shields.io/badge/MindBloom-v1.0.0-d946ef?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Motor-47a248?style=flat-square&logo=mongodb)

---

## Features

| Feature | Description |
|---|---|
| **JWT Auth** | Secure signup/login with bcrypt hashing |
| **Mood Logging** | 8 moods with emoji UI, intensity slider, notes |
| **Analytics** | Weekly area chart + emotion pie chart |
| **Journal** | Full CRUD with tags, mood linking, search |
| **Breathing** | Animated 4-phase box breathing exercise |
| **Meditation** | SVG ring timer with preset durations |
| **Quotes** | Rotating motivational wellness quotes |
| **Dark Mode** | System-aware with persistent preference |
| **Responsive** | Mobile-first, works on all screen sizes |

---

## Project Structure

```
mindbloom/
│
├── backend/                        # FastAPI Python backend
│   ├── main.py                     # App entry point, CORS, routers
│   ├── database.py                 # MongoDB Motor async connection
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment variable template
│   │
│   ├── middleware/
│   │   └── auth.py                 # JWT encode/decode, bcrypt, get_current_user
│   │
│   ├── models/
│   │   └── schemas.py              # Pydantic models: User, Mood, Journal
│   │
│   └── routers/
│       ├── auth.py                 # POST /signup, POST /login, GET /me
│       ├── moods.py                # CRUD + /today + /analytics
│       └── journal.py              # CRUD journal entries
│
└── frontend/                       # React + Vite + Tailwind
    ├── index.html
    ├── vite.config.js              # Dev server proxy to FastAPI
    ├── tailwind.config.js          # Custom fonts, colors, animations
    ├── postcss.config.js
    ├── package.json
    │
    └── src/
        ├── main.jsx                # ReactDOM render
        ├── App.jsx                 # Router + providers
        ├── index.css               # Global CSS, CSS vars, dark mode
        │
        ├── contexts/
        │   ├── AuthContext.jsx     # Login/signup/logout state + localStorage
        │   └── ThemeContext.jsx    # Dark mode toggle + persistence
        │
        ├── utils/
        │   ├── api.js              # Axios instance + 401 interceptor
        │   └── moodConfig.js       # Mood emojis, colors, suggestions, quotes
        │
        ├── components/
        │   └── common/
        │       └── Layout.jsx      # Sidebar + mobile nav shell
        │
        └── pages/
            ├── LandingPage.jsx     # Public marketing page
            ├── LoginPage.jsx       # Auth form
            ├── SignupPage.jsx      # Registration form
            ├── DashboardPage.jsx   # Today's mood, streak, quick actions
            ├── MoodLogPage.jsx     # Emoji grid + intensity + note
            ├── AnalyticsPage.jsx   # Recharts area + pie charts
            ├── JournalPage.jsx     # CRUD entries with modal
            └── RelaxPage.jsx       # Breathing + timer + quotes
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running locally or MongoDB Atlas

### 1. Clone & navigate
```bash
git clone https://github.com/anshikalohan/mindbloom.git
cd mindbloom
```

### 2. Backend setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set MONGO_URL and SECRET_KEY

# Run dev server
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api → localhost:8000)
npm run dev
```

App: http://localhost:3000

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |

### Moods
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/moods/` | Log a mood entry |
| GET | `/api/moods/` | Get mood history |
| GET | `/api/moods/today` | Get today's mood |
| GET | `/api/moods/analytics` | Streak, distribution, weekly data |
| PUT | `/api/moods/{id}` | Update mood entry |
| DELETE | `/api/moods/{id}` | Delete mood entry |

### Journal
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/journal/` | Create journal entry |
| GET | `/api/journal/` | List all entries (filter by tag) |
| GET | `/api/journal/{id}` | Get single entry |
| PUT | `/api/journal/{id}` | Update entry |
| DELETE | `/api/journal/{id}` | Delete entry |

---

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWTs signed with **HS256**, expire in 7 days
- All mood/journal endpoints require valid JWT
- Input validated at API layer with **Pydantic**
- Secrets stored in `.env` (never committed)
- CORS restricted to frontend origin

---

## Design System

| Token | Value |
|---|---|
| Primary gradient | `#d946ef → #9333ea` |
| Font Display | Fraunces (serif) |
| Font Body | DM Sans |
| Font Mono | DM Mono |
| Border radius | 20px (cards), 12px (inputs) |
| Dark bg | `#0d0a14` |
| Light bg | `#faf8ff` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Charts | Recharts |
| HTTP Client | Axios |
| Routing | React Router v6 |
| State | Context API |
| Backend | FastAPI (Python) |
| Database | MongoDB (Motor async) |
| Auth | JWT (python-jose) |
| Password | bcrypt (passlib) |
| Validation | Pydantic v2 |

---

## License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  Made with 🌸 for mental wellness
</div>
