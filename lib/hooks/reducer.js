// Reducer
export function reducer(state, action) {
    switch (action.type) {
      case "test":
        return { ...state };
      default:
        throw new Error();
    }
  }
  