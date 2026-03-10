import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import routes from './routes/routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res
  .status(200)
  .json({ status: "OK", uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

export default app;