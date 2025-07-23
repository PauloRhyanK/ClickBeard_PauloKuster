import dotenv from 'dotenv';
import app from './app';

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  console.log(`Servidor rodando em ${baseUrl}:${PORT}`);
});
