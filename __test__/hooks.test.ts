import type { admin, DocTool } from '@src/types/admin';
import { reducer } from '@src/hooks/reducer';
import useAdmin from '@src/hooks/useAdmin';
import React from 'react';
import useSWR from 'swr';

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');

  return {
    __esModule: true,
    ...originalModule,
    useRef: jest.fn().mockReturnValue({ current: null }),
  };
});

jest.mock('swr', () => {
  const originalModule = jest.requireActual('swr');

  return {
    __esModule: true,
    ...originalModule,
    default: jest
      .fn()
      .mockReturnValue({ data: { name: 'rhafael' }, error: null }),
  };
});

describe('Reducer Test', () => {
  const defaultState: admin = {
    status: 'iddle',
    message: null,
    modal: null,
    row: null,
  };
  test('modal/open/add', () => {
    expect(reducer({ ...defaultState }, { type: 'modal/open/add' })).toEqual({
      message: null,
      row: null,
      status: 'iddle',
      modal: 'add',
    });
  });

  test('modal/open/update', () => {
    expect(
      reducer(
        { ...defaultState },
        {
          type: 'modal/open/update',
          payload: { name: 'rhafael' } as any as DocTool,
        },
      ),
    ).toEqual({
      message: null,
      row: { name: 'rhafael' },
      status: 'iddle',
      modal: 'update',
    });
  });

  test('modal/open/delete', () => {
    expect(
      reducer(
        { ...defaultState },
        {
          type: 'modal/open/delete',
          payload: { name: 'rhafael' } as any as DocTool,
        },
      ),
    ).toEqual({
      message: null,
      row: { name: 'rhafael' },
      status: 'iddle',
      modal: 'delete',
    });
  });

  test('modal/request/start', () => {
    expect(
      reducer({ ...defaultState }, { type: 'modal/request/start' }),
    ).toEqual({ message: null, row: null, status: 'loading', modal: null });
  });

  test('modal/request/finish', () => {
    expect(
      reducer(
        { ...defaultState },
        { type: 'modal/request/finish', payload: { message: 'Hello World' } },
      ),
    ).toEqual({
      message: 'Hello World',
      row: null,
      status: 'iddle',
      modal: null,
    });
  });

  test('modal/close', () => {
    expect(reducer({ ...defaultState }, { type: 'modal/close' })).toEqual({
      ...defaultState,
    });
  });

  test('default', () => {
    expect(reducer({ ...defaultState }, { type: 'default' as any })).toEqual({
      ...defaultState,
    });
  });
});

describe('useAdmin Hook', () => {
  expect(useAdmin('/')).toEqual({
    ref: { current: null },
    data: { name: 'rhafael' },
    error: null,
  });
});
