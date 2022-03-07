import {
  projectsSchema,
  toolSchema,
  typeProjectSchema,
} from '@src/database/index';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import formatResource from '@src/utils/formatResource';
import { OObject } from '@src/types/jsonApi/object';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import { TransformToDoc } from '@src/utils/typescript/transformSchemeToDoc';
import Joi from 'joi';
import { Types } from 'mongoose';

const ProjectSchemaValidation = Joi.object({
  type: Joi.string().max(50).required(),
  id: Joi.string().max(100),
  attributes: Joi.object({
    title: Joi.string().max(50).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    tools: Joi.alternatives().try(
      Joi.array().items(Joi.string().required()).unique().min(2),
      Joi.string().required(),
    ),
    typeProject: Joi.string().alphanum().max(50).required(),
    description: Joi.string().max(500).required(),
    url: Joi.string().max(50).required(),
    images: Joi.array()
      .items(
        Joi.object({
          src: Joi.string().max(100).required(),
          ref: Joi.string().max(100).required(),
        }),
      )
      .min(1)
      .required(),
  })
    .required()
    .required(),
}).required();

class Projects {
  async getProject(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { projectID } = req.query as { projectID: string };

    const result = await projectsSchema
      .findById(projectID)
      .populate('tools')
      .populate('typeProject');

    // jika ga ada
    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(result, projectsSchema.modelName),
        code: 200,
      }),
    );
  }

  async getProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    const results = await projectsSchema
      .find()
      .sort({ title: 1 })
      .populate('typeProject')
      .populate('tools');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(results, projectsSchema.modelName),
        code: 200,
      }),
    );
  }

  async postProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    await runMiddleware(req, res, formidableHandler);

    const validReqBody = await this.validation(req.body);

    // Simpan Ke database
    const project = new projectsSchema(validReqBody.attributes);

    await project.save();

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
    const validReqBody = await this.validation(req.body);

    // Jika tidak memasukan field id
    if (validReqBody.id === undefined)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    // Lakukan Perubahan
    const result = await projectsSchema.findByIdAndUpdate(
      projectID,
      validReqBody.attributes,
      {
        new: true,
      },
    );

    // Jika ga ada
    if (!result) {
      throw new HttpError(
        'project with that id not found',
        404,
        'project with that id not found',
      );
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
    const result = await projectsSchema.findByIdAndDelete(projectID);

    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success deleted', code: 200 } }),
    );
  }

  async validation(body: { [index: string]: OObject }) {
    // Validasi
    const validReqBody = Joi.attempt(
      body,
      ProjectSchemaValidation,
    ) as TransformToDoc<ProjectSchemaInterface>;

    // Jika hanya mengirim satu data tools
    if (!Array.isArray(validReqBody.attributes.tools)) {
      const tools = validReqBody.attributes.tools;
      validReqBody.attributes.tools = [tools] as Types.Array<Types.ObjectId>;
    }

    // Check Apakah typeProject dengan id tertentu ada
    if (
      (await typeProjectSchema.findById(
        validReqBody.attributes.typeProject,
      )) === null
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
      if ((await toolSchema.findById(tool)) === null) {
        throw new HttpError('Invalid tool id', 404, 'Invalid tool id');
      }
    }

    return validReqBody;
  }
}

export default new Projects();
