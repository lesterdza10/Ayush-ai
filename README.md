## AYUSH AI Platform

Next.js 16 app delivering Ayurvedic health insights backed by AI, MongoDB, and Google OAuth login.

## Prerequisites

- Node.js 20+
- MongoDB cluster or Atlas connection string
- Google Cloud OAuth client (Web application)

## Environment Variables

Create a `.env.local` file at the project root with the following keys:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/"
MONGODB_DB="ayush-ai"
NEXTAUTH_SECRET="<random-32-char-string>"
GOOGLE_CLIENT_ID="<google-oauth-client-id>"
GOOGLE_CLIENT_SECRET="<google-oauth-client-secret>"
GEMINI_API_KEY="<optional-gemini-key>"
```

- `MONGODB_URI` / `MONGODB_DB`: MongoDB connection target used by the API routes.
- `NEXTAUTH_SECRET`: secret used by NextAuth for JWT signing.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: issued from Google Cloud Console (OAuth consent screen + credentials).
- `GEMINI_API_KEY`: optional; enables Gemini-powered streaming recommendations. Without it the app falls back to the local rules engine.

## Install & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with Google. Authenticated users land on the personalized dashboard; first-time users are guided through the multi-step profile creation flow.

## Key Features

- Google OAuth login with session persistence via NextAuth.
- MongoDB-backed collections for users, profiles, health metrics, chat transcripts, and recommendations.
- Multi-step Ayurvedic profile wizard with AI chat preview.
- Dashboard that reads live data from the API and displays dosha breakdowns, health scores, risk indicators, and stored recommendations.
