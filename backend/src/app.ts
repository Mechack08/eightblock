import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from '@/routes';
import { errorHandler } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import swaggerDoc from '@/utils/swagger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/healthz', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

app.use('/api', routes);

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use(errorHandler);

process.on('uncaughtException', (err) => logger.error(`uncaughtException ${err.message}`));
process.on('unhandledRejection', (err) =>
  logger.error(`unhandledRejection ${(err as Error).message}`)
);
