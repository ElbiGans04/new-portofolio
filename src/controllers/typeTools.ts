import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import { NextApiResponse } from 'next';
import { typeToolSchema } from '@src/database';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import Joi from 'joi';
import { OObject } from '@src/types/jsonApi/object';
import dbConnect from '@src/database/connection';

const TypeToolSchemaValidation = Joi.object({
  data: Joi.object({
    type: Joi.string().max(50).required(),
    id: Joi.string().max(100),
    attributes: Joi.object({
      name: Joi.string().max(50).required(),
    }).required(),
  }).required(),
}).required();

class typeTools {
  async getTypeTool(req: RequestControllerRouter, res: NextApiResponse) {
    const { typeID } = req.query;
    await dbConnect();
    const result = await typeToolSchema.findById(typeID).lean();

    // Jika tidak ada
    if (!result)
      throw new HttpError(
        'TypeTool not found',
        404,
        'TypeTool not found in db',
      );

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: {
          type: 'TypeTool',
          id: typeID,
          attributes: {
            name: result.name,
          },
        },
      }),
    );
  }
  async getTypeTools(req: RequestControllerRouter, res: NextApiResponse) {
    await dbConnect();
    const results = await typeToolSchema.find().lean();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: results.map((result) => {
          return {
            type: 'TypeTool',
            id: result._id,
            attributes: {
              name: result.name,
            },
          };
        }),
      }),
    );
  }

  async postTypeTools(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const valid = this.validation(req.body);
    await dbConnect();
    const TypeTool = new typeToolSchema(valid.data.attributes);
    await TypeTool.save();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.setHeader('Location', `/api/TypeTools/${TypeTool._id as string}`);
    res.statusCode = 201;
    return res.end(
      JSON.stringify({
        meta: { title: 'TypeTool has created' },
        data: {
          type: 'TypeTool',
          id: TypeTool._id as string,
          attibutes: {
            name: TypeTool.name,
          },
        },
      }),
    );
  }
  async patchTypeTool(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const { typeID } = req.query;

    const valid = this.validation(req.body);

    // Check karena di joi validation attribute id merupakan optional
    if (!valid.data.id)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );
    await dbConnect();
    const result = await typeToolSchema
      .findByIdAndUpdate(typeID, valid.data.attributes)
      .setOptions({
        new: true,
      });

    if (!result)
      throw new HttpError('TypeTool not found', 404, 'TypeTool not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success updated', code: 204 } }),
    );
  }
  async deleteTypeTool(req: RequestControllerRouter, res: NextApiResponse) {
    const { typeID } = req.query;
    await dbConnect();
    const result = await typeToolSchema.findByIdAndDelete(typeID);

    if (!result)
      throw new HttpError('TypeTool not found', 404, 'TypeTool not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify({ meta: { title: 'success deleted' } }));
  }

  validation(body: { [index: string]: OObject }) {
    const validReqBody = Joi.attempt(body, TypeToolSchemaValidation) as {
      data: {
        type: string;
        id?: string;
        attributes: {
          name: string;
        };
      };
    };
    return validReqBody;
  }
}

export default new typeTools();
