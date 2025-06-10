import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registerData: {},
  originalData:[],
  successData:{ showButton: false,placeId:""},
  placeId:'',
};

export const temp_register = createSlice({
  name: "tempRegisterData",
  initialState,
  reducers: {
    reset: () => initialState,
    clearExceptPlaceId: (state) => {
      return {
        ...initialState,
        placeId: state.placeId
      }
    },
    clearExceptSuccessData: (state) => {
      return {
        ...initialState,
        successData: state.successData
      }
    },
    setRegisterData: (state, action) => {
      state.registerData = action.payload;
    },
    setOriginalData: (state, action) => {
      state.originalData = action.payload;
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

export const { setRegisterData, setOriginalData,setSuccessData,setPlaceId,reset,clearExceptPlaceId,clearExceptSuccessData } = temp_register.actions;
export default temp_register.reducer;