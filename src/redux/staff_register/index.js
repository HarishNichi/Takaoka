import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerData: {},
  originalData: [],
  successData: {},
  isEdit: false
};

export const staffRegister = createSlice({
  name: "staffRegisterData",
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

export const { setRegisterData, setOriginalData, setSuccessData, setIsEdit, reset } = staffRegister.actions;
export default staffRegister.reducer;