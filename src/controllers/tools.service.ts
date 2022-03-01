import { OObject } from '@src/types/jsonApi/object';
import Joi from 'joi';
import ToolsSchemaValidation from '@src/validation/tools';
import { TransformToDoc } from '@src/utils/typescript/transformSchemeToDoc';
import ToolSchemaInterface from '@src/types/mongoose/schemas/tool';

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
