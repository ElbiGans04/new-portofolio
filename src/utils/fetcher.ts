import HttpError from './httpError';
import { DocErrors } from '@src/types/jsonApi';
export async function fetcherGeneric<T>(url: string, options = {}) {
  const request = await fetch(url, options);

  // SEMUA REQUEST HARUS MENGEMBALIKAN JSON
  // DENGAN FORMAT jsonapi.org

  // parse
  const request2 = (await request.json()) as T;
  if (!request.ok) {
    const docErrors = request2 as any as DocErrors;
    throw new HttpError(
      docErrors.errors.map((error) => error.title).join(', '),
      request.status,
      docErrors.errors.map((error) => error.detail).join(', '),
    );
  }

  return request2;
}
