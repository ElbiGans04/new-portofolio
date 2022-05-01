import tagController from '@src/controllers/tags';
import { tagSchema } from '@src/database';
import { RequestControllerRouter } from '@src/types/controllersRoutersApi';
import { NextApiResponse } from 'next';
import runMiddleware from '@src/middleware/runMiddleware';
import joi from 'joi';

jest.mock('joi', () => {
  const originalModule = jest.requireActual('joi');
  return {
    __esModule: true,
    default: {
      ...originalModule,
      attempt: jest.fn().mockReturnValue({
        data: {
          id: 1,
          attributes: {
            name: 'rhafael',
          },
        },
      }),
    },
  };
});

const validation = jest.spyOn(tagController, 'validation').mockReturnValue({
  data: {
    id: '1',
    type: 'Tag',
    attributes: {
      name: 'rhafael',
    },
  },
});

jest.mock('@src/middleware/runMiddleware', () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue(undefined),
  };
});

jest.mock('@src/database', () => {
  const originalModule = jest.requireActual('@src/database');
  const tagSchema = jest.fn().mockReturnValue({
    _id: 1,
    name: 'rhafael',
    save: jest.fn().mockResolvedValue(undefined),
  });

  tagSchema.findById = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue({
      name: 'rhafael',
    }),
  });

  tagSchema.find = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue([
      {
        _id: 1,
        name: 'rhafael',
      },
    ]),
  });

  tagSchema.findByIdAndDelete = jest.fn().mockResolvedValue({
    _id: 1,
    name: 'rhafael',
  });

  tagSchema.findByIdAndUpdate = jest.fn().mockReturnValue({
    setOptions: jest.fn().mockResolvedValue(true),
  });

  return {
    __esModule: true,
    ...originalModule,
    tagSchema,
  };
});

const req = {
  query: {
    tagID: 1,
  },
} as unknown as RequestControllerRouter;

const res = {
  setHeader: jest.fn(),
  end: jest.fn(),
};

afterEach(() => {
  res.end.mockClear();
  res.setHeader.mockClear();
});

describe('GET METHOD SINGULAR', () => {
  const findById = tagSchema.findById as jest.Mock;
  afterEach(() => {
    const lean = findById.mock.results[0].value.lean as jest.Mock;
    lean.mockClear();
    findById.mockClear();
  });

  test('tagSchema.findById dipanggil satu kali', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(findById.mock.calls.length).toBe(1);
  });

  test('tagSchema.findById dipanggil satu kali dengan 1 argument', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(findById.mock.calls[0].length).toBe(1);
  });

  test('tagSchema.findById dipanggil satu kali dengan argument pertama berupa angka 1', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(findById.mock.calls[0][0]).toBe(1);
  });

  test('tagSchema.findById.lean dipanggil satu kali', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    const lean = findById.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls.length).toBe(1);
  });

  test('tagSchema.findById.lean dipanggil satu kali dengan 0 argument', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    const lean = findById.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await tagController.getTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"data\":{\"type\":\"Tag\",\"id\":1,\"attributes\":{\"name\":\"rhafael\"}}}`,
    );
  });
});

describe('GET METHOD PLURAL', () => {
  const find = tagSchema.find as jest.Mock;

  afterEach(() => {
    const lean = find.mock.results[0].value.lean as jest.Mock;
    lean.mockClear();
    find.mockClear();
  });

  test('tagSchema.find dipanggil satu kali', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(find.mock.calls.length).toBe(1);
  });

  test('tagSchema.find dipanggil satu kali dengan 0 argument', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(find.mock.calls[0].length).toBe(0);
  });

  test('tagSchema.find.lean dipanggil satu kali', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    const lean = find.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls.length).toBe(1);
  });

  test('tagSchema.find.lean dipanggil satu kali dengan 0 argument', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    const lean = find.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await tagController.getTags(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"data\":[{\"type\":\"Tag\",\"id\":1,\"attributes\":{\"name\":\"rhafael\"}}]}`,
    );
  });
});

