import { projectsSchema } from '@database/index';
import { formidableHandler } from '@middleware/formidable';
import runMiddleware from '@middleware/runMiddleware';
import HttpError from '@src/utils/httpError';
import {
  RequestControllerRouter,
  RespondControllerRouter,
} from '@typess/controllersRoutersApi';
import formatResource from '@utils/formatResource';
import ProjectService from './projects.service';

class Projects {
  async getProject(req: RequestControllerRouter, res: RespondControllerRouter) {
    const { projectID } = req.query as { projectID: string };

    const result = await projectsSchema
      .findById(projectID)
      .populate('tools')
      .populate('typeProject');

    // jika ga ada
    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(result, projectsSchema.modelName),
        code: 200,
      }),
    );
  }

  async getProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    const results = await projectsSchema
      .find()
      .sort({ title: 1 })
      .populate('typeProject')
      .populate('tools');

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: formatResource(results, projectsSchema.modelName),
        code: 200,
      }),
    );
  }

  async postProjects(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    await runMiddleware(req, res, formidableHandler);

    const validReqBody = await ProjectService.validation(req.body);

    // Simpan Ke database
    const project = new projectsSchema(validReqBody.attributes);

    await project.save();

    // Pindahkan Gambar
    const { images } = validReqBody.attributes;
    await ProjectService.moveImages(images);

    // atur headers
    res.setHeader('Location', `/api/projects/${project._id as string}`);
    res.setHeader('content-type', 'application/vnd.api+json');

    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        meta: { code: 200, title: 'The project has created' },
        // data: formatResource(project, Project.modelName),
      }),
    );
  }

  async patchProject(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    await runMiddleware(req, res, formidableHandler);

    const { projectID } = req.query;

    // Validasi
    const validReqBody = await ProjectService.validation(req.body);

    // Jika tidak memasukan field id
    if (validReqBody.id === undefined)
      throw new HttpError(
        'missing id in req.body',
        404,
        'missing id in req.body',
      );

    // Ambil Daftar gambar lama
    const result2Old = await projectsSchema.findById(projectID, { images: 1 });

    // Lakukan Perubahan
    const result = await projectsSchema.findByIdAndUpdate(
      projectID,
      validReqBody.attributes,
      {
        new: true,
      },
    );

    // Jika ga ada
    if (!result2Old || !result) {
      throw new HttpError(
        'project with that id not found',
        404,
        'project with that id not found',
      );
    }

    // Hapus gambar lama
    const { images } = validReqBody.attributes;

    // Check apakah gambar yang dikirim sama dengan gambar lama
    images.map(async (image) => {
      // Check jika gambar dalam req.body sudah lebih dulu tersimpan didatabase
      const exist = result2Old.images.find((imageOld) => {
        return imageOld.src === image.src;
      });

      // Jika Belum tersimpan maka hapus gambar lama dan pindahkan gambar baru
      if (exist === undefined) {
        await ProjectService.deleteImages(result2Old.images);
        await ProjectService.moveImages([image]);
      }
    });

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success update data', code: 200 } }),
    );
  }

  async deleteProject(
    req: RequestControllerRouter,
    res: RespondControllerRouter,
  ) {
    const { projectID } = req.query;
    const result = await projectsSchema.findByIdAndDelete(projectID);

    if (!result)
      throw new HttpError('Project not found', 404, 'Project not found in db');

    // Hapus imagenya juga
    await ProjectService.deleteImages(result.images);

    res.setHeader('content-type', 'application/vnd.api+json');
    res.statusCode = 200;
    return res.end(
      JSON.stringify({ meta: { title: 'success deleted', code: 200 } }),
    );
  }
}

export default new Projects();
