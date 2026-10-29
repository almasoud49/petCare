import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error';
import { env } from './config/env';

const app: Application = express();

// ─── Security ─────────────────────────────────────────
app.use(helmet());

// ─── CORS (single configuration) ──────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://petcare-frontend-one.vercel.app', 
  env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body parsing ─────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Cookies, compression, sanitization ───────────────
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());

// ─── Logging ──────────────────────────────────────────
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Health check ─────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    success: true,
    service: 'PetCare API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'petcare-api' })
);

// ─── API routes ───────────────────────────────────────
app.use('/api/v1', routes);

// ─── 404 + error handlers (must be last) ──────────────
app.use(notFound);
app.use(errorHandler);

export default app;