import { toolSchema, typeProjectSchema } from '@src/database/index';
import { OObject } from '@src/types/jsonApi/object';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import HttpError from '@src/utils/httpError';
import { TransformToDoc } from '@src/utils/typescript/transformSchemeToDoc';
import ProjectSchemaValidation from '@src/validation/projects';
import Joi from 'joi';
import { Types } from 'mongoose';

class ProjectService {
  async validation(body: { [index: string]: OObject }) {
    // Validasi
    const validReqBody = Joi.attempt(
      body,
      ProjectSchemaValidation,
    ) as TransformToDoc<ProjectSchemaInterface>;

    // Jika hanya mengirim satu data tools
    if (!Array.isArray(validReqBody.attributes.tools)) {
      const tools = validReqBody.attributes.tools;
      validReqBody.attributes.tools = [tools] as Types.Array<Types.ObjectId>;
    }

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

export default new ProjectService();
