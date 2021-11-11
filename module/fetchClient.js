export default async function fetcher (url, options = {}) {
    try {
        const request = await fetch(url, options);

        // SEMUA REQUEST HARUS MENGEMBALIKAN JSON
        // DENGAN FORMAT jsonapi.org

        
        // parse
        const request2 = await request.json();
        if (!request.ok) throw request2;
        
        return request2

    } catch (err) {
        console.log(err)
        throw err
    }
}