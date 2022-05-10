import toolController from '@src/controllers/tools';
import { toolSchema } from '@src/database';
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
            as: 'ok',
          },
        },
      }),
    },
  };
});

jest.mock('@src/middleware/runMiddleware', () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue(undefined),
  };
});

jest.mock('@src/database', () => {
  const originalModule = jest.requireActual('@src/database');
  const toolSchema = jest.fn().mockReturnValue({
    _id: 1,
    name: 'rhafael',
    as: 'ok',
    save: jest.fn().mockResolvedValue(undefined),
  });

  toolSchema.findById = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue({
      name: 'rhafael',
      as: 'ok',
    }),
  });

  toolSchema.find = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue([
      {
        _id: 1,
        name: 'rhafael',
        as: 'ok',
      },
    ]),
  });

  toolSchema.findByIdAndDelete = jest.fn().mockResolvedValue({
    _id: 1,
    name: 'rhafael',
    as: 'ok',
  });

  toolSchema.findByIdAndUpdate = jest.fn().mockReturnValue({
    setOptions: jest.fn().mockResolvedValue(true),
  });

  return {
    __esModule: true,
    ...originalModule,
    toolSchema,
  };
});

const validation = jest.spyOn(toolController, 'validation').mockReturnValue({
  data: {
    id: '1',
    type: 'Tool',
    attributes: {
      name: 'rhafael',
      as: 'ok',
    },
  },
});

const req = {
  query: {
    toolID: 1,
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
  const findById = toolSchema.findById as jest.Mock;
  afterEach(() => {
    const lean = findById.mock.results[0].value.lean as jest.Mock;
    lean.mockClear();
    findById.mockClear();
  });

  test('toolSchema.findById dipanggil satu kali', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(findById.mock.calls.length).toBe(1);
  });

  test('toolSchema.findById dipanggil satu kali dengan 1 argument', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(findById.mock.calls[0].length).toBe(1);
  });

  test('toolSchema.findById dipanggil satu kali dengan argument pertama berupa angka 1', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(findById.mock.calls[0][0]).toBe(1);
  });

  test('toolSchema.findById.lean dipanggil satu kali', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    const lean = findById.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls.length).toBe(1);
  });

  test('toolSchema.findById.lean dipanggil satu kali dengan 0 argument', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    const lean = findById.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await toolController.getTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"data\":{\"type\":\"Tool\",\"id\":1,\"attributes\":{\"name\":\"rhafael\",\"as\":\"ok\"}}}`,
    );
  });
});

describe('GET METHOD PLURAL', () => {
  const find = toolSchema.find as jest.Mock;

  afterEach(() => {
    const lean = find.mock.results[0].value.lean as jest.Mock;
    lean.mockClear();
    find.mockClear();
  });

  test('toolSchema.find dipanggil satu kali', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(find.mock.calls.length).toBe(1);
  });

  test('toolSchema.find dipanggil satu kali dengan 0 argument', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(find.mock.calls[0].length).toBe(0);
  });

  test('toolSchema.find.lean dipanggil satu kali', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    const lean = find.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls.length).toBe(1);
  });

  test('toolSchema.find.lean dipanggil satu kali dengan 0 argument', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    const lean = find.mock.results[0].value.lean as jest.Mock;
    expect(lean.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await toolController.getTools(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"data\":[{\"type\":\"Tool\",\"id\":1,\"attributes\":{\"name\":\"rhafael\",\"as\":\"ok\"}}]}`,
    );
  });
});

describe('METHOD POST', () => {
  const runMiddlewareMock = runMiddleware as any as jest.Mock;
  const schema = toolSchema as any as jest.Mock;

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
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][0]).toEqual(req);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][1]).toEqual(res);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('memanggil validation sebanyak 1 kali', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls.length).toBe(1);
  });

  test('memanggil validation sebanyak 1 kali dengan 1 argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls[0].length).toBe(1);
  });

  test('memanggil schema sebanyak 1 kali', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(schema.mock.calls.length).toBe(1);
  });

  test('memanggil schema sebanyak 1 kali dengan 1 argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(schema.mock.calls[0].length).toBe(1);
  });

  test('memanggil schema sebanyak 1 kali dengan argument pertama berupa', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(schema.mock.calls[0][0]).toEqual({ name: 'rhafael', as: 'ok' });
  });

  test('memanggil schema.save sebanyak 1 kali', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    const save = schema.mock.results[0].value.save as jest.Mock;
    expect(save.mock.calls.length).toBe(1);
  });

  test('memanggil schema.save tanpa argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    const save = schema.mock.results[0].value.save as jest.Mock;
    expect(save.mock.calls[0].length).toBe(0);
  });

  test('setHeader Dipanggil dua kali', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(2);
  });

  test('saat setHeader Dipanggil pertama kali dengan 2 argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('saat setHeader Dipanggil pertama kali  dengan argument pertama berupa', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('saat setHeader Dipanggil pertama kali dengan argument ke-2 dengan argument kedua berupa', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('saat setHeader Dipanggil kedua kali dengan 2 argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[1].length).toBe(2);
  });

  test('saat setHeader Dipanggil kedua kali  dengan argument pertama berupa', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[1][0]).toBe('Location');
  });

  test('saat setHeader Dipanggil kedua kali dengan argument ke-2 dengan argument kedua berupa', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[1][1]).toBe('/api/tools/1');
  });

  test('end Dipanggil satu kali', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await toolController.postTools(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{\"meta\":{\"title\":\"tool has created\"},\"data\":{\"type\":\"tool\",\"id\":1,\"attibutes\":{\"name\":\"rhafael\",\"as\":\"ok\"}}}`,
    );
  });
});

