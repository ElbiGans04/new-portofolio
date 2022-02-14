export async function fetcherGeneric<T>(url: string, options = {}) {
  const request = await fetch(url, options);

  // SEMUA REQUEST HARUS MENGEMBALIKAN JSON
  // DENGAN FORMAT jsonapi.org

  // parse
  const request2 = (await request.json()) as T;
  if (!request.ok) throw request2;

  return request2;
}
