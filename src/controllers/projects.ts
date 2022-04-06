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
import { OObject } from '@src/types/jsonApi/object';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';
import TypeProjectSchemaInterface from '@src/types/mongoose/schemas/typeProject';
import { TransformToDoc } from '@src/utils/typescript/transformSchemeToDoc';
import Joi from 'joi';
import { DocDataDiscriminated, ResourceObject } from '@src/types/jsonApi';
import { isTool } from '@src/utils/typescript/narrowing';

const ProjectSchemaValidation = Joi.object({
  type: Joi.string().max(50).required(),
  id: Joi.string().max(100),
  attributes: Joi.object({
    title: Joi.string().max(50).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    tools: Joi.array().items(Joi.string().required()).unique().min(1),
    typeProject: Joi.string().alphanum().max(50).required(),
    description: Joi.string().max(500).required(),
    url: Joi.string().max(50).required(),
    images: Joi.array()
      .items(
        Joi.object({
          src: Joi.string().max(300).required(),
          ref: Joi.string().max(100).required(),
        }),
      )
      .min(1)
      .required(),
  })
    .required()
    .required(),
}).required();

type data = ResourceObject<
  ProjectSchemaInterface,
  'Project',
  'tools' | 'typeProject'
>;
type relationship =
  | ResourceObject<ToolSchemaInterface, 'tool'>
  | ResourceObject<TypeProjectSchemaInterface, 'typeProject'>;

class Projects {
  async getProject(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { projectID } = req.query as { projectID: string };
    const resultProjects = await projectsSchema
      .findById(projectID, { __v: 0 })
      .populate('typeProject')
      .populate('tools')
      .lean();

    // jika ga ada
    if (!resultProjects)
      throw new HttpError('Project not found', 404, 'Project not found in db');

    const typeProject =
      resultProjects.typeProject as TypeProjectSchemaInterface;

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: {
          type: 'Project',
          id: resultProjects._id.toString(),
          attributes: {
            title: resultProjects.title,
            startDate: resultProjects.startDate,
            endDate: resultProjects.endDate,
            images: resultProjects.images,
            description: resultProjects.description,
            url: resultProjects.url,
          },
          relationships: {
            tools: {
              data: resultProjects.tools.map((tool) => ({
                type: 'tool',
                id: isTool(tool) ? tool._id.toString() : tool.toString(),
              })),
            },
            typeProject: {
              data: {
                id:
                  typeof resultProjects.typeProject === 'string'
                    ? resultProjects.typeProject
                    : resultProjects.typeProject._id,
                type: 'toolProject',
              },
            },
          },
        },
        included: [
          ...resultProjects.tools.map((tool) => {
            const Tool = tool as ToolSchemaInterface;
            return {
              type: 'tool' as const,
              id: Tool._id.toString(),
              attributes: {
                name: Tool.name,
                as: Tool.as,
              },
            };
          }),
          {
            type: 'typeProject' as const,
            id: typeProject._id,
            attributes: {
              name: typeProject.name,
            },
          },
        ],
        code: 200,
      }),
    );
  }

  async getProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    const results = await projectsSchema
      .find({}, { __v: 0 })
      .sort({ title: 1 })
      .populate('typeProject')
      .populate('tools')
      .lean();

    const included = results
      .map((result) => {
        const typeProject = result.typeProject as TypeProjectSchemaInterface;
        return [
          ...result.tools.map((tool) => {
            const Tool = tool as ToolSchemaInterface;
            return {
              type: 'tool' as const,
              id: Tool._id.toString(),
              attributes: {
                name: Tool.name,
                as: Tool.as,
              },
            };
          }),
          {
            type: 'typeProject' as const,
            id: typeProject._id,
            attributes: {
              name: typeProject.name,
            },
          },
        ];
      })
      .flat();

    // remove dupplicate
    const includedFinal: typeof included = included.reduce((prevVal, val) => {
      if (prevVal.findIndex((prevVal2) => prevVal2.id === val.id) === -1)
        prevVal.push(val);
      return prevVal;
    }, [] as typeof included);

    const Doc: DocDataDiscriminated<Array<data>, relationship> = {
      data: results.map((result) => {
        return {
          type: 'Project',
          id: result._id.toString(),
          attributes: {
            title: result.title,
            startDate: result.startDate,
            endDate: result.endDate,
            images: result.images,
            description: result.description,
            url: result.url,
          },
          relationships: {
            tools: {
              data: result.tools.map((tool) => ({
                type: 'tool',
                id: isTool(tool) ? tool._id.toString() : tool.toString(),
              })),
            },
            typeProject: {
              data: {
                id:
                  typeof result.typeProject === 'string'
                    ? result.typeProject
                    : result.typeProject._id,
                type: 'toolProject',
              },
            },
          },
        };
      }),
      included: includedFinal,
    };
    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify(Doc));
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

    await res.unstable_revalidate('/projects');

    const typeProject = project.typeProject as TypeProjectSchemaInterface;

    // atur headers
    res.setHeader('Location', `/api/projects/${project._id as string}`);
    res.setHeader('content-type', 'application/vnd.api+json');

    res.statusCode = 201;
    return res.end(
      JSON.stringify({
        meta: { code: 201, title: 'The project has created' },
        data: {
          type: 'Project',
          id: project._id as string,
          attributes: {
            title: project.title,
            startDate: project.startDate,
            endDate: project.endDate,
            images: project.images,
            description: project.description,
            url: project.url,
          },
          relationships: {
            tools: {
              data: project.tools.map((tool) => ({
                type: 'tool',
                id: isTool(tool) ? tool._id.toString() : tool.toString(),
              })),
            },
            typeProject: {
              data: {
                id:
                  typeof project.typeProject === 'string'
                    ? project.typeProject
                    : project.typeProject._id,
                type: 'toolProject',
              },
            },
          },
        },
        included: [
          ...project.tools.map((tool) => {
            const Tool = tool as ToolSchemaInterface;
            return {
              type: 'tool' as const,
              id: Tool._id.toString(),
              attributes: {
                name: Tool.name,
                as: Tool.as,
              },
            };
          }),
          {
            type: 'typeProject' as const,
            id: typeProject._id,
            attributes: {
              name: typeProject.name,
            },
          },
        ],
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
    await res.unstable_revalidate('/projects');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 204;
    return res.end(
      JSON.stringify({ meta: { title: 'success update data', code: 204 } }),
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

    await res.unstable_revalidate('/projects');
    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 204;
    return res.end(
      JSON.stringify({ meta: { title: 'success deleted', code: 204 } }),
    );
  }

  async validation(body: { [index: string]: OObject }) {
    // Validasi
    const validReqBody = Joi.attempt(
      body,
      ProjectSchemaValidation,
    ) as TransformToDoc<ProjectSchemaInterface>;

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
