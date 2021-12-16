import images from './image'
import {Types} from 'mongoose'
export default interface project {
    title: string,
    startDate: Date,
    endDate: Date,
    tools: Types.ObjectId[],
    typeProject: string,
    images: images[],
    description: string,
    url: string
}