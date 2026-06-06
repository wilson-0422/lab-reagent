import { createApp } from './config/app';
import { initializeDatabase } from './config/database';
import routes from './routes';

const app = createApp();
const PORT = process.env.PORT || 3000;

initializeDatabase();

app.use(routes);

app.use((req, res) => {
  res.status(404).render('index', { error: '页面未找到' });
});

app.listen(PORT, () => {
  console.log(`实验室试剂与仪器管控平台已启动: http://localhost:${PORT}`);
});
