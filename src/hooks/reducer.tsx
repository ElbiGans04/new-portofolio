import type { admin, action } from '@src/types/admin';
// Reducer
export function reducer(state: admin, action: action): admin {
  switch (action.type) {
    case 'modal/open/add': {
      return { message: null, row: null, status: 'iddle', modal: 'add' };
    }
    case 'modal/open/update': {
      return {
        ...state,
        modal: 'update',
        row: action.payload,
      };
    }
    case 'modal/open/delete': {
      return {
        ...state,
        modal: 'delete',
        row: action.payload,
      };
    }
    case 'modal/request/start': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'modal/request/finish': {
      return {
        ...state,
        status: 'iddle',
        message: action.payload.message,
      };
    }
    case 'modal/close': {
      return {
        row: null,
        status: 'iddle',
        modal: null,
        message: null,
      };
    }
    default: {
      return state;
    }
  }
}
