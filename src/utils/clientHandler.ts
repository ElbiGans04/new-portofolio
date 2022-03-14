import { Dispatch } from '@src/types/admin';
import HttpError from '@src/utils/httpError';
type Mutate = <T>(key: string) => Promise<T>;
export async function clientHandlerError(
  err: unknown,
  dispatch: Dispatch,
  mutate: Mutate,
  url: string,
) {
  if (err instanceof HttpError) {
    dispatch({
      type: 'modal/request/finish',
      payload: {
        message: `Errors: ${err.message}`,
      },
    });
    await mutate(url);
    return;
  }

  console.error(err);
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
