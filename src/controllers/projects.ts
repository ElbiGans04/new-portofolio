import {
  projectsSchema,
  toolSchema,
  typeProjectSchema,
} from '@src/database/index';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import {
  DocProject,
  DocProjects,
  RelationshipProjectInterface,
} from '@src/types/admin';
import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import { DocMeta } from '@src/types/jsonApi';
import { OObject } from '@src/types/jsonApi/object';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';
import TypeProjectSchemaInterface from '@src/types/mongoose/schemas/typeProject';
import HttpError from '@src/utils/httpError';
import { isTool } from '@src/utils/typescript/narrowing';
import Joi from 'joi';
import { Types } from 'mongoose';
import { NextApiResponse } from 'next';
import dbConnect from '@src/database/connection';

const ProjectSchemaValidation = Joi.object({
  data: Joi.object({
    type: Joi.string().max(50).required(),
    id: Joi.string().max(100),
    attributes: Joi.object({
      title: Joi.string().max(50).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
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
    }).required(),
    relationships: Joi.object({
      tools: Joi.object({
        data: Joi.array()
          .items(
            Joi.object({
              type: Joi.string().max(100).required(),
              id: Joi.string().max(100).required(),
            }).required(),
          )
          .unique((a, b) => {
            const aa = a as { id: string };
            const bb = b as { id: string };
            return aa.id === bb.id;
          })
          .min(1),
      }).required(),
      typeProject: Joi.object({
        data: Joi.object({
          type: Joi.string().alphanum().max(50).required(),
          id: Joi.string().alphanum().max(100).required(),
        }).required(),
      }).required(),
    }).required(),
  }).required(),
}).required();

