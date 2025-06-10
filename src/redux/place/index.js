import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  place: {},
};

export const place = createSlice({
  name: "place",
  initialState,
  reducers: {
    reset: () => initialState,
    setPlace: (state, action) => {
      state.place = action.payload;
    },
  },
});

export const { setPlace, reset } = place.actions;
export default place.reducer;