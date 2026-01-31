import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';
import mentorRoutes from './routes/mentor';
import postsRoutes from './routes/posts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'], // Add all your dev ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add OPTIONS handler for preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/mentor', mentorRoutes);
// Add posts routes with error handling
try {
  app.use('/api/posts', postsRoutes);
  console.log('Posts routes loaded successfully');
} catch (error) {
  console.error('Error loading posts routes:', error);
}



app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error middleware triggered:', err?.stack || err);
  res.status(err?.status || 500).json({
    error: err?.message || 'Internal Server Error'
  });
});

// Start server (database will initialize on first request)
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins: http://localhost:3000, http://localhost:5173, http://localhost:8080`);
  console.log('Posts API available at: http://localhost:3001/api/posts');
});

// Initialize database asynchronously
initializeDatabase().catch(console.error);

export default app;