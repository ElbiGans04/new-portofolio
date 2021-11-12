import dbConnect from "../../../database/connection";
import routerErrorHandling from "../../../module/routerErrorHandling";
import {deleteTempFiles, moveImages} from '../../../module/files'
import withIronSession from '../../../module/withSession'
import Controller from '../../../controllers/projects'


export const config = {
  api: {
    bodyParser: false,
  },
};


export default withIronSession(async function handler(req, res) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === 'GET') await Controller.getProjects(req, res)    
    else {

      // Jika belum login
      if (!req.session.get('user')) return res.status(403).json({errors: [{title: 'please login ahead', code: 403}]});
      
      // Lakukan operasi bedasarkan dari jenis http method
      switch (method) {
        case "POST": {
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


