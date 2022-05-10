import { toolSchema, typeToolSchema } from '@src/database';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import Joi from 'joi';
import { OObject } from '@src/types/jsonApi/object';
import { NextApiResponse } from 'next';
import { DocTool, DocTools } from '@src/types/admin';

const ToolsSchemaValidation = Joi.object({
  data: Joi.object({
    type: Joi.string().max(50).required(),
    id: Joi.string().max(100),
    attributes: Joi.object({
      name: Joi.string().max(50).required(),
    }).required(),
    relationships: Joi.object({
      as: Joi.object({
        data: Joi.object({
          type: Joi.string().max(100).required(),
          id: Joi.string().max(100).required(),
        }).required(),
      }).required(),
    }).required(),
  }).required(),
}).required();

class Tools {
  async getTool(req: RequestControllerRouter, res: NextApiResponse) {
    const { toolID } = req.query;

    const result = await toolSchema.findById(toolID).populate('as').lean();

    // Jika tidak ada
    if (!result)
      throw new HttpError('Tool not found', 404, 'Tool not found in db');

    const Doc: DocTool = {
      data: {
        type: 'Tool',
        id: Array.isArray(toolID) ? toolID.join('') : toolID,
        attributes: {
          name: result.name,
        },
        relationships: {
          as: {
            data: {
              type: 'typeTool',
              id: typeof result.as === 'string' ? result.as : result.as._id,
            },
          },
        },
      },
      included: [
        {
          type: 'typeTool',
          id: typeof result.as === 'string' ? result.as : result.as._id,
          attributes: {
            name: typeof result.as === 'string' ? result.as : result.as.name,
          },
        },
      ],
    };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify(Doc));
  }

  async getTools(req: RequestControllerRouter, res: NextApiResponse) {
    const results = await toolSchema.find().populate('as').lean();

    const Docs: DocTools = {
      data: results.map((result) => ({
        type: 'Tool',
        id: result._id.toString(),
        attributes: {
          name: result.name,
        },
        relationships: {
          as: {
            data: {
              type: 'typeTool',
              id: typeof result.as === 'string' ? result.as : result.as._id,
            },
          },
        },
      })),
      included: results.reduce((prevVal, currentVal) => {
        const udahAda = prevVal.findIndex((valPrev) => {
          if (typeof currentVal.as === 'string') return true;
          return valPrev.id === currentVal.as._id;
        });

        if (udahAda !== -1) return prevVal;

        return [
          ...prevVal,
          {
            type: 'typeTool',
            id:
              typeof currentVal.as === 'string'
                ? currentVal.as
                : currentVal.as._id,
            attributes: {
              name:
                typeof currentVal.as === 'string'
                  ? currentVal.as
                  : currentVal.as.name,
            },
          },
        ];
      }, [] as NonNullable<DocTool['included']>),
    };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify(Docs));
  }

  async postTools(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const valid = await this.validation(req.body);

    const tool = new toolSchema({
      name: valid.data.attributes.name,
      as: valid.data.relationships.as.data.id,
    });
    await tool.save();

    const resTool = await tool
      .populate({
        path: 'as',
        model: 'TypeTool',
      })
      .execPopulate();

    const Doc: DocTool = {
      data: {
        type: 'Tool',
        id: resTool._id as string,
        attributes: {
          name: resTool.name,
        },
        relationships: {
          as: {
            data: {
              type: 'typeTool',
              id: typeof resTool.as === 'string' ? resTool.as : resTool.as._id,
            },
          },
        },
      },
      included: [
        {
          type: 'typeTool',
          id: typeof resTool.as === 'string' ? resTool.as : resTool.as._id,
          attributes: {
            name: typeof resTool.as === 'string' ? resTool.as : resTool.as.name,
          },
        },
      ],
    };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.setHeader('Location', `/api/tools/${tool._id as string}`);
    res.statusCode = 201;
    return res.end(JSON.stringify(Doc));
  }

  async patchTool(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const { toolID } = req.query;

    const valid = await this.validation(req.body);

    // Check karena di joi validation attribute id merupakan optional
    if (!valid.data.id)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    const result = await toolSchema
      .findByIdAndUpdate(toolID, {
        name: valid.data.attributes.name,
        as: valid.data.relationships.as.data.id,
      })
      .setOptions({
        new: true,
      });

    if (!result) throw new HttpError('tool not found', 404, 'tool not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success updated', code: 200 } }),
    );
  }

  async deleteTool(req: RequestControllerRouter, res: NextApiResponse) {
    const { toolID } = req.query;
    const result = await toolSchema.findByIdAndDelete(toolID);

    if (!result) throw new HttpError('tool not found', 404, 'tool not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify({ meta: { title: 'success deleted' } }));
  }

  async validation(body: { [index: string]: OObject }) {
    const validReqBody = Joi.attempt(body, ToolsSchemaValidation) as {
      data: {
        id?: string;
        type: string;
        attributes: NonNullable<DocTool['data']['attributes']>;
        relationships: {
          as: {
            data: {
              type: string;
              id: string;
            };
          };
        };
      };
    };

    const asRelationship = validReqBody.data.relationships.as;

    if (
      (await typeToolSchema.findById(asRelationship.data.id, {
        _id: 1,
      })) === null
    ) {
      throw new HttpError('Invalid type tool id', 404, 'Invalid type tool id');
    }

    return validReqBody;
  }
}

export default new Tools();
