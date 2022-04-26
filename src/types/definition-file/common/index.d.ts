import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
  namespace jest {
    interface Mock {
      find: jest.Mock;
      findById: jest.Mock;
      findByIdAndDelete: jest.Mock;
      findByIdAndUpdate: jest.Mock;
    }
  }
}
