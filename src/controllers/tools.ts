import { toolSchema } from '@src/database';
import { formidableHandler } from '@src/middleware/formidable';
import runMiddleware from '@src/middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@src/types/controllersRoutersApi';
import formatResource from '@src/utils/formatResource';
import toolsService from './tools.service';

class Tools {
  async getTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { toolID } = req.query;

    const result = await toolSchema.findById(toolID);

    // Jika tidak ada
    if (!result)
      throw new HttpError('Tool not found', 404, 'Tool not found in db');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(result, toolSchema.modelName),
        code: 200,
      }),
    );
  }

  async getTools(req: RequestControllerRouter, res: RespondControllerRouter) {
    const results = await toolSchema.find();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ data: formatResource(results, toolSchema.modelName) }),
    );
  }

  async postTools(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const valid = toolsService.validation(req.body);

    const tool = new toolSchema(valid.attributes);
    await tool.save();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 201;
    return res.end(
      JSON.stringify({
        meta: { title: 'tool has created' },
        data: formatResource(tool, toolSchema.modelName),
      }),
    );
  }

  async patchTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);

    const { toolID } = req.query;

    const valid = toolsService.validation(req.body);

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
      JSON.stringify({ meta: { title: 'success updated', code: 200 } }),
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
}

export default new Tools();
