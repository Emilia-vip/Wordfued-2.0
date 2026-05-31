import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

// Register routes
await app.register(authRoutes);

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`Server listening on ${port}`);
});
