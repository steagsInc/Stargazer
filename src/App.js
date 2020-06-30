import React from 'react';
import './App.css';
import MainScreen from './lib/screens/Main.js';
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'

import Store from './store/configureStore'

function App() {
  let persistor = persistStore(Store)
  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <div className="App">
          <MainScreen/>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
