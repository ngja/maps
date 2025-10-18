# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a map comparison application built with React, TanStack Router, and Vite. It allows users to view and compare Google Maps, Naver Maps, and Kakao Maps side-by-side in real-time with synchronized controls.

## Commands

### Development
- `npm run dev` - Start development server on port 3002
- `npm run build` - Build for production (runs Vite build and TypeScript compilation)
- `npm run serve` - Preview production build
- `npm run test` - Run tests with Vitest

### Testing
- `npm run test` - Run all tests in run mode (not watch)

## Architecture

### Routing Structure
Uses TanStack Router with file-based routing. Routes are defined in `src/routes/` and auto-generated route tree is in `src/routeTree.gen.ts`.

- `__root.tsx` - Root layout with APIProvider for Google Maps, Header component, and dev tools
- `index.tsx` - Home/landing page
- `compare.tsx` - Main map comparison page with 3-column layout

### Map Integration Pattern
Each map provider (Google, Naver, Kakao) is integrated using a different approach:

**Google Maps** (`src/components/map/GoogleMap.tsx`)
- Uses `@vis.gl/react-google-maps` React wrapper
- API key configured via `VITE_GOOGLE_MAPS_API_KEY` environment variable
- APIProvider wraps entire app in `__root.tsx`

**Naver Maps** (`src/components/map/NaverMap.tsx`)
- Uses vanilla JavaScript SDK with React hooks
- Dynamically loads SDK via `public/naver-maps-loader.js` helper
- Window-level `initNaverMaps()` function loads SDK on-demand
- Requires `VITE_NAVER_MAPS_CLIENT_ID` environment variable
- Map instance managed with `useRef` and updated via `useEffect`

**Kakao Maps** (`src/components/map/KakaoMap.tsx`)
- Uses vanilla JavaScript SDK with React hooks
- Dynamically loads SDK via `public/kakao-map-loader.js` helper
- Window-level `initKakaoMap()` function loads SDK on-demand
- Requires `VITE_KAKAO_MAP_APP_KEY` environment variable
- Zoom level conversion: Kakao uses inverted "level" (lower = zoomed in), converted from standard zoom (1-20) via `20 - zoom`

### Environment Configuration
Copy `.env.example` to `.env` and populate with API keys:
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps Platform API key
- `VITE_NAVER_MAPS_CLIENT_ID` - Naver Cloud Platform client ID
- `VITE_NAVER_MAPS_CLIENT_SECRET` - Naver Cloud Platform client secret (for backend/serverless functions)
- `VITE_KAKAO_MAP_APP_KEY` - Kakao Developers app key
- `VITE_API_BASE_URL` - API proxy base URL (optional, defaults to localhost:3003 in dev)

### Synchronized Map Controls
The `/compare` route implements synchronized controls for all three maps:
- **Center coordinates** - Shared `center` state updates all maps simultaneously
- **Zoom level** - Shared `zoom` state (with Kakao conversion)
- **Joystick control** - Custom joystick component (`src/components/map/Joystick.tsx`) with adjustable sensitivity for precise map movement
- **Manual coordinate input** - Direct lat/lng input fields

### Key Technical Details
- **Path alias**: `@/` maps to `./src/` (configured in vite.config.ts and tsconfig.json)
- **Styling**: Tailwind CSS v4 with Vite plugin
- **TypeScript**: Strict mode enabled with bundler module resolution
- **Dev tools**: TanStack Router Devtools and React Devtools available in development

### Map Component Lifecycle
All map components using vanilla SDKs follow this pattern:
1. Component mounts, check if `mapRef` exists
2. Call async `initMap()` to load SDK via window helpers
3. Create map instance and store in `mapInstanceRef`
4. Separate `useEffect` hooks update center/zoom when props change
5. Updates directly call map instance methods (e.g., `setCenter()`, `setZoom()`)

## Common Patterns

### Adding a New Map Provider
1. Create loader script in `public/{provider}-loader.js` with window-level init function
2. Add script tag to `index.html`
3. Create component in `src/components/map/{Provider}Map.tsx` following Naver/Kakao pattern
4. Add environment variable for API key to `.env.example`
5. Update compare page grid to include new map

### Adding a New Route
Add a file to `src/routes/` - TanStack Router will auto-generate the route tree. Use `createFileRoute()` pattern for type safety.

## Deployment

This application uses serverless functions to proxy the Naver Directions API and avoid CORS issues.

### Proxy Server Architecture
- **Development**: Express server (`server.js`) runs on localhost:3003
- **Production**: Serverless functions handle API proxying
  - Vercel: `/api/directions.js` (recommended)
  - Netlify: `/netlify/functions/directions.js`

### Deployment Options
1. **Vercel** (recommended) - Zero config, automatic serverless function detection
2. **Netlify** - Uses Netlify Functions with `netlify.toml` configuration
3. **Separate Backend** - Deploy `server.js` to Railway/Render/AWS and set `VITE_API_BASE_URL`

See `DEPLOYMENT.md` for detailed deployment instructions and environment variable configuration.
