export default async function fetcher (url, options = {}) {
    try {
        const request = await fetch(url, options);

        // SEMUA REQUEST HARUS MENGEMBALIKAN JSON
        // DENGAN FORMAT jsonapi.org

        if (!request.ok) throw request2;

        // parse
        const request2 = await request.json();

        return request2

    } catch (err) {
        throw err
    }
}