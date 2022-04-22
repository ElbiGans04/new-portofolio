import {
  clientHandlerError,
  clientHandlerSuccess,
} from '@src/utils/clientHandler';

describe('ClientHandler', () => {
  describe('ClientHandlerError', () => {
    const jDispatch = jest.fn();
    const jMutate = jest.fn();
    const clientHandler = clientHandlerError(
      'Hello World',
      jDispatch,
      jMutate,
      '/a',
    );

    test('Dispatch Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls.length).toBe(1);
    });

    test('Argument dispatch hanya 1 buah', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0].length).toBe(1);
    });

    test('Argument dispatch adalah object', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0][0]).toEqual({
        type: 'modal/request/finish',
        payload: {
          message: `Errors: Error when try request`,
        },
      });
    });

    test('Mutate Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jMutate.mock.calls.length).toBe(1);
    });

    test('Argument mutate hanya 1 buah', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0].length).toBe(1);
    });

    test('Argument mutate adalah /a', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0][0]).toBe('/a');
    });
  });

  describe('ClientHandlerSuccess', () => {
    const jDispatch = jest.fn();
    const jMutate = jest.fn();
    const clientHandler = clientHandlerSuccess(
      'Hello World',
      jDispatch,
      jMutate,
      '/a',
    );

    test('Dispatch Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls.length).toBe(1);
    });

    test('Argument dispatch hanya 1 buah', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0].length).toBe(1);
    });

    test('Argument dispatch adalah object', async () => {
      await clientHandler;
      expect(jDispatch.mock.calls[0][0]).toEqual({
        type: 'modal/request/finish',
        payload: { message: 'Hello World' },
      });
    });

    test('Mutate Hanya dipanggil satu kali', async () => {
      await clientHandler;
      expect(jMutate.mock.calls.length).toBe(1);
    });

    test('Argument mutate hanya 1 buah', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0].length).toBe(1);
    });

    test('Argument mutate adalah /a', async () => {
      await clientHandler;
      expect(jMutate.mock.calls[0][0]).toBe('/a');
    });
  });
});
