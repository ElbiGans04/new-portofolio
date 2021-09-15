// Reducer
export function reducer(state, action) {
  switch (action.type) {
    case "modalAdd/open":
      return { ...state, modal: 'add' };
    case "modalDelete/open":
      return {
        ...state,
        modal: 'delete',
        row: { ...state.row, id: action.payload.id },
      };
    case "modalUpdate/open":
      return {
        ...state,
        modal: 'update',
        row: { columns: [...action.payload.columns], columnsValue: [...action.payload.columnsValue], id: action.payload.id },
      };
    case "modal/close":
      return { ...state, modal: false, row : { id: false, columns: false, columnsValue: false } };
    default:
      throw new Error();
  }
}
