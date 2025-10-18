# Deployment Guide

This guide explains how to deploy the map comparison application with the Naver Directions API proxy.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides serverless functions that work seamlessly with this application.

#### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add the following environment variables:
     - `VITE_GOOGLE_MAPS_API_KEY`
     - `VITE_NAVER_MAPS_CLIENT_ID`
     - `VITE_NAVER_MAPS_CLIENT_SECRET`
     - `VITE_KAKAO_MAP_APP_KEY`
     - `VITE_API_BASE_URL` (leave empty or set to your deployment URL)

3. **Deploy**
   ```bash
   vercel
   ```

4. **How it works**
   - The serverless function in `/api/directions.js` handles the proxy
   - Vercel automatically routes `/api/directions` to the serverless function
   - No separate backend server needed!

---

### Option 2: Netlify

Netlify also supports serverless functions (called Netlify Functions).

#### Method A: GitHub Integration (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository
   - Build settings (auto-detected):
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Functions directory**: `netlify/functions` (auto-detected)

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following variables:
     - `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps API key
     - `VITE_NAVER_MAPS_CLIENT_ID` = your Naver client ID
     - `VITE_NAVER_MAPS_CLIENT_SECRET` = your Naver client secret
     - `VITE_KAKAO_MAP_APP_KEY` = your Kakao app key
     - **Note**: `VITE_API_BASE_URL` is NOT needed (auto-detected)

4. **Deploy**
   - Click "Deploy site"
   - Netlify automatically builds and deploys your site
   - Every push to `main` branch triggers automatic redeployment

#### Method B: Netlify CLI (Quick Test)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   # Build the project
   npm run build

   # Deploy to production
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - Go to Netlify Dashboard → Site settings → Environment variables
   - Add the same variables as Method A

#### How it works
- The function in `/netlify/functions/directions.js` handles the proxy
- `netlify.toml` redirects `/api/*` to `/.netlify/functions/*`
- Code automatically detects production environment and uses relative path `/api/directions`

---

### Option 3: Separate Backend Server

If you prefer to run a separate backend server (e.g., on Railway, Render, or AWS):

#### Steps:

1. **Deploy the backend server (`server.js`)**
   - Use a platform like Railway, Render, Heroku, or AWS EC2
   - Set environment variables on the platform
   - Note the deployed URL (e.g., `https://your-backend.railway.app`)

2. **Update frontend environment variable**
   - Set `VITE_API_BASE_URL=https://your-backend.railway.app`

3. **Deploy the frontend**
   - Deploy to Vercel, Netlify, or any static hosting
   - Set all environment variables

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GOOGLE_MAPS_API_KEY` | Yes | Google Maps Platform API key |
| `VITE_NAVER_MAPS_CLIENT_ID` | Yes | Naver Maps Client ID |
| `VITE_NAVER_MAPS_CLIENT_SECRET` | Yes | Naver Maps Client Secret (backend/serverless only) |
| `VITE_KAKAO_MAP_APP_KEY` | Yes | Kakao Map App Key |
| `VITE_API_BASE_URL` | No | **Leave empty for Netlify/Vercel** (auto-detected). Only needed for separate backend server. |

---

## Development vs Production

### Development
```bash
# Terminal 1: Run the proxy server
npm run dev:server

# Terminal 2: Run the frontend
npm run dev
```

Environment: `.env` with `VITE_API_BASE_URL=http://localhost:3003`

### Production (Serverless - Netlify/Vercel)

No need to run a separate server! The serverless function handles it.

**Environment variables to set:**
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_NAVER_MAPS_CLIENT_ID`
- `VITE_NAVER_MAPS_CLIENT_SECRET`
- `VITE_KAKAO_MAP_APP_KEY`

**Do NOT set `VITE_API_BASE_URL`** - the code automatically uses `/api` in production, which routes to the serverless function.

---

## Testing the Deployment

After deployment, test the Naver Directions API by:

1. Go to the `/simulation` page
2. Set a start point and end point
3. Check if the route is fetched successfully
4. Look for any CORS errors in the browser console

---

## Troubleshooting

### CORS Errors
- Make sure the serverless function includes CORS headers
- Check that environment variables are set correctly

### 404 on API endpoint
- **Vercel**: Check that `vercel.json` is in the root directory
- **Netlify**: Check that `netlify.toml` is in the root directory
- Verify the function files are in the correct directories

### Missing API credentials
- Double-check environment variables in the deployment dashboard
- Make sure `VITE_NAVER_MAPS_CLIENT_SECRET` is set (it's used by the backend)

---

## Recommended: Vercel

For the easiest deployment experience, we recommend Vercel because:
- ✅ Zero configuration needed
- ✅ Automatic serverless function detection
- ✅ Free tier is generous
- ✅ Excellent performance
- ✅ Built-in environment variable management
