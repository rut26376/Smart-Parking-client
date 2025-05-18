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

    },
    extraReducers: (builder) => {
        builder.addCase(addRoutineThunk.pending, (state, action) => {
            state.successCreate=null;
             console.log("yess");
          })
        builder.addCase(addRoutineThunk.fulfilled, (state, action) => {
          state.successCreate=1;
           console.log("yess");
        })
        builder.addCase(addRoutineThunk.rejected, (state, action) => {
            console.log("noooooooooo");
        })
        builder.addCase(findDriverCarThunk.fulfilled, (state, action) => {
            state.currentCode = action.payload;
            console.log(state.currentCode,"state.currentCode");
        })
        builder.addCase(findDriverCarThunk.rejected, (state, action) => {
            console.log("not found");
        })
        builder.addCase(getPriceThunk.fulfilled, (state, action) => {
            state.price = action.payload;
            console.log(state.price,"state.price");
        })
        builder.addCase(getPriceThunk.rejected, (state, action) => {
            console.log("not found");
        })
        
    }
})
