import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkInData: {},
};

export const qrApp = createSlice({
  name: "qrApp",
  initialState,
  reducers: {
    reset: () => initialState,
    setCheckInData: (state, action) => {
      state.checkInData = action.payload;
    },
  },
});

export const { setCheckInData, reset } = qrApp.actions;
export default qrApp.reducer;