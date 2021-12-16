import {Mongoose} from 'mongoose'
export declare global {
    var mongoose: {
        conn: Promise<Mongoose> | null,
        promise: Promise<any> | null
    }
}
