import joi from 'joi';
import projectController from '@src/controllers/projects';
import {
  projectsSchema,
  toolSchema,
  typeProjectSchema,
} from '@src/database/index';
import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import { NextApiResponse } from 'next';
import runMiddleware from '@src/middleware/runMiddleware';
import { Types } from 'mongoose';

jest.mock('joi', () => {
  const originalModule = jest.requireActual('joi');
  return {
    __esModule: true,
    default: {
      ...originalModule,
      attempt: jest.fn().mockReturnValue({
        data: {
          id: '1',
          type: 'Project',
          attributes: {
            title: 'judul',
            url: 'judul.com',
            startDate: 'AWAL',
            endDate: 'AKHIR',
            description: 'DESCRIPTION',
            images: [
              {
                _id: '1' as any as Types.ObjectId,
                ref: 'REF',
                src: 'SRC',
              },
            ],
          },
          relationships: {
            typeProject: {
              data: {
                type: 'typeProject',
                id: 'A1',
              },
            },
            tools: {
              data: [
                {
                  type: 'tool',
                  id: 'TOOL-ID' as any as Types.ObjectId,
                },
              ],
            },
          },
        },
      }),
    },
  };
});

jest.mock('@src/database/index', () => {
  const projectSchema = jest.fn().mockReturnValue({
    save: jest.fn().mockResolvedValue(undefined),
    _id: 'ID',
    title: 'TEST',
    startDate: 'DATE',
    endDate: 'DATE',
    descriptions: 'DESCRIPTION',
    url: 'URL',
    images: [
      {
        _id: 'ID',
        src: 'SRC',
        href: 'HREF',
      },
    ],
    typeProject: {
      name: 'A1',
      _id: 'ID',
    },
    tools: [
      {
        name: 'A1',
        as: 'AS',
        _id: 'ID',
      },
    ],
  });
  projectSchema.findById = jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue({
      _id: 'ID',
      title: 'TEST',
      startDate: 'DATE',
      endDate: 'DATE',
      descriptions: 'DESCRIPTION',
      url: 'URL',
      images: [
        {
          _id: 'ID',
          src: 'SRC',
          href: 'HREF',
        },
      ],
      typeProject: {
        name: 'A1',
        _id: 'ID',
      },
      tools: [
        {
          name: 'A1',
          as: 'AS',
          _id: 'ID',
        },
      ],
    }),
  });

  projectSchema.find = jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([
      {
        _id: 'ID',
        title: 'TEST',
        startDate: 'DATE',
        endDate: 'DATE',
        descriptions: 'DESCRIPTION',
        url: 'URL',
        images: [
          {
            _id: 'ID',
            src: 'SRC',
            href: 'HREF',
          },
        ],
        typeProject: {
          name: 'A1',
          _id: 'ID',
        },
        tools: [
          {
            name: 'A1',
            as: 'AS',
            _id: 'ID',
          },
        ],
      },
    ]),
  });

  projectSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(true);
  projectSchema.findByIdAndDelete = jest.fn().mockResolvedValue(true);

  return {
    __esModule: true,
    projectsSchema: projectSchema,
    toolSchema: {
      findById: jest.fn().mockResolvedValue(true),
    },
    typeProjectSchema: {
      findById: jest.fn().mockResolvedValue(true),
    },
  };
});

jest.mock('@src/middleware/runMiddleware', () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue(undefined),
  };
});

const validation = jest
  .spyOn(projectController, 'validation')
  .mockResolvedValue({
    data: {
      id: '1',
      type: 'Project',
      attributes: {
        title: 'judul',
        url: 'judul.com',
        startDate: 'AWAL',
        endDate: 'AKHIR',
        description: 'DESCRIPTION',
        images: [
          {
            _id: '1' as any as Types.ObjectId,
            ref: 'REF',
            src: 'SRC',
          },
        ],
      },
      relationships: {
        typeProject: {
          data: {
            type: 'typeProject',
            id: 'A1',
          },
        },
        tools: {
          data: [
            {
              type: 'tool',
              id: 'TOOL-ID' as any as Types.ObjectId,
            },
          ],
        },
      },
    },
  });

const req = {
  query: {
    projectID: 1,
  },
} as any as RequestControllerRouter;