describe('METHOD POST', () => {
  const runMiddlewareMock = runMiddleware as any as jest.Mock;
  const schema = tagSchema as any as jest.Mock;

  beforeEach(() => {
    runMiddlewareMock.mockClear();
  });

  afterEach(() => {
    const save = schema.mock.results[0].value.save as jest.Mock;
    save.mockClear();
    schema.mockClear();
    validation.mockClear();
  });

  test('memanggil runMiddleware sebanyak 1 kali', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][0]).toEqual(req);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][1]).toEqual(res);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('memanggil validation sebanyak 1 kali', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls.length).toBe(1);
  });

  test('memanggil validation sebanyak 1 kali dengan 1 argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls[0].length).toBe(1);
  });

  test('memanggil schema sebanyak 1 kali', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(schema.mock.calls.length).toBe(1);
  });

  test('memanggil schema sebanyak 1 kali dengan 1 argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(schema.mock.calls[0].length).toBe(1);
  });

  test('memanggil schema sebanyak 1 kali dengan argument pertama berupa', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(schema.mock.calls[0][0]).toEqual({ name: 'rhafael' });
  });

  test('memanggil schema.save sebanyak 1 kali', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    const save = schema.mock.results[0].value.save as jest.Mock;
    expect(save.mock.calls.length).toBe(1);
  });

  test('memanggil schema.save tanpa argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    const save = schema.mock.results[0].value.save as jest.Mock;
    expect(save.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil dua kali', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(2);
  });

  test('saat setHeader Dipanggil pertama kali dengan 2 argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('saat setHeader Dipanggil pertama kali  dengan argument pertama berupa', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('saat setHeader Dipanggil pertama kali dengan argument ke-2 dengan argument kedua berupa', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('saat setHeader Dipanggil kedua kali dengan 2 argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[1].length).toBe(2);
  });

  test('saat setHeader Dipanggil kedua kali  dengan argument pertama berupa', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[1][0]).toBe('Location');
  });

  test('saat setHeader Dipanggil kedua kali dengan argument ke-2 dengan argument kedua berupa', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[1][1]).toBe('/api/tags/1');
  });

  test('end Dipanggil satu kali', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await tagController.postTags(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"meta\":{\"title\":\"Tag has created\"},\"data\":{\"type\":\"Tag\",\"id\":1,\"attibutes\":{\"name\":\"rhafael\"}}}`,
    );
  });
});

describe('PATCH METHOD', () => {
  const findByIdAndUpdate = tagSchema.findByIdAndUpdate as any as jest.Mock;
  const runMiddlewareMock = runMiddleware as any as jest.Mock;

  beforeAll(() => {
    runMiddlewareMock.mockClear();
  });

  afterEach(() => {
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    setOptions.mockClear();
    findByIdAndUpdate.mockClear();
    validation.mockClear();
  });

  test('memanggil runMiddleware sebanyak 1 kali', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][0]).toEqual(req);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][1]).toEqual(res);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('memanggil validation sebanyak 1 kali', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls.length).toBe(1);
  });

  test('memanggil validation sebanyak 1 kali dengan 1 argument', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls[0].length).toBe(1);
  });

  test('findByIdAndUpdate dipanggil satu kali', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls.length).toBe(1);
  });

  test('findByIdAndUpdate dipanggil dengan 2 argument', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls[0].length).toBe(2);
  });

  test('findByIdAndUpdate dipanggil dengan argument pertama berupa 1', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls[0][0]).toBe(1);
  });

  test('findByIdAndUpdate dipanggil dengan argument kedua berupa object', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls[0][1]).toEqual({
      name: 'rhafael',
    });
  });

  test('findByIdAndUpdate.setOptions 1x', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    expect(setOptions.mock.calls.length).toBe(1);
  });

  test('findByIdAndUpdate.setOptions dengan 1 argument', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    expect(setOptions.mock.calls[0].length).toBe(1);
  });

  test('findByIdAndUpdate.setOptions dengan argument pertama berupa object', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    expect(setOptions.mock.calls[0][0]).toEqual({
      new: true,
    });
  });

  test('setHeader Dipanggil satu kali', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await tagController.patchTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{"meta":{"title":"success updated","code":204}}`,
    );
  });
});

describe('DELETE METHOD', () => {
  const findByIdAndDelete = tagSchema.findByIdAndDelete as jest.Mock;

  afterEach(() => {
    findByIdAndDelete.mockClear();
  });

  test('tagSchema.findByIdAndDelete dipanggil satu kali', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndDelete.mock.calls.length).toBe(1);
  });

  test('tagSchema.findByIdAndDelete dipanggil satu kali dengan 1 argument', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndDelete.mock.calls[0].length).toBe(1);
  });

  test('tagSchema.findByIdAndDelete dipanggil satu kali dengan argument pertama berupa angka 1', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(findByIdAndDelete.mock.calls[0][0]).toBe(1);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await tagController.deleteTag(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{"meta":{"title":"success deleted"}}`,
    );
  });
});

describe('VALIDATION', () => {
  const attemp = joi.attempt as jest.Mock;
  beforeAll(() => {
    validation.mockRestore();
  });
  beforeEach(() => {
    attemp.mockClear();
  });

  test('validation mengembalikan object', () => {
    expect(tagController.validation({ name: 'rhafael', as: 'ok' })).toEqual({
      data: {
        id: 1,
        attributes: {
          name: 'rhafael',
        },
      },
    });
  });

  test('joi.attempt dipanggil 1 kali', () => {
    tagController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls.length).toBe(1);
  });

  test('joi.attempt dipanggil dengan 2 argument', () => {
    tagController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0].length).toBe(2);
  });

  test('joi.attempt dipanggil dengan argument pertama berupa object', () => {
    tagController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0][0]).toEqual({ name: 'rhafael', as: 'ok' });
  });

  test('joi.attempt dipanggil dengan argument kedua berupa object', () => {
    tagController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0][1]).toBeInstanceOf(Object);
  });
});