class Projects {
  async getProject(req: RequestControllerRouter, res: NextApiResponse) {
    try {
      const { projectID } = req.query as { projectID: string };
      await dbConnect();
      const resultProjects = await projectsSchema
        .findById(projectID, { __v: 0 })
        .populate('typeProject')
        .populate({
          path: 'tools',
          populate: { path: 'as' },
        })
        .lean();

      // jika ga ada
      if (!resultProjects)
        throw new HttpError(
          'Project not found',
          404,
          'Project not found in db',
        );

      const typeProject =
        resultProjects.typeProject as TypeProjectSchemaInterface;

      const Doc: DocProject = {
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
                  typeof resultProjects.typeProject === 'object' &&
                  resultProjects.typeProject !== null
                    ? resultProjects.typeProject._id
                    : resultProjects.typeProject
                    ? resultProjects.typeProject
                    : 'NULL',
                type: 'typeProject',
              },
            },
          },
        },
        included: [
          ...resultProjects.tools
            .map((tool) => {
              const Tool = tool as ToolSchemaInterface;
              const ToolAsId =
                typeof Tool.as === 'object' && Tool.as !== null
                  ? Tool.as._id
                  : Tool.as;

              const results: Array<RelationshipProjectInterface> = [
                {
                  type: 'Tool' as const,
                  id: Tool._id.toString(),
                  attributes: {
                    name: Tool.name,
                  },
                  relationships:
                    ToolAsId !== null
                      ? {
                          as: {
                            data: {
                              type: 'typeTool' as const,
                              id: ToolAsId,
                            },
                          },
                        }
                      : undefined,
                },
              ];

              if (ToolAsId && Tool.as !== null && typeof Tool.as === 'object') {
                results.push({
                  type: 'TypeTool' as const,
                  id: ToolAsId,
                  attributes: {
                    name: Tool.as.name,
                  },
                });
              }
              return results;
            })
            .flat(),
          ...(typeProject !== null
            ? [
                {
                  type: 'TypeProject' as const,
                  id: typeProject._id,
                  attributes: {
                    name: typeProject.name,
                  },
                },
              ]
            : []),
        ],
      };

      res.setHeader('content-type', 'application/vnd.api+json');
      res.statusCode = 200;
      return res.end(JSON.stringify(Doc));
    } catch (err) {
      console.log(err);
      res.json({ error: true });
    }
  }

  async getProjects(req: RequestControllerRouter, res: NextApiResponse) {
    try {
      await dbConnect();
      const results = await projectsSchema
        .find({}, { __v: 0 })
        .sort({ title: 1 })
        .populate('typeProject')
        .populate({ path: 'tools', populate: 'as' })
        .lean();

      const included: Array<RelationshipProjectInterface> = results
        .map((result) => {
          const typeProject = result.typeProject as TypeProjectSchemaInterface;
          return [
            ...result.tools
              .map((tool) => {
                const Tool = tool as ToolSchemaInterface;
                return [
                  {
                    type: 'Tool' as const,
                    id: Tool._id.toString(),
                    attributes: {
                      name: Tool.name,
                    },
                    relationships:
                      Tool.as !== null
                        ? {
                            as: {
                              data: {
                                type: 'typeTool' as const,
                                id:
                                  typeof Tool.as === 'string'
                                    ? Tool.as
                                    : Tool.as._id,
                              },
                            },
                          }
                        : undefined,
                  },
                  {
                    type: 'TypeTool' as const,
                    id:
                      typeof Tool.as === 'object' && Tool.as !== null
                        ? Tool.as._id
                        : Tool.as == null
                        ? 'UNKNOWN'
                        : Tool.as,
                    attributes: {
                      name:
                        typeof Tool.as === 'object' && Tool.as !== null
                          ? Tool.as.name
                          : Tool.as == null
                          ? 'UNKNOWN'
                          : Tool.as,
                    },
                  },
                ];
              })
              .flat(),
            {
              type: 'TypeProject' as const,
              id:
                typeof typeProject === 'object' && typeProject !== null
                  ? typeProject._id
                  : typeProject
                  ? typeProject
                  : 'NULL',
              attributes: {
                name:
                  typeof typeProject === 'object' && typeProject !== null
                    ? typeProject.name
                    : typeProject
                    ? typeProject
                    : 'NULL',
              },
            },
          ] as Array<RelationshipProjectInterface>;
        })
        .flat();

      // remove dupplicate
      const includedFinal: typeof included = included.reduce((prevVal, val) => {
        if (prevVal.findIndex((prevVal2) => prevVal2.id === val.id) === -1)
          prevVal.push(val);
        return prevVal;
      }, [] as typeof included);

      const Doc: DocProjects = {
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
                    typeof result.typeProject === 'object' &&
                    result.typeProject !== null
                      ? result.typeProject._id
                      : result.typeProject
                      ? result.typeProject
                      : 'UNKNOWN',
                  type: 'typeProject',
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
    } catch (err) {
      console.log(err);
      res.json({ error: true });
    }
  }

  async postProjects(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const validReqBody = await this.validation(req.body);

    await dbConnect();
    // Simpan Ke database
    const project = new projectsSchema({
      title: validReqBody.data.attributes.title,
      startDate: validReqBody.data.attributes.startDate,
      endDate: validReqBody.data.attributes.endDate,
      images: validReqBody.data.attributes.images,
      description: validReqBody.data.attributes.description,
      url: validReqBody.data.attributes.url,
      tools: validReqBody.data.relationships.tools.data.map((tool) => tool.id),
      typeProject: validReqBody.data.relationships.typeProject.data.id,
    });

    await project.save();

    await res.unstable_revalidate('/projects');

    const typeProject = project.typeProject as TypeProjectSchemaInterface;

    const Doc: DocProject = {
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
                typeof project.typeProject === 'object' &&
                project.typeProject !== null
                  ? project.typeProject._id
                  : project.typeProject
                  ? project.typeProject
                  : 'UNKNOWN',
              type: 'typeProject',
            },
          },
        },
      },
      included: [
        ...project.tools.map((tool) => {
          const Tool = tool as ToolSchemaInterface;
          return {
            type: 'Tool' as const,
            id: Tool._id.toString(),
            attributes: {
              name: Tool.name,
              as: Tool.as,
            },
          };
        }),
        {
          type: 'TypeProject' as const,
          id: typeProject._id,
          attributes: {
            name: typeProject.name,
          },
        },
      ] as Array<RelationshipProjectInterface>,
    };

    // atur headers
    res.setHeader('Location', `/api/projects/${project._id as string}`);
    res.setHeader('content-type', 'application/vnd.api+json');

    res.statusCode = 201;
    return res.end(JSON.stringify(Doc));
  }

  async patchProject(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const { projectID } = req.query;

    // Validasi
    const validReqBody = await this.validation(req.body);

    // Jika tidak memasukan field id
    if (validReqBody.data.id === undefined)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    // Lakukan Perubahan
    await dbConnect();
    const result = await projectsSchema.findByIdAndUpdate(
      projectID,
      {
        title: validReqBody.data.attributes.title,
        startDate: validReqBody.data.attributes.startDate,
        endDate: validReqBody.data.attributes.endDate,
        images: validReqBody.data.attributes.images,
        description: validReqBody.data.attributes.description,
        url: validReqBody.data.attributes.url,
        tools: validReqBody.data.relationships.tools.data.map(
          (tool) => tool.id,
        ),
        typeProject: validReqBody.data.relationships.typeProject.data.id,
      },
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

    const Doc: DocMeta = { meta: { title: 'success update data', code: 204 } };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify(Doc));
  }

  async deleteProject(req: RequestControllerRouter, res: NextApiResponse) {
    const { projectID } = req.query;
    await dbConnect();
    const result = await projectsSchema.findByIdAndDelete(projectID);

    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

    await res.unstable_revalidate('/projects');

    const Doc: DocMeta = { meta: { title: 'success Delete', code: 204 } };
    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify(Doc));
  }

  async validation(body: { [index: string]: OObject }) {
    // Validasi
    const validReqBody = Joi.attempt(body, ProjectSchemaValidation) as {
      data: {
        id?: string;
        type: string;
        attributes: NonNullable<DocProject['data']['attributes']>;
        relationships: {
          tools: {
            data: {
              type: string;
              id: Types.ObjectId;
            }[];
          };
          typeProject: {
            data: {
              type: string;
              id: string;
            };
          };
        };
      };
    };

    // Check Apakah typeProject dengan id tertentu ada
    const relationships = validReqBody.data.relationships;
    if (
      (await typeProjectSchema.findById(relationships.typeProject.data.id, {
        _id: 1,
      })) === null
    ) {
      throw new HttpError(
        'Invalid type project id',
        404,
        'Invalid type project id',
      );
    }

    // Cek apakah tools yang dimasukan terdaftar
    for (const tool of relationships.tools.data) {
      // cek jika tool
      if ((await toolSchema.findById(tool.id)) === null) {
        throw new HttpError('Invalid tool id', 404, 'Invalid tool id');
      }
    }

    return validReqBody;
  }
}

export default new Projects();