const res = {
  setHeader: jest.fn(),
  end: jest.fn(),
  unstable_revalidate: jest.fn(),
};

afterEach(() => {
  res.setHeader.mockClear();
  res.end.mockClear();
  res.unstable_revalidate.mockClear();
});

describe('GET', () => {
  const projectFindByIdMock = projectsSchema.findById as any as jest.Mock;

  afterEach(() => {
    const populate = projectFindByIdMock.mock.results[0].value
      .populate as jest.Mock;
    const lean = projectFindByIdMock.mock.results[0].value.lean as jest.Mock;
    populate.mockClear();
    lean.mockClear();
  });

  test('projectFindByIdMock Dipanggil satu kali', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(projectFindByIdMock.mock.calls.length).toBe(1);
  });

  test('projectFindByIdMock Dipanggil satu kali dengan 2 argument', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(projectFindByIdMock.mock.calls[0].length).toBe(2);
  });

  test('projectFindByIdMock Dipanggil satu kali dengan argument pertama berupa', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(projectFindByIdMock.mock.calls[0][0]).toBe(1);
  });

  test('projectFindByIdMock Dipanggil satu kali dengan argument kedua berupa', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(projectFindByIdMock.mock.calls[0][1]).toEqual({ __v: 0 });
  });

  test('projectFindByIdMock.populate Dipanggil dua kali', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const populate = projectFindByIdMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls.length).toBe(2);
  });

  test('saat projectFindByIdMock.populate pertama kali dipanggil dengan 1 argument', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const populate = projectFindByIdMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[0].length).toBe(1);
  });

  test('saat projectFindByIdMock.populate kedua kali dipanggil dengan 1 argument', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const populate = projectFindByIdMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[1].length).toBe(1);
  });

  test('saat projectFindByIdMock.populate pertama kali dipanggil dengan argument pertama berupa', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const populate = projectFindByIdMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[0][0]).toBe('typeProject');
  });

  test('saat projectFindByIdMock.populate kedua kali dipanggil dengan argument pertama berupa', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const populate = projectFindByIdMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[1][0]).toBe('tools');
  });

  test('projectFindByIdMock.lean Dipanggil satu kali', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const lean = projectFindByIdMock.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls.length).toBe(1);
  });

  test('projectFindByIdMock.lean Dipanggil satu kali dengan 0 argument', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    const lean = projectFindByIdMock.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.getProject(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"data\":{\"type\":\"Project\",\"id\":\"ID\",\"attributes\":{\"title\":\"TEST\",\"startDate\":\"DATE\",\"endDate\":\"DATE\",\"images\":[{\"_id\":\"ID\",\"src\":\"SRC\",\"href\":\"HREF\"}],\"url\":\"URL\"},\"relationships\":{\"tools\":{\"data\":[{\"type\":\"tool\",\"id\":\"ID\"}]},\"typeProject\":{\"data\":{\"id\":\"ID\",\"type\":\"typeProject\"}}}},\"included\":[{\"type\":\"tool\",\"id\":\"ID\",\"attributes\":{\"name\":\"A1\",\"as\":\"AS\"}},{\"type\":\"typeProject\",\"id\":\"ID\",\"attributes\":{\"name\":\"A1\"}}]}`,
    );
  });
});

