import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  family: {},
  tempFamily: {},
  externalFamily: {},
  staffTempFamily: {},
  eventStaffFamily: {},
  staffExternalFamily: {},
};

export const family = createSlice({
  name: "family",
  initialState,
  reducers: {
    reset: () => initialState,
    setFamily: (state, action) => {
      state.family = action.payload;
    },
    setTempFamily: (state, action) => {
      state.tempFamily = action.payload;
    },
    setExternalFamily: (state, action) => {
      state.externalFamily = action.payload;
    },
    setStaffTempFamily: (state, action) => {
      state.staffTempFamily = action.payload;
    },
    setEventStaffFamily: (state, action) => {
      state.eventStaffFamily = action.payload;
    },
    setStaffExternalFamily: (state, action) => {
      state.staffExternalFamily = action.payload;
    },
  },
});

export const { setFamily, setTempFamily, setExternalFamily, setStaffTempFamily, setEventStaffFamily, setStaffExternalFamily, reset } = family.actions;
export default family.reducer;