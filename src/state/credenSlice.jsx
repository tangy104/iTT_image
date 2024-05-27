import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  creden: {
    ticket: null,
    URI: null,
    WS_URI: null,
    RTMP_URI: null,
  },
};

const credenSlice = createSlice({
  name: 'creden',
  initialState: initialState,
  reducers: {
    setCreden: (state, action) => {
      state.creden = action.payload;
    },
  },
});

export const {setCreden} = credenSlice.actions;
export default credenSlice.reducer;
