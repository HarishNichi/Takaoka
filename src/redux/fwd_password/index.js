import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  forgetPassword: {},
};

export const forgetPassword = createSlice({
  name: "forgetPassword",
  initialState,
  reducers: {
    reset: () => initialState,
    setForgetPassword: (state, action) => {
      state.forgetPassword = action.payload;
    },
  },
});

export const { setForgetPassword, reset } = forgetPassword.actions;
export default forgetPassword.reducer;