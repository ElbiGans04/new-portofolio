import type {meta} from '@typess/jsonApi/meta'
import type {link} from '@typess/jsonApi/link'

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