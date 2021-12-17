import { NextApiRequest, NextApiResponse } from "next";
import {Fields, Files} from 'formidable'
import { Doc, DocErrors, DocMeta } from "@typess/jsonApi";
import { Session } from "next-iron-session";

export interface RequestControllerRouter extends NextApiRequest{
    files: Files,
    body: Fields | null,
    session: Session
}

export interface RespondControllerRouter extends NextApiResponse<Doc | DocMeta | DocErrors> {}