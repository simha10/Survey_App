import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import surveyorRoutes from './routes/surveyorRoutes';
import surveyRoutes from './routes/surveyRoutes';
import masterDataRoutes from './routes/masterDataRoutes';
import { authenticateJWT, restrictToWebPortal } from './middleware/authMiddleware';
import wardRoutes from './routes/wardRoutes';
import userRoutes from './routes/userRoutes';
import ulbRoutes from './routes/ulbRoutes';
import zoneRoutes from './routes/zoneRoutes';
import mohallaRoutes from './routes/mohallaRoutes';
import qcRoutes from './routes/qcRoutes';
import reportsRoutes from './routes/reportsRoutes';
import assignmentRoutes from './routes/assignmentRoutes';

dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Web portal
    'http://127.0.0.1:3000', // Alternative localhost
    'http://localhost:8081', // Expo development server
    'http://127.0.0.1:8081', // Expo development server
  ],
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add headers middleware for additional CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);

// Master data routes (public for now, can be protected later if needed)
app.use('/api/master-data', masterDataRoutes);

// Protected routes - Web Portal Only (ADMIN/SUPERADMIN)
app.use('/api/ward', authenticateJWT, restrictToWebPortal, wardRoutes);
app.use('/api/user', authenticateJWT, restrictToWebPortal, userRoutes);

// Protected routes - All Authenticated Users
app.use('/api/surveyors', authenticateJWT, surveyorRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/surveyor', surveyorRoutes);

// Protected routes - ULBs
app.use('/api/ulbs', authenticateJWT, ulbRoutes);

// Protected routes - Zones
app.use('/api/zones', authenticateJWT, zoneRoutes);

// Protected routes - Wards (master data)
app.use('/api/wards', authenticateJWT, wardRoutes);

// Protected routes - Mohallas
app.use('/api/mohallas', authenticateJWT, mohallaRoutes);

// Protected routes - QC
app.use('/api/qc', authenticateJWT, qcRoutes);

// Protected routes - Reports
app.use('/api/reports', authenticateJWT, reportsRoutes);

// Protected routes - Assignments
app.use('/api/assignments', authenticateJWT, assignmentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route for unknown endpoints to return JSON error
app.use((req, res) => {
  console.log(`404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('DB URL:', process.env.DATABASE_URL);
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
});
