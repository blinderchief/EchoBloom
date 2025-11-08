# 🚀 EchoBloom Setup Guide

## Step-by-Step Instructions

### 1. Get Clerk Authentication Keys (REQUIRED)

Clerk provides the authentication system for EchoBloom.

1. **Sign up for Clerk**
   - Go to https://clerk.com
   - Click "Get Started for Free"
   - Create an account

2. **Create a New Application**
   - Click "Add Application"
   - Name it "EchoBloom"
   - Choose your preferred social login providers (Google, GitHub, etc.)

3. **Get Your API Keys**
   - Go to "API Keys" in the sidebar
   - Copy `Publishable key` (starts with `pk_test_`)
   - Copy `Secret key` (starts with `sk_test_`)

4. **Add Keys to Frontend**
   ```bash
   cd frontend
   ```
   
   Edit `.env.local` file and add:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### 2. (Optional) Get Gemini API Key for AI Responses

For real AI-powered empathy responses:

1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add to `backend/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   ```

**Note:** The app works without Gemini - it will use fallback responses.

### 3. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
uv sync
```

If you don't have `uv` installed:
```bash
pip install uv
```

### 4. Start the Application

#### Option A: Run Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
uv run uvicorn app.main:app --reload
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

#### Option B: Docker (Full Stack)

```bash
docker-compose up --build
```

### 5. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the beautiful EchoBloom landing page!

## 🎯 First Steps After Setup

1. **Click "Start Your Garden"**
2. **Sign up** with email or social login
3. **Plant your first echo** - share a thought or feeling
4. **Watch your garden grow** - see the 3D visualization
5. **Explore seeds** - browse community wisdom

## 🐛 Troubleshooting

### "Clerk is not configured" Error
- Make sure you added the Clerk keys to `.env.local`
- Restart the dev server: `npm run dev`

### Backend Won't Start
- Check Python version: `python --version` (need 3.12+)
- Install uv: `pip install uv`
- Try: `uv sync --reinstall`

### Frontend Build Errors
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

### CORS Errors
- Make sure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### 3D Garden Not Showing
- This is normal on first load
- Plant an echo to see plants appear
- Check browser console for errors

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  moss: '#YOUR_COLOR',
  sunset: '#YOUR_COLOR',
  // etc...
}
```

### Modify AI Prompts

Edit `backend/app/routers/echo.py`:
```python
prompt = f"Your custom prompt: {request.input}"
```

### Add More Sample Seeds

Edit `frontend/app/seeds/page.tsx` - add to `sampleSeeds` array.

## 📱 Mobile Testing

The app is fully responsive! Test on:
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Real mobile device on same network:
  ```
  http://YOUR_COMPUTER_IP:3000
  ```

## 🚀 Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `uv sync`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0`
5. Add environment variables

## ✅ Verification Checklist

- [ ] Clerk keys added to `.env.local`
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access landing page
- [ ] Can sign up/sign in
- [ ] Can plant an echo
- [ ] Can see garden visualization
- [ ] Can browse seeds

## 🎉 You're All Set!

Enjoy your journey to emotional wellness with EchoBloom! 🌸

For more help:
- Check the main README.md
- Open an issue on GitHub
- Review the code comments
