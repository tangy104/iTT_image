import {createSlice} from '@reduxjs/toolkit';

// const initialState = {
//   selectedWheelData: null,
// };
const initialState = {
  selectedWheelDataGlobal: {
    axle_location: null,
    wheel_pos: null,
    wheel_id: null,
    wheel_tin: null,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setSelectedWheelDataGlobal: (state, action) => {
      state.selectedWheelDataGlobal = action.payload;
    },
  },
});

export const {setSelectedWheelDataGlobal} = appSlice.actions;
export default appSlice.reducer;
