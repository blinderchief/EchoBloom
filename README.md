# 🌸 EchoBloom - AI-Powered Empathy Garden for Mental Wellness

![EchoBloom](https://img.shields.io/badge/Mental%20Wellness-AI%20Garden-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-blue)
![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-purple)

**Tagline:** *"Plant your echoes, watch your wellness bloom—safely, privately, profoundly."*

Transform your mental wellness journey into a living, breathing garden. Plant your emotions, nurture them with AI, and watch your resilience bloom.

## ✨ Features

### 🎨 Beautiful UI/UX
- **Liquid Sanctuary Design**: Glass morphism with fluid animations
- **Earthy Color Palette**: Moss greens, sunset oranges, and petal pinks
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Framer Motion powered smooth transitions

### 🌱 Core Features
- **Echo Planting**: Multimodal input (text/voice) for emotional journaling
- **3D Garden Visualization**: Watch your wellness grow with Three.js powered garden
- **AI Empathy**: Gemini-powered compassionate responses
- **Passive Mood Sensing**: Gentle alerts based on usage patterns
- **Seed Marketplace**: Anonymous community wisdom sharing
- **Progress Tracking**: Visual stats and mood improvement metrics

### 🔒 Privacy & Security
- **Clerk Authentication**: Secure, enterprise-grade auth
- **GDPR Compliant**: Privacy-by-design architecture
- **End-to-End Encryption**: Your data stays safe
- **Anonymous Sharing**: Community support without identity exposure

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.12+
- **uv** (Python package manager)
- **PostgreSQL** (or use SQLite for development)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd echobloom
```

### 2. Setup Clerk Authentication

1. Go to [Clerk.dev](https://clerk.dev) and create an account
2. Create a new application
3. Get your API keys from the dashboard
4. Copy `.env.local.example` to `.env.local` in the frontend folder:

```bash
cd frontend
copy .env.local.example .env.local
```

5. Add your Clerk keys to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies with uv
uv sync

# Create .env file
echo GEMINI_API_KEY=your_gemini_key_here > .env
echo DATABASE_URL=sqlite+aiosqlite:///echobloom.db >> .env

# Run migrations (if needed)
uv run alembic upgrade head

# Start the backend server
uv run uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 5. (Optional) Run with Docker

```bash
# From the root directory
docker-compose up --build
```

This will start:
- Frontend on `localhost:3000`
- Backend on `localhost:8000`
- PostgreSQL on `localhost:5432`
- Qdrant on `localhost:6333`

## 📦 Project Structure

```
echobloom/
├── frontend/                 # Next.js 15 App
│   ├── app/                 # App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── onboard/         # Authentication
│   │   ├── garden/          # Main dashboard
│   │   ├── seeds/           # Community marketplace
│   │   └── profile/         # User profile
│   ├── components/
│   │   └── ui/
│   │       ├── atoms/       # Basic components
│   │       ├── molecules/   # Composite components
│   │       └── organisms/   # Complex components
│   ├── middleware.ts        # Clerk auth middleware
│   └── tailwind.config.js   # Custom theme
│
├── backend/                 # FastAPI App
│   ├── app/
│   │   ├── core/           # Config & database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   └── main.py         # FastAPI entry
│   └── pyproject.toml      # Python dependencies
│
└── docker-compose.yml       # Container orchestration
```

## 🎯 Key Technologies

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Three.js**: 3D garden visualization
- **Clerk**: Authentication & user management
- **Lucide React**: Beautiful icons

### Backend
- **FastAPI**: High-performance Python API
- **SQLAlchemy**: ORM for database
- **Gemini AI**: Google's LLM for empathy
- **Qdrant**: Vector database for semantic search
- **PostgreSQL**: Production database
- **uv**: Fast Python package manager

## 🌈 Usage Guide

### 1. **Sign Up / Sign In**
- Visit the landing page
- Click "Start Your Garden"
- Sign up with email or OAuth (Google/GitHub)

### 2. **Plant Your First Echo**
- Click "🌱 Plant New Echo" button
- Type or speak your thoughts
- Receive AI-generated empathetic response
- Watch a new plant grow in your garden!

### 3. **Explore Seeds**
- Visit the Seed Marketplace
- Browse community wisdom
- Filter by tags (anxiety, burnout, mindfulness, etc.)
- Plant seeds that resonate with you

### 4. **Track Progress**
- View your growth stats
- See mood improvement metrics
- Celebrate achievements
- Export your data anytime

## 🔧 Configuration

### Environment Variables

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/echobloom
QDRANT_URL=http://localhost:6333
GEMINI_API_KEY=your_gemini_api_key
ENCRYPTION_KEY=your_32_char_encryption_key
SECRET_KEY=your_jwt_secret_key
```

## 🎨 Customization

### Changing Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  moss: '#A8D5BA',      // Primary green
  sunset: '#F4A261',    // Accent orange
  navy: '#2A3D45',      // Dark background
  petal: '#FFB6D9',     // Highlight pink
}
```

### Adding New Seed Categories
Edit `frontend/app/seeds/page.tsx` and add tags to sample seeds.

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Echoes
- `POST /api/echo` - Generate AI empathy response
- `POST /api/sessions` - Save echo session
- `GET /api/sessions/{user_id}` - Get user sessions

### Seeds
- `GET /api/search-seeds` - Vector search for seeds
- `POST /api/seeds` - Share new seed

### Sensors
- `POST /api/sensors` - Receive passive mood data

## 🧪 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh
- Backend: `--reload` flag restarts on code changes

### Testing Gemini Responses
If you don't have a Gemini API key, the app will still work with fallback responses.

### Adding More Plants
Edit `frontend/components/ui/organisms/GardenCanvas.tsx` to customize 3D plant generation.

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub, then connect to Vercel
vercel --prod
```

### Backend (Render/Railway)
```bash
# Use the Dockerfile in the backend folder
# Set environment variables in the dashboard
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use for your own projects!

## 🙏 Acknowledgments

- **Design Inspiration**: Deepen, Soula Care, Ash
- **AI**: Google Gemini
- **Auth**: Clerk
- **3D**: Three.js
- **Animations**: Framer Motion

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Email: support@echobloom.app (coming soon)
- Discord: Join our Bloom Grove community (coming soon)

---

**Made with 💚 for mental wellness**

*EchoBloom isn't just an app; it's a movement toward empathetic tech.*
