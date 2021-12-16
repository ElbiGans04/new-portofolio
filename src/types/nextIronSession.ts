import {Session} from 'next-iron-session'
import {NextApiRequest} from 'next'

export type NextIronSessionRequest = NextApiRequest & {
    session: Session
}