import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffEditedStockpile: []
};

export const stockpile = createSlice({
  name: "stockpile",
  initialState,
  reducers: {
    reset: () => initialState,
    setStaffEditedStockpile: (state, action) => {
      state.staffEditedStockpile = action.payload;
    },
  },
});

export const { setStaffEditedStockpile, reset } = stockpile.actions;
export default stockpile.reducer;