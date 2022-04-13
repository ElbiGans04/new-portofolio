import { Dispatch } from '@src/types/admin';
import HttpError from '@src/utils/httpError';
type Mutate = <T>(key: string) => Promise<T>;
export async function clientHandlerError(
  err: unknown,
  dispatch: Dispatch,
  mutate: Mutate,
  url: string,
) {
  dispatch({
    type: 'modal/request/finish',
    payload: {
      message: `Errors: ${
        err instanceof HttpError ? err.message : 'Error when try request'
      }`,
    },
  });
  await mutate(url);
}

export async function clientHandlerSuccess(
  message: string,
  dispatch: Dispatch,
  mutate: Mutate,
  url: string,
) {
  dispatch({
    type: 'modal/request/finish',
    payload: { message },
  });
  await mutate(url);
}
