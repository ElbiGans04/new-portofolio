import { toolSchema } from '@src/database';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import Joi from 'joi';
import { OObject } from '@src/types/jsonApi/object';
import { TransformToDoc } from '@src/utils/typescript/transformSchemeToDoc';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';

const ToolsSchemaValidation = Joi.object({
  type: Joi.string().max(50).required(),
  id: Joi.string().max(100),
  attributes: Joi.object({
    name: Joi.string().max(50).required(),
    as: Joi.string().max(100).required(),
  }).required(),
}).required();

class Tools {
  async getTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { toolID } = req.query;

    const result = await toolSchema.findById(toolID).lean();

    // Jika tidak ada
    if (!result)
      throw new HttpError('Tool not found', 404, 'Tool not found in db');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: {
          type: 'Tool',
          id: toolID,
          attributes: {
            name: result.name,
            as: result.as,
          },
        },
      }),
    );
  }

  async getTools(req: RequestControllerRouter, res: RespondControllerRouter) {
    const results = await toolSchema.find().lean();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: results.map((result) => {
          return {
            type: 'Tool',
            id: result._id,
            attributes: {
              name: result.name,
              as: result.as,
            },
          };
        }),
      }),
    );
  }

  async postTools(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const valid = this.validation(req.body);

    const tool = new toolSchema(valid.attributes);
    await tool.save();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.setHeader('Location', `/api/tools/${tool._id as string}`);
    res.statusCode = 201;
    return res.end(
      JSON.stringify({
        meta: { title: 'tool has created' },
        data: {
          type: 'tool',
          id: tool._id as string,
          attibutes: {
            name: tool.name,
            as: tool.as,
          },
        },
      }),
    );
  }

  async patchTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const { toolID } = req.query;

    const valid = this.validation(req.body);

    // Check karena di joi validation attribute id merupakan optional
    if (!valid.id)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    const result = await toolSchema
      .findByIdAndUpdate(toolID, valid.attributes)
      .setOptions({
        new: true,
      });

    if (!result) throw new HttpError('tool not found', 404, 'tool not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success updated', code: 204 } }),
    );
  }

  async deleteTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { toolID } = req.query;
    const result = await toolSchema.findByIdAndDelete(toolID);

    if (!result) throw new HttpError('tool not found', 404, 'tool not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify({ meta: { title: 'success deleted' } }));
  }

  validation(body: { [index: string]: OObject }) {
    const validReqBody = Joi.attempt(
      body,
      ToolsSchemaValidation,
    ) as TransformToDoc<ToolSchemaInterface>;
    return validReqBody;
  }
}

export default new Tools();
