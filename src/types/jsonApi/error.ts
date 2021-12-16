import type {meta} from './meta'
import type {link} from './link'

export interface error {
    id?: string,
    links?: {
        about: link
    }
    status: string,
    code?: string,
    title: string,
    detail: string,
    source?: {
        pointer?: {
            [index: string]: string
        },
        parameter?: string
    },
    meta?: meta
}