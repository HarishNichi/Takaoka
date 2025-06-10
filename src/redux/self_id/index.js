import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selfID: {},
};

export const selfID = createSlice({
  name: "selfID",
  initialState,
  reducers: {
    reset: () => initialState,
    setSelfID: (state, action) => {
      state.selfID = action.payload;
    },
  },
});

export const { setSelfID, reset } = selfID.actions;
export default selfID.reducer;