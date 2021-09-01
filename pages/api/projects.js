import dbConnect from "../../database/connection";
import Project from "../../database/schemas/projects";
import TypeProject from "../../database/schemas/typeProject";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { type = "ALL", order = "ASC" } = req.query;
        let results;

        if (type === "ALL") {
          results = await Project.find()
            .sort({ title: order === "ASC" ? 1 : -1 })
            .populate("typeProject");
        } else {
          results = (
            await TypeProject.findOne({ _id: type })
              .sort({ title: order === "ASC" ? 1 : -1 })
              .populate({ path: "projects", populate: 'typeProject' })
          ).projects;
        }


        res.status(200).json({ success: true, data: results });
      
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const pet = await Project.create({
          ...req.body,
          tools: [{ name: req.body.tools }],
          images: [{ src: req.body.images }],
        }); /* create a new model in the database */
        res.status(201).json({ success: true, data: pet });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
  // res.json({vv:'s'})
}
