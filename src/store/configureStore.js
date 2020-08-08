import { createStore } from 'redux'
import settings from './reducers/settingsReducer'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['selected_media']
}

export default createStore(persistReducer(rootPersistConfig,settings))
