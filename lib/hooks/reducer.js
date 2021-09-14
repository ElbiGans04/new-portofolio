// Reducer
export function reducer(state, action) {
    switch (action.type) {
      case "modal/open":
        return { ...state, modal: action.payload.modal };
    case "modal/close":
        return {...state, modal: false}
      default:
        throw new Error();
    }
  }
  