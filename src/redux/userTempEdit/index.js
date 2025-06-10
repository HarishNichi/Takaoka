import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerData: {},
  originalData: [],
  successData:{ showButton: false,placeId:""},
  isEdit: false,
  placeId:'',
};

export const userTempEdit = createSlice({
  name: "userTempEditData",
  initialState,
  reducers: {
    reset: () => initialState,
    setRegisterData: (state, action) => {
      state.registerData = action.payload;
    },
    setOriginalData: (state, action) => {
      state.originalData = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setSuccessData: (state, action) => {
      state.successData = {
        ...state.successData, // Preserve other properties in successData
        ...action.payload, // Merge new data with existing data
      };
    },
    setPlaceId: (state, action) => {
      state.placeId = action.payload
    }

  },
});

export const { setRegisterData, setOriginalData, setSuccessData, setIsEdit, setPlaceId,reset } = userTempEdit.actions;
export default userTempEdit.reducer;