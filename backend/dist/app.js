"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const surveyorRoutes_1 = __importDefault(require("./routes/surveyorRoutes"));
const surveyRoutes_1 = __importDefault(require("./routes/surveyRoutes"));
const masterDataRoutes_1 = __importDefault(require("./routes/masterDataRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const wardRoutes_1 = __importDefault(require("./routes/wardRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // Web portal
        'http://127.0.0.1:3000', // Alternative localhost
        'http://localhost:3001', // Alternative port
        'http://127.0.0.1:3001', // Alternative port
        'http://localhost:8081', // Expo development server
        'http://127.0.0.1:8081', // Expo development server
    ],
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Add headers middleware for additional CORS support
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Routes
app.use('/api/auth', authRoutes_1.default);
// Master data routes (public for now, can be protected later if needed)
app.use('/api/master-data', masterDataRoutes_1.default);
// Protected routes - Web Portal Only (ADMIN/SUPERADMIN)
app.use('/api/ward', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, wardRoutes_1.default);
app.use('/api/user', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, userRoutes_1.default);
// Protected routes - All Authenticated Users
app.use('/api/surveyors', authMiddleware_1.authenticateJWT, surveyorRoutes_1.default);
app.use('/api/surveys', surveyRoutes_1.default);
app.use('/api/surveyor', surveyorRoutes_1.default);
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
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
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
});
