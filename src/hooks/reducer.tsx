import type { admin, action } from "../types/admin";
// Reducer
export function reducer(state: admin, action: action): admin {
  switch (action.type) {
    case "modal/open/add": {
      return { ...state, modal: "add" };
    }
    case "modal/open/update": {
      return {
        ...state,
        modal: "update",
        row: {
          columns: [...action.payload.columns],
          columnsValue: [...action.payload.columnsValue],
          id: action.payload.id,
        },
      };
    }
    case "modal/open/delete": {
      return {
        ...state,
        modal: "delete",
        row: { columns: null, columnsValue: null, id: action.payload.id },
      };
    }
    case "modal/request/start": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "modal/request/finish": {
      return {
        ...state,
        status: "iddle",
        message: action.payload.message,
      };
    }
    case "modal/close": {
      return {
        ...state,
        status: "iddle",
        modal: null,
      };
    };
    default: {
      return state;
    }
  }
}
