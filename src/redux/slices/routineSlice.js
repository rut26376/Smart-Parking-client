import { createSlice } from "@reduxjs/toolkit"
import { addRoutineThunk } from "../Thunks/addRoutineThunk";
import { findDriverCarThunk } from "../Thunks/findDriverCarThunk";
import { getPriceThunk } from "../Thunks/getPriceThunk";



const INITIAL_STATE_ROUTINE= {
    currentCode:0,
    price:0,
    successCreate:null
}
export const RoutineSlice = createSlice({
    name: 'routine',
    initialState: INITIAL_STATE_ROUTINE,
    reducers: {
setPrice:(state,action)=>{
    state.price=action.payload;
}
    },
    extraReducers: (builder) => {
        builder.addCase(addRoutineThunk.pending, (state, action) => {
            state.successCreate=null;
          })
        builder.addCase(addRoutineThunk.fulfilled, (state, action) => {
          state.successCreate=1;
        })
        builder.addCase(addRoutineThunk.rejected, (state, action) => {
        })
        builder.addCase(findDriverCarThunk.fulfilled, (state, action) => {
            state.currentCode = action.payload;
        })
        builder.addCase(findDriverCarThunk.rejected, (state, action) => {
        })
        builder.addCase(getPriceThunk.fulfilled, (state, action) => {
            state.price = action.payload;
        })
        builder.addCase(getPriceThunk.rejected, (state, action) => {
        })
        
    }
})
export const {setPrice}=RoutineSlice.actions;
