import React from 'react';
import {Provider} from 'react-redux';
import store from './src/state/store';
import MainHome from './src/MainHome';

const App = () => {
  return (
    <Provider store={store}>
      <MainHome />
    </Provider>
  );
};

export default App;
