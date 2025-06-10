import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    admin: {},
    staff: {},
    headquaters: {}
}

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        setAdminValue: (state, action) => {
            state.admin = action.payload.admin;
        },
        setStaffValue: (state, action) => {
            state.staff = action.payload.staff;
        },
        setHeadquaterValue: (state, action) => {
            state.headquaters = action.payload.headquaters;
        },
    }
})

export const {
    setAdminValue,
    setStaffValue,
    setHeadquaterValue,
    reset
} = auth.actions

export default auth.reducer