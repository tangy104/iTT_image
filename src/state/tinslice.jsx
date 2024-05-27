import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tinGlobal: null,
};

const tinSlice = createSlice({
  name: 'tin',
  initialState: initialState,
  reducers: {
    setTinGlobal: (state, action) => {
      state.tinGlobal = action.payload;
    },
  },
});

export const {setTinGlobal} = tinSlice.actions;
export default tinSlice.reducer;
