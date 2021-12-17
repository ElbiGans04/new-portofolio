import { Document, Model, QueryWithHelpers } from "mongoose";
import {OObject} from '@typess/jsonApi/object'
interface ResultType {
    type: string,
    id: string | null,
    attributes: {
        [index: string]: OObject
    }
}

export default function formatResource <T> (data: Document<T, any, any>[] | Document<T, any, any>, type: string) {
    let transfrom = (dataMentah: Document<T, any, any>) => {
        let result: ResultType = {
            type,
            id: null,
            attributes : {},
        };
        
        const newDataMentah = dataMentah.toObject();
        // let test = Object.keys(newDataMentah)
        // for (let properti in newDataMentah) {
        //     if (properti === '_id') result.id = newDataMentah[properti];
        //     else if (newDataMentah.hasOwnProperty(properti)) {
        //         result.attributes[properti] = newDataMentah[properti];
        //     }
        // }

        for (let [key, value] of Object.entries(newDataMentah)) {
            if (key !== '__v') {
                if (key === '_id') result.id = value;
                else if (newDataMentah.hasOwnProperty(key)) {
                    result.attributes[key] = value;
                }
            }
        }

        return result
    };
    
    if (!Array.isArray(data)) return transfrom(data);
    return data.map((dataTunggal) => {
        return transfrom(dataTunggal)
    })
}