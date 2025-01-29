import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'cookie-session';
import { config } from './config/appConfig.js';
import { connectDatabase } from './config/database.config.js';

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(
  session({
    name: 'session',
    secret: config.SESSION_SECRET,
    maxAge: 600000,
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  }),
);

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.status(403).json({ message: 'This is the home page' });
});

// Listening on the configured port, with correct string interpolation for NODE_ENV
app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