describe('PATCH METHOD', () => {
  const findByIdAndUpdate = toolSchema.findByIdAndUpdate as any as jest.Mock;
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
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls.length).toBe(1);
  });

  test('memanggil runMiddleware dengan 3 argument', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0].length).toBe(3);
  });

  test('memanggil runMiddleware dengan argument pertama berupa object', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][0]).toEqual(req);
  });

  test('memanggil runMiddleware dengan argument kedua berupa object', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][1]).toEqual(res);
  });

  test('memanggil runMiddleware dengan argument ketiga berupa function', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(runMiddlewareMock.mock.calls[0][2]).toBeInstanceOf(Function);
  });

  test('memanggil validation sebanyak 1 kali', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls.length).toBe(1);
  });

  test('memanggil validation sebanyak 1 kali dengan 1 argument', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(validation.mock.calls[0].length).toBe(1);
  });

  test('findByIdAndUpdate dipanggil satu kali', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls.length).toBe(1);
  });

  test('findByIdAndUpdate dipanggil dengan 2 argument', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls[0].length).toBe(2);
  });

  test('findByIdAndUpdate dipanggil dengan argument pertama berupa 1', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls[0][0]).toBe(1);
  });

  test('findByIdAndUpdate dipanggil dengan argument kedua berupa object', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndUpdate.mock.calls[0][1]).toEqual({
      name: 'rhafael',
      as: 'ok',
    });
  });

  test('findByIdAndUpdate.setOptions 1x', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    expect(setOptions.mock.calls.length).toBe(1);
  });

  test('findByIdAndUpdate.setOptions dengan 1 argument', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    expect(setOptions.mock.calls[0].length).toBe(1);
  });

  test('findByIdAndUpdate.setOptions dengan argument pertama berupa object', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    const setOptions = findByIdAndUpdate.mock.results[0].value
      .setOptions as jest.Mock;
    expect(setOptions.mock.calls[0][0]).toEqual({
      new: true,
    });
  });

  test('setHeader Dipanggil satu kali', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await toolController.patchTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0][0]).toBe(
      `{"meta":{"title":"success updated","code":204}}`,
    );
  });
});

describe('DELETE METHOD', () => {
  const findByIdAndDelete = toolSchema.findByIdAndDelete as jest.Mock;

  afterEach(() => {
    findByIdAndDelete.mockClear();
  });

  test('toolSchema.findByIdAndDelete dipanggil satu kali', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndDelete.mock.calls.length).toBe(1);
  });

  test('toolSchema.findByIdAndDelete dipanggil satu kali dengan 1 argument', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndDelete.mock.calls[0].length).toBe(1);
  });

  test('toolSchema.findByIdAndDelete dipanggil satu kali dengan argument pertama berupa angka 1', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(findByIdAndDelete.mock.calls[0][0]).toBe(1);
  });

  test('setHeader Dipanggil satu kali', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls.length).toBe(1);
  });

  test('setHeader Dipanggil satu kali dengan 2 argument', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0].length).toBe(2);
  });

  test('setHeader Dipanggil satu kali dengan argument pertama berupa', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][0]).toBe('content-type');
  });

  test('setHeader Dipanggil satu kali dengan argument kedua berupa', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(res.setHeader.mock.calls[0][1]).toBe('application/vnd.api+json');
  });

  test('end Dipanggil satu kali', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls.length).toBe(1);
  });

  test('end Dipanggil satu kali dengan 1 argument', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
    expect(res.end.mock.calls[0].length).toBe(1);
  });

  test('end Dipanggil satu kali dengan argument pertama bernilai', async () => {
    await toolController.deleteTool(req, res as unknown as NextApiResponse);
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
    expect(toolController.validation({ name: 'rhafael', as: 'ok' })).toEqual({
      data: {
        id: 1,
        attributes: {
          name: 'rhafael',
          as: 'ok',
        },
      },
    });
  });

  test('joi.attempt dipanggil 1 kali', () => {
    toolController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls.length).toBe(1);
  });

  test('joi.attempt dipanggil dengan 2 argument', () => {
    toolController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0].length).toBe(2);
  });

  test('joi.attempt dipanggil dengan argument pertama berupa object', () => {
    toolController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0][0]).toEqual({ name: 'rhafael', as: 'ok' });
  });

  test('joi.attempt dipanggil dengan argument kedua berupa object', () => {
    toolController.validation({ name: 'rhafael', as: 'ok' });
    expect(attemp.mock.calls[0][1]).toBeInstanceOf(Object);
  });
});