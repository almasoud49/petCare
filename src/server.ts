import { connectDB } from './config/db';
import { env } from './config/env';
import app from './app';

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

start();