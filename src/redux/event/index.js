import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  event: {},
};

export const event = createSlice({
  name: "event",
  initialState,
  reducers: {
    reset: () => initialState,
    setEvent: (state, action) => {
      state.event = action.payload;
    },
  },
});

export const { setEvent, reset } = event.actions;
export default event.reducer;