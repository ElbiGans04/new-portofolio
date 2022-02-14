import { Document } from 'mongoose';
import { OObject } from '@typess/jsonApi/object';

interface ResultType {
  type: string;
  id: string | null;
  attributes: {
    [index: string]: OObject;
  };
}

export default function formatResource<T>(
  data: Document<T, any, any>[] | Document<T, any, any>,
  type: string,
) {
  const transfrom = (dataMentah: Document<T, any, any>) => {
    const result: ResultType = {
      type,
      id: null,
      attributes: {},
    };

    const newDataMentah = dataMentah.toObject();
    // let test = Object.keys(newDataMentah)
    // for (let properti in newDataMentah) {
    //     if (properti === '_id') result.id = newDataMentah[properti];
    //     else if (newDataMentah.hasOwnProperty(properti)) {
    //         result.attributes[properti] = newDataMentah[properti];
    //     }
    // }

    for (const [key, value] of Object.entries(newDataMentah)) {
      if (key !== '__v') {
        if (key === '_id') result.id = value as string;
        else if (Object.prototype.hasOwnProperty.call(newDataMentah, key)) {
          result.attributes[key] = value as string;
        }
      }
    }

    return result;
  };

  if (!Array.isArray(data)) return transfrom(data);
  return data.map((dataTunggal) => transfrom(dataTunggal));
}
