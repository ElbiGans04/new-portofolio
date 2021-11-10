export default function (data, type) {
    if (data) {
        let transfrom = (dataMentah) => {
            let result = {
                type,
                id: null,
                attributes : {},
            };
            
            dataMentah = dataMentah.toObject();
            for (let properti in dataMentah) {
                if (properti === '_id') result.id = dataMentah[properti];
                else if (dataMentah.hasOwnProperty(properti)) {
                    result.attributes[properti] = dataMentah[properti];
                }
            }
    
            return result
        };
        
        if (!Array.isArray(data)) return transfrom(data);
        return data.map((dataTunggal) => {
            return transfrom(dataTunggal)
        })
    }
}