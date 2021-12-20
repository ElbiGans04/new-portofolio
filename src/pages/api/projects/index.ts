import dbConnect from "@database/connection";
import routerErrorHandling from "@module/routerErrorHandling";
import {deleteTempFiles, moveImages} from '@module/files'
import withIronSession from '@middleware/withSession'
import Controller from '@controllers/projects'
import { NextApiResponse } from 'next'
import type { NextIronSessionRequest } from '@typess/nextIronSession'
import { Doc, DocErrors, DocMeta } from "@typess/jsonApi";
import type { RequestControllerRouter, RespondControllerRouter } from '@typess/controllersRoutersApi';

export const config = {
  api: {
    bodyParser: false,
  },
};


export default withIronSession(async function handler(req:RequestControllerRouter, res:RespondControllerRouter) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === 'GET') await Controller.getProjects(req, res)    
    else {

      // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', detail: `can't fulfill the request because access is not allowed`, status: '403'}]});
      
      // Lakukan operasi bedasarkan dari jenis http method
      switch (method) {
        case "POST": {
          if (req.headers["content-type"] !== "application/vnd.api+json")
            return res
              .status(406)
              .json({
                errors: [
                  {
                    title: "content-type headers not supported",
                    detail:
                      "if you try to send JSON:API document please you try to change the content-type headers to application/vnd.api+json",
                    status: "406",
                  },
                ],
              });
          await Controller.postProjects(req, res)
          break;
        }
        default:
          throw { title: "method not found", code: 404 }
          break;
      }
    }

  } catch (err) {
    console.log(err)
    // Setiap Ada error semua file dalam tmp file
    await deleteTempFiles()
    routerErrorHandling(res, err)
  }
  // res.json({vv:'s'})
})


