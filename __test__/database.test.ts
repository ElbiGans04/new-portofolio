import dbConnect from '@src/database/connection';
import mongoose from 'mongoose';

jest.mock('mongoose', () => {
  return {
    __esModule: true,
    default: {
      connect: jest.fn().mockResolvedValue({ connect: true }),
    },
  };
});

describe('Test connection', () => {
  const con = mongoose.connect as any as jest.Mock;

  test('Check object yang dikembalikan mongoose', () => {
    return dbConnect().then((con) => {
      expect(con).toEqual({ connect: true });
    });
  });

  test('mongoose.connect dipanggil satu kali', () => {
    expect(con.mock.calls.length).toBe(1);
  });

  test('mongoose.connect dipanggil dengan 2 argument', () => {
    expect(con.mock.calls[0].length).toBe(2);
  });

  test('mongoose.connect dipanggil dengan 2 argument dengan nilai pertama', () => {
    expect(con.mock.calls[0][0]).toBe(process.env.MONGODB_URI);
  });

  test('mongoose.connect dipanggil dengan 2 argument dengan nilai kedua', () => {
    expect(con.mock.calls[0][1]).toBeInstanceOf(Object);
  });
});
