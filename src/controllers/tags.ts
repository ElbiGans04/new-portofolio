import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import { NextApiResponse } from 'next';
import { tagSchema } from '@src/database';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import Joi from 'joi';
import { OObject } from '@src/types/jsonApi/object';
import dbConnect from '@src/database/connection';

const TagsSchemaValidation = Joi.object({
  data: Joi.object({
    type: Joi.string().max(50).required(),
    id: Joi.string().max(100),
    attributes: Joi.object({
      name: Joi.string().max(50).required(),
    }).required(),
  }).required(),
}).required();

class tags {
  async getTag(req: RequestControllerRouter, res: NextApiResponse) {
    const { tagID } = req.query;

    await dbConnect();
    const result = await tagSchema.findById(tagID).lean();

    // Jika tidak ada
    if (!result)
      throw new HttpError('Tag not found', 404, 'Tag not found in db');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: {
          type: 'Tag',
          id: tagID,
          attributes: {
            name: result.name,
          },
        },
      }),
    );
  }
  async getTags(req: RequestControllerRouter, res: NextApiResponse) {
    await dbConnect();
    const results = await tagSchema.find().lean();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: results.map((result) => {
          return {
            type: 'Tag',
            id: result._id,
            attributes: {
              name: result.name,
            },
          };
        }),
      }),
    );
  }

  async postTags(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const valid = this.validation(req.body);
    await dbConnect();
    const tag = new tagSchema(valid.data.attributes);
    await tag.save();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.setHeader('Location', `/api/tags/${tag._id as string}`);
    res.statusCode = 201;
    return res.end(
      JSON.stringify({
        meta: { title: 'Tag has created' },
        data: {
          type: 'Tag',
          id: tag._id as string,
          attibutes: {
            name: tag.name,
          },
        },
      }),
    );
  }
  async patchTag(req: RequestControllerRouter, res: NextApiResponse) {
    await runMiddleware(req, res, formidableHandler);

    const { tagID } = req.query;

    const valid = this.validation(req.body);

    // Check karena di joi validation attribute id merupakan optional
    if (!valid.data.id)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    await dbConnect();

    const result = await tagSchema
      .findByIdAndUpdate(tagID, valid.data.attributes)
      .setOptions({
        new: true,
      });

    if (!result) throw new HttpError('tag not found', 404, 'tag not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success updated', code: 204 } }),
    );
  }
  async deleteTag(req: RequestControllerRouter, res: NextApiResponse) {
    const { tagID } = req.query;
    await dbConnect();
    const result = await tagSchema.findByIdAndDelete(tagID);

    if (!result) throw new HttpError('Tag not found', 404, 'Tag not found');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify({ meta: { title: 'success deleted' } }));
  }

  validation(body: { [index: string]: OObject }) {
    const validReqBody = Joi.attempt(body, TagsSchemaValidation) as {
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

export default new tags();
