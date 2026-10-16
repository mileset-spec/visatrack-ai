# Deploying VisaTrack AI to Vercel

VisaTrack AI is fully configured for deployment on [Vercel](https://vercel.com) as a full-stack Progressive Web App with serverless API functions (`/api/gemini/chat`, `/api/gemini/ocr`, `/api/health`).

---

## Method 1: Git Integration (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Configure VisaTrack AI for Vercel deployment"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your Git repository.
   - Vercel automatically detects the **Vite** framework from `vercel.json`:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Configure Environment Variables**:
   Under **Environment Variables** in the Vercel project setup, add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.

4. **Click Deploy**:
   Vercel will compile the Vite frontend, bundle the serverless functions in `/api`, and deploy to a live URL (e.g., `https://visatrack-ai.vercel.app`).

---

## Method 2: Deploy via Vercel CLI

If you prefer terminal deployment:

1. **Deploy preview**:
   ```bash
   npx vercel
   ```
   Follow the prompts to link or create a new Vercel project.

2. **Add your Gemini API Key**:
   ```bash
   npx vercel env add GEMINI_API_KEY
   ```
   (Select `Production`, `Preview`, and `Development`).

3. **Deploy to production**:
   ```bash
   npx vercel --prod
   ```

---

## How It Works on Vercel

- **Frontend**: The React 19 + Tailwind CSS mobile UI is built to `dist/` and served over Vercel's global CDN edge network.
- **SPA Routing**: `vercel.json` rewrites all client routes (`/`, `/applications`, `/documents`, etc.) to `index.html` to prevent 404 errors on page reloads.
- **Serverless API Routes**:
  - `GET /api/health`: Health verification check.
  - `POST /api/gemini/chat`: Real-time conversational visa assistant powered by `gemini-3.8-flash`.
  - `POST /api/gemini/ocr`: Multimodal passport data page parsing.
