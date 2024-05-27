import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tokenGlobal: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState: initialState,
  reducers: {
    setTokenGlobal: (state, action) => {
      state.tokenGlobal = action.payload;
    },
  },
});

export const {setTokenGlobal} = tokenSlice.actions;
export default tokenSlice.reducer;
