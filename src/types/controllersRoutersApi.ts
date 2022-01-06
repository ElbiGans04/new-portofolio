import { Doc, DocErrors, DocMeta, ResourceObjectForSend } from "@typess/jsonApi";
import { Files } from 'formidable';
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
export interface RequestControllerRouter extends NextApiRequest{
    files: Files,
    body: ResourceObjectForSend,
    session: Session
}

export interface RespondControllerRouter extends NextApiResponse<Doc | DocMeta | DocErrors> {}