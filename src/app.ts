import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './middleware/globalErrorHandler';
import httpStatus from 'http-status';
import router from './routes';
import { notFoundRoute } from './middleware/notFoundRoute';
import { error } from 'console';
const app: Application = express();

app.use(express.json());
app.use(cors());

// initial server start
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running' });
});

// api routes
app.use('/api/v1', router);

// not found route
app.all('*', notFoundRoute);

// handle error globally
app.use(globalErrorHandler);

export default app;
