import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerData: {},
  originalData:[],
  successData:{}
};

export const register = createSlice({
  name: "registerData",
  initialState,
  reducers: {
    reset: () => initialState,
    setRegisterData: (state, action) => {
      state.registerData = action.payload;
    },
    setOriginalData: (state, action) => {
      state.originalData = action.payload;
    },
    setSuccessData: (state, action) => {
      state.successData = action.payload;
    },
  },
});

export const { setRegisterData, setOriginalData,setSuccessData,reset } = register.actions;
export default register.reducer;