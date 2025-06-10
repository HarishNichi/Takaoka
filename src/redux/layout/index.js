import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layout: {},
  user: {
    place: {},
    other: ""
  },
  places:{},
  position:{},
};

export const layout = createSlice({
  name: "layout",
  initialState,
  reducers: {
    reset: () => initialState,
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
    setPlaceDetails: (state, action) => {
      state.places = action.payload;
    },
    setPosition:(state, action) => {
      state.position = action.payload;
    },
  },
});

export const { reset, setLayout, setUserDetails,setPlaceDetails,setPosition } = layout.actions;
export default layout.reducer;