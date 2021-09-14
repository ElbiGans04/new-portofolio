// Reducer
export function reducer(state, action) {
    switch (action.type) {
      case "modalAdd/open":
        return { ...state, modal: 'add' };
    case "modal/close":
        return {...state, modal: false}
      default:
        throw new Error();
    }
  }
  