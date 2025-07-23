import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('ClickBeard API rodando');
});

app.listen(PORT, () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  console.log(`Servidor rodando em ${baseUrl}:${PORT}`);
});
