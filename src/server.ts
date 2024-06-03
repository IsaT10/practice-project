import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { Server } from 'http';
dotenv.config();

let server: Server;

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    server = app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main().catch((err) => console.log(err));

process.on('unhandledRejection', () => {
  console.log('UnhandledRejection 💥 Shutting Down...');

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('UnhandledException 💥 Shutting Down...');
  process.exit(1);
});
