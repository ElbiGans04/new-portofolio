import { Dispatch } from '@src/types/admin';
import { DocErrors } from '@src/types/jsonApi';
type Mutate = <T>(key: string) => Promise<T>;
export async function clientHandlerError(
  err: unknown,
  dispatch: Dispatch,
  mutate: Mutate,
  url: string,
) {
  const errors = err as DocErrors;
  console.log(errors);
  dispatch({
    type: 'modal/request/finish',
    payload: {
      message: `Errors: ${errors.errors
        .map((error) => error.title)
        .join(', ')}`,
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
