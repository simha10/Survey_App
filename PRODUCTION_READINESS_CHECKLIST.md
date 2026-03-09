# Production Readiness Checklist

## ✅ CURRENT STATUS

### Backend Configuration (backend/.env)
```env
DATABASE_URL=postgresql://neondb_owner:npg_ZUI1nG7ELXiF@ep-shy-mode-a1sr7s7y-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=my-super-secret-jwt-token-with-at-least-32-characters-long
PORT=4000
FRONTEND_URL=http://localhost:8000
```

**Status:** ⚠️ **NEEDS UPDATES FOR PRODUCTION**

**Issues:**
1. ❌ `FRONTEND_URL` still pointing to localhost
2. ❌ Missing `CORS_ORIGINS` environment variable
3. ❌ Missing `NODE_ENV` variable

---

### Frontend Configuration (web-portal/.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

**Status:** ⚠️ **NEEDS UPDATES FOR PRODUCTION**

**Issues:**
1. ❌ `NEXT_PUBLIC_BACKEND_URL` pointing to localhost
2. ❌ No production backend URL configured

---

### Mobile App Configuration (my-app/.env)
```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

**Status:** ⚠️ **NEEDS UPDATES FOR PRODUCTION**

**Issues:**
1. ❌ `EXPO_PUBLIC_API_BASE_URL` pointing to localhost

---

## 🔧 HARDCODED URLs FOUND IN CODE

### 1. Backend - app.ts (Lines 33-36)
```typescript
'http://localhost:8000',
'http://127.0.0.1:8000',
'http://localhost:3000',
'http://127.0.0.1:3000',
```
**Status:** ⚠️ These are fallback defaults - acceptable for development but should be overridden by env vars in production

### 2. Frontend API Routes
- `web-portal/src/app/api/ulbs/route.ts` - Line 6
- `web-portal/src/app/api/zones/ulb/[ulbId]/route.ts` - Line 5
- `web-portal/src/app/login/page.tsx` - Line 22

**Status:** ✅ Using environment variables with localhost as fallback - acceptable

---

## 📋 PRODUCTION CONFIGURATION REQUIRED

### Backend .env (Production)
```env
# Database (Already configured with Neon)
DATABASE_URL=postgresql://neondb_owner:npg_ZUI1nG7ELXiF@ep-shy-mode-a1sr7s7y-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Security
JWT_SECRET=your-production-jwt-secret-min-32-chars
NODE_ENV=production

# Server
PORT=4000

# Frontend URLs (UPDATE THESE)
FRONTEND_URL=https://your-production-domain.com
CORS_ORIGINS=https://your-production-domain.com,https://admin.your-domain.com

# Optional: Additional security
# HTTPS_REDIRECT=true
# TRUST_PROXY=true
```

### Frontend .env.production (web-portal/)
```env
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Mobile App .env.production (my-app/)
```env
EXPO_PUBLIC_API_BASE_URL=https://api.your-domain.com/api
```

---

## 🚀 DEPLOYMENT STEPS

### 1. Backend Deployment
```bash
cd backend

# Install dependencies
npm install --production

# Build TypeScript
npm run build

# Set production environment variables
# (Use your hosting provider's env var management)

# Start server
npm start
```

### 2. Frontend Deployment
```bash
cd web-portal

# Install dependencies
npm install --production

# Create .env.production file
echo "NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com" > .env.production

# Build Next.js
npm run build

# Start production server
npm start
```

### 3. Mobile App Deployment
```bash
cd my-app

# Update .env
echo "EXPO_PUBLIC_API_BASE_URL=https://api.your-domain.com/api" > .env.production

# Build for production
eas build --platform android
# or
eas build --platform ios
```

---

## 🔒 SECURITY CHECKLIST

- [ ] Change JWT_SECRET to a strong random string (min 32 characters)
- [ ] Enable HTTPS for all production domains
- [ ] Configure CORS with specific production domains only
- [ ] Remove localhost from CORS_ORIGINS in production
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting on API endpoints
- [ ] Configure SSL/TLS for database connection ✅ (Already done with Neon)
- [ ] Review and secure all environment variables
- [ ] Enable logging and monitoring
- [ ] Set up backup strategy for database

---

## 🧪 TESTING CHECKLIST

- [ ] Test login/authentication with production credentials
- [ ] Verify CORS configuration allows production frontend
- [ ] Test all API endpoints from production frontend
- [ ] Verify database connections work from production environment
- [ ] Test mobile app connectivity to production API
- [ ] Load test the backend API
- [ ] Verify error handling and logging

---

## 📊 MONITORING SETUP RECOMMENDATIONS

1. **Application Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Configure performance monitoring
   - Set up uptime monitoring

2. **Database Monitoring**
   - Monitor connection pool usage
   - Track query performance
   - Set up alerts for failed queries

3. **Server Monitoring**
   - CPU and memory usage
   - Response times
   - Error rates

---

## ⚠️ CRITICAL ISSUES TO FIX BEFORE PRODUCTION

1. **FRONTEND_URL in backend/.env** 
   - Current: `http://localhost:8000`
   - Required: `https://your-production-domain.com`

2. **CORS_ORIGINS missing**
   - Add: `CORS_ORIGINS=https://your-production-domain.com`

3. **NEXT_PUBLIC_BACKEND_URL in frontend**
   - Current: `http://localhost:4000`
   - Required: `https://api.your-domain.com`

4. **JWT_SECRET**
   - Consider generating a new production-specific secret

---

## ✅ WHAT'S ALREADY GOOD FOR PRODUCTION

1. ✅ Database using Neon (cloud-hosted PostgreSQL)
2. ✅ Environment variables properly structured
3. ✅ Code uses environment variables (not hardcoded)
4. ✅ SSL mode enabled for database connection
5. ✅ Separate configurations for different environments possible

---

## 🎯 QUICK FIX COMMANDS

### Update Backend .env for Production:
```bash
cd backend
# Edit .env file and replace:
# FRONTEND_URL=http://localhost:8000
# WITH:
# FRONTEND_URL=https://your-production-domain.com
# CORS_ORIGINS=https://your-production-domain.com
```

### Update Frontend .env.production:
```bash
cd web-portal
cat > .env.production << EOF
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
EOF
```

### Update Mobile App .env.production:
```bash
cd my-app
cat > .env.production << EOF
EXPO_PUBLIC_API_BASE_URL=https://api.your-domain.com/api
EOF
```

---

## 📝 NOTES

- All localhost references in the code are fallback defaults and won't affect production if environment variables are set correctly
- The application structure is production-ready, just needs proper domain configuration
- Neon database is already cloud-hosted and production-ready
- Consider using a reverse proxy (nginx) or API gateway in production
