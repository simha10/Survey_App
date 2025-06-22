import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import surveyorRoutes from './routes/surveyorRoutes';
import surveyRoutes from './routes/surveyRoutes';
import { authenticateJWT } from './middleware/authMiddleware';

dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/surveyors', authenticateJWT, surveyorRoutes);
app.use('/surveys', surveyRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  //console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route for unknown endpoints to return JSON error
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
