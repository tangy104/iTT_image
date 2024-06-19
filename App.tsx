import React from 'react';
import {Provider} from 'react-redux';
import {PaperProvider} from 'react-native-paper';
import store from './src/state/store';
import MainHome from './src/MainHome';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <MainHome />
      </PaperProvider>
    </Provider>
  );
};

export default App;