describe('GETS', () => {
  const projectFindMock = projectsSchema.find as any as jest.Mock;

  afterEach(() => {
    const populate = projectFindMock.mock.results[0].value
      .populate as jest.Mock;
    const lean = projectFindMock.mock.results[0].value.lean as jest.Mock;
    const sort = projectFindMock.mock.results[0].value.sort as jest.Mock;
    sort.mockClear();
    populate.mockClear();
    lean.mockClear();
  });

  test('projectFindMock Dipanggil satu kali', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(projectFindMock.mock.calls.length).toBe(1);
  });

  test('projectFindMock Dipanggil satu kali dengan 2 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(projectFindMock.mock.calls[0].length).toBe(2);
  });

  test('projectFindMock Dipanggil satu kali dengan argument pertama berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(projectFindMock.mock.calls[0][0]).toEqual({});
  });

  test('projectFindMock Dipanggil satu kali dengan argument kedua berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(projectFindMock.mock.calls[0][1]).toEqual({ __v: 0 });
  });

  test('projectFindMock.populate Dipanggil dua kali', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const populate = projectFindMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls.length).toBe(2);
  });

  test('saat projectFindMock.populate pertama kali dipanggil dengan 1 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const populate = projectFindMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[0].length).toBe(1);
  });

  test('saat projectFindMock.populate kedua kali dipanggil dengan 1 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const populate = projectFindMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[1].length).toBe(1);
  });

  test('saat projectFindMock.populate pertama kali dipanggil dengan argument pertama berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const populate = projectFindMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[0][0]).toBe('typeProject');
  });

  test('saat projectFindMock.populate kedua kali dipanggil dengan argument pertama berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const populate = projectFindMock.mock.results[0].value
      .populate as jest.Mock;
    expect(populate.mock.calls[1][0]).toBe('tools');
  });

  test('projectFindMock.sort Dipanggil satu kali', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const sort = projectFindMock.mock.results[0].value.sort as jest.Mock;
    expect(sort.mock.calls.length).toBe(1);
  });

  test('projectFindMock.sort Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const sort = projectFindMock.mock.results[0].value.sort as jest.Mock;
    expect(sort.mock.calls[0].length).toBe(1);
  });

  test('saat projectFindMock.sort kedua kali dipanggil dengan argument pertama berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const sort = projectFindMock.mock.results[0].value.sort as jest.Mock;
    expect(sort.mock.calls[0][0]).toEqual({ title: 1 });
  });

  test('projectFindMock.lean Dipanggil satu kali', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const lean = projectFindMock.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls.length).toBe(1);
  });

  test('projectFindMock.lean Dipanggil satu kali dengan 0 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    const lean = projectFindMock.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.getProjects(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toEqual(
      `{\"data\":[{\"type\":\"Project\",\"id\":\"ID\",\"attributes\":{\"title\":\"TEST\",\"startDate\":\"DATE\",\"endDate\":\"DATE\",\"images\":[{\"_id\":\"ID\",\"src\":\"SRC\",\"href\":\"HREF\"}],\"url\":\"URL\"},\"relationships\":{\"tools\":{\"data\":[{\"type\":\"tool\",\"id\":\"ID\"}]},\"typeProject\":{\"data\":{\"id\":\"ID\",\"type\":\"typeProject\"}}}}],\"included\":[{\"type\":\"tool\",\"id\":\"ID\",\"attributes\":{\"name\":\"A1\",\"as\":\"AS\"}}]}`,
    );
  });
});

