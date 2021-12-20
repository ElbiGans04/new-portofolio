import { Types } from 'mongoose'

export default interface tool {
    _id: Types.ObjectId
    name: string,
    as: string,
}