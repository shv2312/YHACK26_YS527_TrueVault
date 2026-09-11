import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow local dev origins (localhost and LAN)
const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log error stack internally
  console.error('[Internal Error]:', err.message);
  // Return consistent structured generic error, never leaking stack trace or secrets
  res.status(500).json({ error: 'Internal server error' });
});

const HOST = '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
  console.log(`TrueVault Backend running on http://${HOST}:${PORT}`);
});

