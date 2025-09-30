import { createSlice } from "@reduxjs/toolkit"
import { getDriversCardsThunk } from "../Thunks/getDriversCardsThunk";
import { isManagerThunk } from "../Thunks/isManagerThunk";
import { getAllDriversThunk } from "../Thunks/getAllDriversThunk";


const INITIAL_STATE_MANAGERS = {
    isManager: null,
    drivers:[]
}
export const ManagerSlice = createSlice({
    name: 'manager',
    initialState: INITIAL_STATE_MANAGERS,
    reducers: {

    },
    extraReducers: (builder) => {

        builder.addCase(isManagerThunk.fulfilled, (state, action) => {
            if (action.payload == true)
                state.isManager = true;
            else state.isManager = false;
        })
        builder.addCase(isManagerThunk.rejected, (state, action) => {
        })
         builder.addCase(getAllDriversThunk.fulfilled, (state, action) => {
            state.drivers = action.payload;
        })
        builder.addCase(getAllDriversThunk.rejected, (state, action) => {
        })

    }
})
