import React from 'react';
import {StoresProvider, stores} from './src/store';
import axios from 'axios';
import RouteApp from './route';

function App() {
  axios.defaults.baseURL = 'https://nucsaping.my.id/api';
  axios.defaults.timeout = 1000;
  return (
    <StoresProvider value={stores}>
      <RouteApp />
    </StoresProvider>
  );
}

export default App;
