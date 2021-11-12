import bodyParser from "body-parser";
import Joi from "joi";
import runMiddleware from "../module/runMiddleware";
import Project from "../database/schemas/projects";
import formatResource from "../module/formatResource";
import Tools from "../database/schemas/tools";
import TypeProject from "../database/schemas/typeProject";
import ProjectValidationSchema from "../validation/projects";
import { deleteTempFiles, moveImages } from "../module/files";
import fsPromise from "fs/promises";
import path from "path";
const pathImage = path.resolve(process.cwd(), "public/images");

class Projects {
  async getProject(req, res) {
    const { projectID } = req.query;
    const result = await Project.findById(projectID)
      .populate("tools")
      .populate("typeProject");

    // jika ga ada
    if (!result) throw { title: "project not found", code: 404 };

    res.setHeader("content-type", "application/vnd.api+json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(result, result.constructor.modelName),
        code: 200,
      })
    );
  }

  async getProjects(req, res) {
    const { type = "ALL", order = "ASC" } = req.query;
    let results = await Project.find()
      .sort({ title: order === "ASC" ? 1 : -1 })
      .populate("typeProject")
      .populate("tools");

    res.setHeader("content-type", "application/vnd.api+json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(results, results.constructor.modelName),
        code: 200,
      })
    );
  }

  async postProjects(req, res) {
    await runMiddleware(
      req,
      res,
      bodyParser.json({ type: "application/vnd.api+json" })
    );

    // Validasi
    const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);

    // Jika hanya mengirim satu data tools
    if (validReqBody.attributes.tools instanceof Array === false) {
      validReqBody.attributes.tools = [validReqBody.attributes.tools];
    }

    // Check Apakah typeProject dengan id tertentu ada
    if (
      (await TypeProject.findById(validReqBody.attributes.typeProject)) === null
    ) {
      throw { title: "invalid type project id", code: 404 };
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (let tool of validReqBody.attributes.tools) {
      // cek jika tool
      if ((await Tools.findById(tool)) === null) {
        throw { title: "invalid tool id", code: 404 };
      }
    }

    // Simpan Ke database
    const project = new Project(validReqBody.attributes);

    await project.save();

    // Pindahkan Gambar
    if (req.body.attributes.images) await moveImages(req.body.attributes.images);

    // atur headers
    res.setHeader("Location", `/api/projects/${project._id}`);
    res.setHeader("content-type", "application/vnd.api+json");

    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        meta: { code: 200, title: "The project has created" },
        data: formatResource(project, project.constructor.modelName),
      })
    );
  }

  async patchProject(req, res) {
    await runMiddleware(
      req,
      res,
      bodyParser.json({ type: "application/vnd.api+json" })
    );

    const { projectID } = req.query;

    console.log(req.body)

    // Validasi
    const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);

    // Jika tidak memasukan field id
    if (!validReqBody.id)
      throw { title: "missing id property in request document", code: 404 };

    // Jika hanya mengirim satu data tools
    if (validReqBody.attributes.tools instanceof Array === false) {
      validReqBody.attributes.tools = [validReqBody.attributes.tools];
    }

    // Check Apakah typeProject dengan id tertentu ada
    if (
      (await TypeProject.findById(validReqBody.attributes.typeProject)) === null
    ) {
      throw { title: "invalid type project id", code: 404 };
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (let tool of validReqBody.attributes.tools) {
      // cek jika tool
      if ((await Tools.findById(tool)) === null) {
        throw { title: "invalid tool id", code: 404 };
      }
    }

    // Ambil Daftar gambar lama
    const result2Old = await Project.findById(projectID, { images: 1 });

    const result2 = await Project.findByIdAndUpdate(
      projectID,
      validReqBody.attributes,
      { new: true }
    );

    // Jika ga ada
    if (!result2Old) {
      throw { title: "project not found", code: 404 };
    }

    // Hapus gambar lama
    if (req.body.attributes.images.length > 0) {
      for (let image of result2Old.images) {
        await fsPromise.unlink(`${pathImage}/${image.src}`);
      }

      // pindahkan gambar
      await moveImages(req.body.attributes.images);
    }

    res.setHeader("content-type", "application/vnd.api+json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: "success update data", code: 200 } })
    );
  }

  async deleteProject(req, res) {
    const { projectID } = req.query;
    const result = await Project.findByIdAndDelete(projectID);

    if (!result) throw { title: "project not found", code: 404 };

    // Hapus imagenya juga
    for (let image of result.images) {
      await fsPromise.unlink(`${pathImage}/${image.src}`);
    }

    res.setHeader("content-type", "application/vnd.api+json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: "success deleted", code: 200 } })
    );
  }
}

export default new Projects();
