import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main().catch((err) => console.log(err));
