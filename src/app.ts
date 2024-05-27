import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import SutdentRouter from './modules/student/student.route';
const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// initial server start
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running' });
});

// api routes
app.use('/api/v1/students', SutdentRouter);

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
