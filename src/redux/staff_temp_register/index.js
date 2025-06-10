import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerData: {},
  originalData: [],
  successData: {},
  isEdit: false
};

export const staffTempRegister = createSlice({
  name: "staffTempRegisterData",
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
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },

  },
});

export const { setRegisterData, setOriginalData, setSuccessData, setIsEdit, reset } = staffTempRegister.actions;
export default staffTempRegister.reducer;