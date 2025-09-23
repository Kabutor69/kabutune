// Express server entry: sets up middleware and mounts API routes
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', routes);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
