import Project from '@database/schemas/projects';
import Tools from '@database/schemas/tools';
import TypeProject from '@database/schemas/typeProject';
import { formidableHandler } from '@middleware/formidable';
import runMiddleware from '@middleware/runMiddleware';
import { moveImages } from '@utils/files';
import formatResource from '@utils/formatResource';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import ProjectValidationSchema from '@validation/projects';
import fsPromise from 'fs/promises';
import Joi from 'joi';
import path from 'path';
import ProjectInterface from '@typess/mongoose/schemas/project';
import {
  TransformToDocClient,
  TransformToDocServer,
} from '@utils/typescript/transformSchemeToDoc';
import { Types } from 'mongoose';
import { isObject } from '@utils/typescript/narrowing';
import HttpError from '@src/modules/httpError';

const pathImage = path.resolve(process.cwd(), 'public/images');

class Projects {
  async getProject(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { projectID } = req.query as { projectID: string };
    const result = await Project.findById(projectID)
      .populate('tools')
      .populate('typeProject');

    // jika ga ada
    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

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
    const validReqBody = Joi.attempt(
      req.body,
      ProjectValidationSchema,
    ) as TransformToDocClient<ProjectInterface>;

    // Jika hanya mengirim satu data tools
    if (!Array.isArray(validReqBody.attributes.tools)) {
      const tools = validReqBody.attributes.tools as Types.ObjectId;
      validReqBody.attributes.tools = [tools] as Types.Array<Types.ObjectId>;
    }

    // Check Apakah typeProject dengan id tertentu ada
    if (
      (await TypeProject.findById(validReqBody.attributes.typeProject)) === null
    ) {
      throw new HttpError(
        'Invalid type project id',
        404,
        'Invalid type project id',
      );
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (const tool of validReqBody.attributes.tools) {
      // cek jika tool
      if ((await Tools.findById(tool)) === null) {
        throw new HttpError('Invalid tool id', 404, 'Invalid tool id');
      }
    }

    // Simpan Ke database
    const project = new Project(validReqBody.attributes);

    await project.save();

    if (!isObject(req.body.attributes)) {
      throw new HttpError(
        'Entity not valid',
        406,
        'This happens because Entity not sent to server or not valid',
      );
    }

    // Pindahkan Gambar
    const { images } = req.body.attributes;
    if (images) {
      if (Array.isArray(images)) {
        let validFormat = true;
        // Check jika ada yang formatnya bukan string
        images.forEach((image) => {
          if (isObject(image)) {
            if (typeof image.src !== 'string') validFormat = false;
          } else validFormat = false;
        });

        if (validFormat) await moveImages(images as { src: string }[]);
      }
    }

    // atur headers
    res.setHeader('Location', `/api/projects/${project._id as string}`);
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

    // Validasi
    const validReqBody = Joi.attempt(
      req.body,
      ProjectValidationSchema,
    ) as TransformToDocServer<ProjectInterface>;

    // Jika tidak memasukan field id
    if (!validReqBody.id)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    // Jika hanya mengirim satu data tools
    if (!Array.isArray(validReqBody.attributes.tools)) {
      const tools = validReqBody.attributes.tools as Types.ObjectId;
      validReqBody.attributes.tools = [tools] as Types.Array<Types.ObjectId>;
    }

    // Check Apakah typeProject dengan id tertentu ada
    if (
      (await TypeProject.findById(validReqBody.attributes.typeProject)) === null
    ) {
      throw new HttpError(
        'Invalid type project id',
        404,
        'Invalid type project id',
      );
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (const tool of validReqBody.attributes.tools) {
      // cek jika tool
      if ((await Tools.findById(tool)) === null) {
        throw new HttpError('Invalid tool id', 404, 'Invalid tool id');
      }
    }

    // Ambil Daftar gambar lama
    const result2Old = await Project.findById(projectID, { images: 1 });

    // Lakukan Perubahan
    await Project.findByIdAndUpdate(projectID, validReqBody.attributes, {
      new: true,
    });

    // Jika ga ada
    if (!result2Old) {
      throw new HttpError(
        'project with that id not found',
        404,
        'project with that id not found',
      );
    }

    if (!isObject(req.body.attributes)) {
      throw new HttpError(
        'Entity not valid',
        406,
        'This happens because Entity not sent to server or not valid',
      );
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
          if (isObject(image)) {
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

    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

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
