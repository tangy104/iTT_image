// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  value: false,
};

export const alertSlice = createSlice({
  name: 'alert', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    //   deposit: (state, action) => {
    //     // This is the reducer function for the deposit action
    //     state.value += action.payload;
    //   },
    //   withdraw: (state, action) => {
    //     // This is the reducer function for the withdraw action
    //     state.value -= action.payload;
    //   },
    active: state => {
      state.value = true;
    },
    inactive: state => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {active, inactive} = alertSlice.actions;

// We export the reducer function so that it can be added to the store
export default alertSlice.reducer;
