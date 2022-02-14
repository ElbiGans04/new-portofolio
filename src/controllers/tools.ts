import ToolsSchema from '@database/schemas/tools';
import { formidableHandler } from '@middleware/formidable';
import runMiddleware from '@middleware/runMiddleware';
import formatResource from '@utils/formatResource';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import ToolValidationSchema from '@validation/tools';
import joi from 'joi';
import type {
  TransformToDocClient,
  TransformToDocServer,
} from '@utils/typescript/transformSchemeToDoc';
import ToolInterface from '@src/types/mongoose/schemas/tool';

class Tools {
  async getTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { toolID } = req.query;
    const result = await ToolsSchema.findById(toolID);

    // Jika tidak ada
    if (!result) throw { code: 404, title: 'tool not found' };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(result, ToolsSchema.modelName),
        code: 200,
      }),
    );
  }

  async getTools(req: RequestControllerRouter, res: RespondControllerRouter) {
    const results = await ToolsSchema.find();
    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ data: formatResource(results, ToolsSchema.modelName) }),
    );
  }

  async postTools(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);
    const valid = joi.attempt(
      req.body,
      ToolValidationSchema,
    ) as TransformToDocClient<ToolInterface>;

    const tool = new ToolsSchema(valid.attributes);
    await tool.save();

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 201;
    return res.end(
      JSON.stringify({
        meta: { title: 'tool has created' },
        data: formatResource(tool, ToolsSchema.modelName),
      }),
    );
  }

  async patchTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    await runMiddleware(req, res, formidableHandler);
    const { toolID } = req.query;
    const valid = joi.attempt(
      req.body,
      ToolValidationSchema,
    ) as TransformToDocServer<ToolInterface>;

    // Check karena di joi validation attribute id merupakan optional
    if (!valid.id)
      throw { title: 'missing id property in request document', code: 404 };

    const result = await ToolsSchema.findByIdAndUpdate(
      toolID,
      valid.attributes,
    ).setOptions({
      new: true,
    });

    if (!result) throw { title: 'tool not found', code: 404 };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success updated', code: 200 } }),
    );
  }

  async deleteTool(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { toolID } = req.query;
    const result = await ToolsSchema.findByIdAndDelete(toolID);

    if (!result) throw { title: 'tool not found', code: 404 };

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(JSON.stringify({ meta: { title: 'success deleted' } }));
  }
}

export default new Tools();
