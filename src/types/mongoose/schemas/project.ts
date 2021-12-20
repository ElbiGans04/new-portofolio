import images from '@typess/mongoose/schemas/image'
import { Document, Types } from 'mongoose'



export default interface project {
    _id: Types.ObjectId,
    title: string,
    startDate: Date,
    endDate: Date,
    tools: Types.Array<Types.ObjectId>,
    typeProject: Types.ObjectId,
    images: Types.DocumentArray<Document<images>>,
    description: string,
    url: string
}