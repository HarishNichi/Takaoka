import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkOutData: {},
};

export const checkOut = createSlice({
  name: "checkOutData",
  initialState,
  reducers: {
    reset: () => initialState,
    setCheckOutData: (state, action) => {
      state.checkOutData = action.payload;
    },
  },
});

export const { setCheckOutData, reset } = checkOut.actions;
export default checkOut.reducer;