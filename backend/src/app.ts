import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { authenticateToken } from './middleware/authMiddleware';
import { notFoundHandler } from './middleware/notFoundHandler';


import usersRoutes from './routes/user';
import hoursRoutes from './routes/hours';
import appointmentRoutes from './routes/appointments';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando!');
});

app.use('/users', usersRoutes);
app.use('/hours', hoursRoutes);
app.use('/appointments', appointmentRoutes);


// Handler para rotas não encontradas
app.use(notFoundHandler);

export default app;
