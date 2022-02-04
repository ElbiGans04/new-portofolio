import { Mongoose } from 'mongoose';

declare global {
  const mongoose: {
    conn: Promise<Mongoose> | null;
    promise: Promise<any> | null;
  };
}
