const initialState = {
  reload : true,
  apiKey : "",
  loadingSummary: null,
  selected_media: null,
  settingsWindowOpen : false,
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
      case 'SET_SELECTED':
          nextState = {
            ...state,
            selected_media: action.value
          }
        return nextState || state
      case 'SWITCH_SETTINGS_WINDOW':
          nextState = {
            ...state,
            settingsWindowOpen: !state.settingsWindowOpen
          }
        return nextState || state
    default:
      return state
  }
}

export default setState