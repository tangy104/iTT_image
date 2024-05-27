// src/redux/store.js

import {configureStore} from '@reduxjs/toolkit';
import screenSharingReducer from './screenSharingSlice';
import alertSlice from './alertSlice';
import selectSlice from './selectSlice';
import tinSlice from './tinslice';
import tokenSlice from './tokenslice';
import credenSlice from './credenSlice';

const store = configureStore({
  reducer: {
    screenSharing: screenSharingReducer,
    alert: alertSlice,
    app: selectSlice,
    tin: tinSlice,
    token: tokenSlice,
    creden: credenSlice,
  },
});

export default store;
