import { Doc, DocErrors, DocMeta } from "@typess/jsonApi";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { OObject } from "./jsonApi/object";
export interface RequestControllerRouter extends NextApiRequest{
    files?: {
        [file: string] : formidable.File | formidable.File[]
    },
    body: {
        [index: string]: OObject
    },
    session?: Session
}

export interface RespondControllerRouter extends NextApiResponse<Doc | DocMeta | DocErrors> {}