describe('POST', () => {
  const runMiddlewareMock = runMiddleware as any as jest.Mock;
  const projectsSchemaMock = projectsSchema as any as jest.Mock;

  beforeEach(() => {
    runMiddlewareMock.mockClear();
  });

  afterEach(() => {
    const save = projectsSchemaMock.mock.results[0].value.save as jest.Mock;
    projectsSchemaMock.mockClear();
    save.mockClear();
    validation.mockClear();
  });

  test('memanggil runMiddleware sebanyak 1 kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0][0]).toEqual(req);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0][1]).toEqual(res);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('memanggil validation sebanyak 1 kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(validation.mock.calls.length).toBe(1);
  });

  test('memanggil validation sebanyak 1 kali dengan 1 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(validation.mock.calls[0].length).toBe(1);
  });

  test('memanggil projectSchema sebanyak 1 kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectsSchemaMock.mock.calls.length).toBe(1);
  });

  test('memanggil projectSchema dengan 1 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectsSchemaMock.mock.calls[0].length).toBe(1);
  });

  test('memanggil projectSchema dengan argument pertama berupa', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectsSchemaMock.mock.calls[0][0]).toEqual({
      title: 'judul',
      url: 'judul.com',
      startDate: 'AWAL',
      endDate: 'AKHIR',
      description: 'DESCRIPTION',
      images: [
        {
          _id: '1',
          ref: 'REF',
          src: 'SRC',
        },
      ],
      typeProject: 'A1',
      tools: ['TOOL-ID'],
    });
  });

  test('memanggil save sebanyak 1 kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    const save = projectsSchemaMock.mock.results[0].value.save as jest.Mock;
    expect(save.mock.calls.length).toBe(1);
  });

  test('memanggil save dengan 0 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    const save = projectsSchemaMock.mock.results[0].value.save as jest.Mock;
    expect(save.mock.calls[0].length).toBe(0);
  });

  test('unstable_revalidate Dipanggil satu kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls.length).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls[0].length).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls[0][0]).toBe(`/projects`);
  });

  test('setHeader Dipanggil dua kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls.length).toBe(2);
  });

  test('setHeader Dipanggil pertama kali dengan 2 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil kedua kali dengan 2 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[1].length).toBe(2);
  });

  test('setHeader Dipanggil pertama kali dengan argument pertama berupa', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0][0]).toBe('Location');
  });

  test('setHeader Dipanggil pertama kali dengan argument kedua berupa', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0][1]).toBe('/api/projects/ID');
  });

  test('setHeader Dipanggil kedua kali dengan argument pertama berupa', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[1][0]).toBe('content-type');
  });

  test('setHeader Dipanggil kedua kali dengan argument kedua berupa', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[1][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.postProjects(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls[0][0]).toEqual(
      `{\"meta\":{\"code\":201,\"title\":\"The project has created\"},\"data\":{\"type\":\"Project\",\"id\":\"ID\",\"attributes\":{\"title\":\"TEST\",\"startDate\":\"DATE\",\"endDate\":\"DATE\",\"images\":[{\"_id\":\"ID\",\"src\":\"SRC\",\"href\":\"HREF\"}],\"url\":\"URL\"},\"relationships\":{\"tools\":{\"data\":[{\"type\":\"tool\",\"id\":\"ID\"}]},\"typeProject\":{\"data\":{\"id\":\"ID\",\"type\":\"typeProject\"}}}},\"included\":[{\"type\":\"tool\",\"id\":\"ID\",\"attributes\":{\"name\":\"A1\",\"as\":\"AS\"}},{\"type\":\"typeProject\",\"id\":\"ID\",\"attributes\":{\"name\":\"A1\"}}]}`,
    );
  });
});

describe('PATCH', () => {
  const runMiddlewareMock = runMiddleware as any as jest.Mock;
  const projectFindByIdAndUpdateMock =
    projectsSchema.findByIdAndUpdate as any as jest.Mock;

  beforeEach(() => {
    runMiddlewareMock.mockClear();
  });

  afterEach(() => {
    projectFindByIdAndUpdateMock.mockClear();
    validation.mockClear();
  });

  test('memanggil runMiddleware sebanyak 1 kali', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0][0]).toEqual(req);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0][1]).toEqual(res);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('memanggil validation sebanyak 1 kali', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(validation.mock.calls.length).toBe(1);
  });

  test('memanggil validation sebanyak 1 kali dengan 1 argument', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(validation.mock.calls[0].length).toBe(1);
  });

  test('projectFindByIdAndUpdateMock Dipanggil satu kali', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndUpdateMock.mock.calls.length).toBe(1);
  });

  test('projectFindByIdAndUpdateMock Dipanggil satu kali dengan 3 argument', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndUpdateMock.mock.calls[0].length).toBe(3);
  });

  test('projectFindByIdAndUpdateMock Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndUpdateMock.mock.calls[0][0]).toBe(1);
  });

  test('projectFindByIdAndUpdateMock Dipanggil satu kali dengan argument kedua bernilai', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndUpdateMock.mock.calls[0][1]).toEqual({
      title: 'judul',
      url: 'judul.com',
      startDate: 'AWAL',
      endDate: 'AKHIR',
      description: 'DESCRIPTION',
      images: [
        {
          _id: '1',
          ref: 'REF',
          src: 'SRC',
        },
      ],
      typeProject: 'A1',
      tools: ['TOOL-ID'],
    });
  });

  test('projectFindByIdAndUpdateMock Dipanggil satu kali dengan argument ketiga bernilai', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndUpdateMock.mock.calls[0][2]).toEqual({
      new: true,
    });
  });

  test('unstable_revalidate Dipanggil satu kali', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls.length).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls[0].length).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls[0][0]).toBe(`/projects`);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.patchProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"meta\":{\"title\":\"success update data\",\"code\":204}}`,
    );
  });
});

