const initialState = {
  reload : true,
  apiKey : "",
  loadingSummary: null,
}

function setState(state = initialState, action) {
  let nextState
  switch (action.type) {
      case 'RESET':
      return initialState;
      case 'RELOAD':
          nextState = {
            ...state,
            reload: !state.reload
          }
        return nextState || state
      case 'SET_APIKEY':
          nextState = {
            ...state,
            apikey: action.value
          }
        return nextState || state
      case 'SET_SUMMARY':
          nextState = {
            ...state,
            loadingSummary: action.value
          }
        return nextState || state
    default:
      return state
  }
}

export default setState
