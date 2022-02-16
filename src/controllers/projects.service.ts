import toolsSchema from '@src/database/schemas/tools';
import typeProjectSchema from '@src/database/schemas/typeProject';
import HttpError from '@src/modules/httpError';
import { OObject } from '@src/types/jsonApi/object';
import ProjectSchemaInterface from '@src/types/mongoose/schemas/project';
import { TransformToDocClient } from '@src/utils/typescript/transformSchemeToDoc';
import ProjectValidationSchema from '@validation/projects';
import fs from 'fs';
import fsPromise from 'fs/promises';
import Joi from 'joi';
import { Types } from 'mongoose';
import path from 'path';

const pathTmp = path.resolve(process.cwd(), 'public/images/tmp');
const pathImage = path.resolve(process.cwd(), 'public/images/');

class ProjectService {
  async deleteTempFiles() {
    const listOfFiles = await fsPromise.readdir(pathTmp);

    // Hapus semua
    for (const fileName of listOfFiles) {
      const pathFile = path.resolve(pathTmp, fileName);
      await fsPromise.unlink(pathFile);
    }
  }

  async moveImages<T extends { src: string }[]>(images: T): Promise<void> {
    // Pindahkan gambar dari tmp ke luar
    for (const image of images) {
      if (fs.existsSync(`${pathTmp}/${image.src}`)) {
        // Check If found
        await fsPromise.rename(
          `${pathTmp}/${image.src}`,
          `${pathImage}/${image.src}`,
        );
      }
    }
  }

  async deleteImages<T extends { src: string }[]>(images: T): Promise<void> {
    for (const image of images) {
      const imageUrl = `${pathImage}/${image.src}`;
      if (fs.existsSync(imageUrl)) await fsPromise.unlink(imageUrl);
    }
  }

  async validation(body: { [index: string]: OObject }) {
    // Validasi
    const validReqBody = Joi.attempt(
      body,
      ProjectValidationSchema,
    ) as TransformToDocClient<ProjectSchemaInterface>;

    // Jika hanya mengirim satu data tools
    if (!Array.isArray(validReqBody.attributes.tools)) {
      const tools = validReqBody.attributes.tools as Types.ObjectId;
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
      if ((await toolsSchema.findById(tool)) === null) {
        throw new HttpError('Invalid tool id', 404, 'Invalid tool id');
      }
    }

    return validReqBody;
  }
}

export default new ProjectService();
