import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkInData: {},
};

export const checkIn = createSlice({
  name: "checkInData",
  initialState,
  reducers: {
    reset: () => initialState,
    setCheckInData: (state, action) => {
      state.checkInData = action.payload;
    },
  },
});

export const { setCheckInData, reset } = checkIn.actions;
export default checkIn.reducer;