describe('DELETE', () => {
  const projectFindByIdAndDeleteMock =
    projectsSchema.findByIdAndDelete as any as jest.Mock;

  afterEach(() => {
    projectFindByIdAndDeleteMock.mockClear();
  });

  test('projectFindByIdAndDeleteMock Dipanggil satu kali', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndDeleteMock.mock.calls.length).toBe(1);
  });

  test('projectFindByIdAndDeleteMock Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndDeleteMock.mock.calls[0].length).toBe(1);
  });

  test('projectFindByIdAndDeleteMock Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(projectFindByIdAndDeleteMock.mock.calls[0][0]).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls.length).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls[0].length).toBe(1);
  });

  test('unstable_revalidate Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.unstable_revalidate.mock.calls[0][0]).toBe(`/projects`);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await projectController.deleteProject(
      req,
      res as unknown as NextApiResponse,
    );
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"meta\":{\"title\":\"success Delete\",\"code\":204}}`,
    );
  });
});

describe('VALIDATION', () => {
  beforeAll(() => {
    validation.mockRestore();
  });
  const attemp = joi.attempt as jest.Mock;
  const toolfindByIdMock = toolSchema.findById as jest.Mock;
  const typeProjectfindByIdMock = typeProjectSchema.findById as jest.Mock;

  beforeEach(() => {
    attemp.mockClear();
    toolfindByIdMock.mockClear();
    typeProjectfindByIdMock.mockClear();
  });

  test('validation mengembalikan object', async () => {
    expect(await projectController.validation({})).toEqual({
      data: {
        id: '1',
        type: 'Project',
        attributes: {
          title: 'judul',
          url: 'judul.com',
          startDate: 'AWAL',
          endDate: 'AKHIR',
          description: 'DESCRIPTION',
          images: [
            {
              _id: '1',
              ref: 'REF',
              src: 'SRC',
            },
          ],
        },
        relationships: {
          typeProject: {
            data: {
              type: 'typeProject',
              id: 'A1',
            },
          },
          tools: {
            data: [
              {
                type: 'tool',
                id: 'TOOL-ID',
              },
            ],
          },
        },
      },
    });
  });

  test('joi.attempt dipanggil 1 kali', async () => {
    await projectController.validation({});
    expect(attemp.mock.calls.length).toBe(1);
  });

  test('joi.attempt dipanggil dengan 2 argument', async () => {
    await projectController.validation({});
    expect(attemp.mock.calls[0].length).toBe(2);
  });

  test('joi.attempt dipanggil dengan argument pertama berupa object', async () => {
    await projectController.validation({});
    expect(attemp.mock.calls[0][0]).toEqual({});
  });

  test('joi.attempt dipanggil dengan argument kedua berupa object', async () => {
    await projectController.validation({});
    expect(attemp.mock.calls[0][1]).toBeInstanceOf(Object);
  });

  test('toolfindByIdMock dipanggil 1 kali', async () => {
    await projectController.validation({});
    expect(toolfindByIdMock.mock.calls.length).toBe(1);
  });

  test('toolfindByIdMock dipanggil dengan 1 argument', async () => {
    await projectController.validation({});
    expect(toolfindByIdMock.mock.calls[0].length).toBe(1);
  });

  test('toolfindByIdMock dipanggil dengan argument pertama bernilai TOOL-ID', async () => {
    await projectController.validation({});
    expect(toolfindByIdMock.mock.calls[0][0]).toBe('TOOL-ID');
  });

  test('typeProjectfindByIdMock dipanggil 1 kali', async () => {
    await projectController.validation({});
    expect(typeProjectfindByIdMock.mock.calls.length).toBe(1);
  });

  test('typeProjectfindByIdMock dipanggil dengan 2 argument', async () => {
    await projectController.validation({});
    expect(typeProjectfindByIdMock.mock.calls[0].length).toBe(2);
  });

  test('typeProjectfindByIdMock dipanggil dengan argument pertama bernilai A1', async () => {
    await projectController.validation({});
    expect(typeProjectfindByIdMock.mock.calls[0][0]).toBe('A1');
  });

  test('typeProjectfindByIdMock dipanggil dengan argument kedua bernilai object', async () => {
    await projectController.validation({});
    expect(typeProjectfindByIdMock.mock.calls[0][1]).toEqual({
      _id: 1,
    });
  });
});
