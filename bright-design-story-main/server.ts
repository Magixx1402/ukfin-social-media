import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';
import mentorRoutes from './routes/mentor';

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins: http://localhost:3000, http://localhost:5173, http://localhost:8080`);
});

export default app;