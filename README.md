
# FleetCommand - Enterprise Fleet Management System

A modern, scalable fleet management system built with React, TypeScript, and Convex for real-time operations.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd fleetcommand
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your Convex URL and other keys
   ```

3. **Database Setup**
   ```bash
   npx convex dev --configure=existing --team djoreally-gmail-com --project fleet-command
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Convex** for real-time database

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   └── analytics/      # Analytics tracking
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities (API, analytics, etc.)
├── pages/              # Page components
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── services/           # Business logic services
```

## 📊 Features

### Core Modules
- **Dashboard** - Real-time KPIs and metrics
- **Fleet Management** - Van tracking and maintenance
- **Job Scheduling** - Service appointment management
- **Technician Management** - Staff tracking and assignments
- **Client Management** - Customer relationship management
- **Inventory** - Equipment and parts tracking
- **Analytics** - Performance reporting
- **Dispatch Hub** - Real-time operations center

### Enterprise Features
- ✅ **Real-time updates** via Convex
- ✅ **Type-safe API** with TypeScript
- ✅ **Responsive design** for all devices
- ✅ **Error boundaries** and fallbacks
- ✅ **Analytics tracking** ready
- ✅ **Authentication** system ready
- ✅ **Performance optimized**

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Database Schema
The Convex schema includes:
- **Vans** - Fleet vehicle tracking
- **Jobs** - Service appointments
- **Technicians** - Staff management
- **Clients** - Customer data
- **Equipment** - Inventory tracking
- **Notifications** - System alerts

### API Integration
All backend integration points are prepared with:
- Typed Convex queries and mutations
- Error handling and loading states
- Real-time subscriptions
- Optimistic updates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🔐 Environment Variables

Required:
- `VITE_CONVEX_URL` - Your Convex deployment URL

Optional:
- `VITE_MAPBOX_TOKEN` - For map features
- `VITE_ANALYTICS_KEY` - For analytics tracking

## 👥 Team Handoff

### For Backend Developers
- **Database Schema**: See `convex/schema.ts`
- **API Endpoints**: See `convex/*.ts` files
- **Types**: See `src/types/index.ts`
- **Integration Points**: See `src/hooks/useConvex.ts`

### For Designers
- **Component Library**: Run `npm run storybook` (when added)
- **Design System**: See `src/components/ui/`
- **Color Tokens**: See `src/index.css`

### For QA/Testing
- **Test Routes**: All routes accessible from sidebar
- **Error States**: Toggle network to test error boundaries
- **Loading States**: Visible on slow connections
- **Responsive**: Test on mobile, tablet, desktop

## 📱 PWA Ready

The app is prepared for Progressive Web App features:
- Service worker ready
- Manifest.json configured
- Offline fallbacks prepared
- Install prompts ready

## 🔍 Monitoring

Analytics and error tracking hooks are ready for:
- **PostHog** / **Mixpanel** for user analytics
- **Sentry** / **LogRocket** for error monitoring
- **Web Vitals** tracking

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use provided ESLint configuration
3. Write self-documenting code
4. Test on multiple screen sizes
5. Ensure accessibility compliance

---

**Built for Scale** | **Enterprise Ready** | **Developer Friendly**
