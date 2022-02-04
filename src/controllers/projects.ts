import Project from '@database/schemas/projects';
import Tools from '@database/schemas/tools';
import TypeProject from '@database/schemas/typeProject';
import { formidableHandler } from '@middleware/formidable';
import runMiddleware from '@middleware/runMiddleware';
import { moveImages } from '@module/files';
import formatResource from '@module/formatResource';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import ProjectValidationSchema from '@validation/projects';
import fsPromise from 'fs/promises';
import Joi from 'joi';
import path from 'path';

const pathImage = path.resolve(process.cwd(), 'public/images');

class Projects {
  async getProject(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { projectID } = req.query as { projectID: string };
    const result = await Project.findById(projectID)
      .populate('tools')
      .populate('typeProject');

    // jika ga ada
    if (!result) throw { title: 'project not found', code: 404 };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(result, Project.modelName),
        code: 200,
      }),
    );
  }

  async getProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    const { order = 'ASC' } = req.query;
    const results = await Project.find()
      .sort({ title: order === 'ASC' ? 1 : -1 })
      .populate('typeProject')
      .populate('tools');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(results, Project.modelName),
        code: 200,
      }),
    );
  }

  async postProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    await runMiddleware(req, res, formidableHandler);

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
      throw { title: 'invalid type project id', code: 404 };
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (const tool of validReqBody.attributes.tools) {
      // cek jika tool
      if ((await Tools.findById(tool)) === null) {
        throw { title: 'invalid tool id', code: 404 };
      }
    }

    // Simpan Ke database
    const project = new Project(validReqBody.attributes);

    await project.save();

    if (
      typeof req.body.attributes !== 'object' ||
      Array.isArray(req.body.attributes) ||
      req.body.attributes === null
    ) {
      return res.status(406).json({
        errors: [
          {
            title: 'Entity not valid',
            detail:
              'This happens because Entity not sent to server or not valid',
            status: '406',
          },
        ],
      });
    }

    // Pindahkan Gambar
    const { images } = req.body.attributes;
    if (images) {
      if (Array.isArray(images)) {
        let validFormat = true;
        // Check jika ada yang formatnya bukan string
        images.forEach((image) => {
          if (
            typeof image === 'object' &&
            !Array.isArray(image) &&
            image !== null
          ) {
            if (typeof image.src !== 'string') validFormat = false;
          } else validFormat = false;
        });

        if (validFormat) await moveImages(images as { src: string }[]);
      }
    }

    // atur headers
    res.setHeader('Location', `/api/projects/${project._id}`);
    res.setHeader('content-type', 'application/vnd.api+json');

    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        meta: { code: 200, title: 'The project has created' },
        // data: formatResource(project, Project.modelName),
      }),
    );
  }

  async patchProject(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    await runMiddleware(req, res, formidableHandler);

    const { projectID } = req.query;

    console.log(req.body);

    // Validasi
    const validReqBody = Joi.attempt(req.body, ProjectValidationSchema);

    // Jika tidak memasukan field id
    if (!validReqBody.id)
      throw { title: 'missing id property in request document', code: 404 };

    // Jika hanya mengirim satu data tools
    if (validReqBody.attributes.tools instanceof Array === false) {
      validReqBody.attributes.tools = [validReqBody.attributes.tools];
    }

    // Check Apakah typeProject dengan id tertentu ada
    if (
      (await TypeProject.findById(validReqBody.attributes.typeProject)) === null
    ) {
      throw { title: 'invalid type project id', code: 404 };
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (const tool of validReqBody.attributes.tools) {
      // cek jika tool
      if ((await Tools.findById(tool)) === null) {
        throw { title: 'invalid tool id', code: 404 };
      }
    }

    // Ambil Daftar gambar lama
    const result2Old = await Project.findById(projectID, { images: 1 });

    const result2 = await Project.findByIdAndUpdate(
      projectID,
      validReqBody.attributes,
      { new: true },
    );

    // Jika ga ada
    if (!result2Old) {
      throw { title: 'project not found', code: 404 };
    }

    if (
      typeof req.body.attributes !== 'object' ||
      Array.isArray(req.body.attributes) ||
      req.body.attributes === null
    ) {
      return res.status(406).json({
        errors: [
          {
            title: 'Entity not valid',
            detail:
              'This happens because Entity not sent to server or not valid',
            status: '406',
          },
        ],
      });
    }

    // Hapus gambar lama
    const { images } = req.body.attributes;
    if (Array.isArray(images)) {
      if (images.length > 0) {
        for (const image of result2Old.images) {
          await fsPromise.unlink(`${pathImage}/${image.get('src') as string}`);
        }

        // pindahkan gambar
        let validFormat = true;

        // Check jika ada yang formatnya bukan string
        images.forEach((image) => {
          if (
            typeof image === 'object' &&
            !Array.isArray(image) &&
            image !== null
          ) {
            if (typeof image.src !== 'string') validFormat = false;
          } else validFormat = false;
        });

        if (validFormat) await moveImages(images as { src: string }[]);
      }
    }

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success update data', code: 200 } }),
    );
  }

  async deleteProject(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    const { projectID } = req.query;
    const result = await Project.findByIdAndDelete(projectID);

    if (!result) throw { title: 'project not found', code: 404 };

    // Hapus imagenya juga
    for (const image of result.images) {
      await fsPromise.unlink(`${pathImage}/${image.get('src') as string}`);
    }

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success deleted', code: 200 } }),
    );
  }
}

export default new Projects();
