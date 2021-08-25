import dbConnect from '../../database/connection'
import Project from '../../database/schemas/projects'

export default async function handler(req, res) {
    const { method } = req;
    console.log(req.query)
    await dbConnect()
  
    switch (method) {
      case 'GET':
        try {
          const projects = await Project.find({}) /* find all the data in our database */
          res.status(200).json({ success: true, data: projects })
          // setTimeout(() => {

          // }, 5000)
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break
      case 'POST':
        try {
          const pet = await Project.create(
            {...req.body, tools: [{name:req.body.tools}]}
          ) /* create a new model in the database */
          res.status(201).json({ success: true, data: pet })
        } catch (error) {
            console.log(error)
          res.status(400).json({ success: false })
        }
        break
      default:
        res.status(400).json({ success: false })
        break
    }
    // res.json({vv:'s'})
  }