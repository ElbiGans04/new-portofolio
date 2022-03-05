import { OObject } from '@src/types/jsonApi/object';
import Joi from 'joi';
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

class ToolsService {
  validation(body: { [index: string]: OObject }) {
    const validReqBody = Joi.attempt(
      body,
      ToolsSchemaValidation,
    ) as TransformToDoc<ToolSchemaInterface>;
    return validReqBody;
  }
}

export default new ToolsService();
