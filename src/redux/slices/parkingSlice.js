import { createSlice } from "@reduxjs/toolkit"
import { getAllParkingThunk } from "../Thunks/getParkingsThunk";
import { getCarExists } from "../Thunks/getCarExists";



const INITIAL_STATE_PARKING = {
    carParkings: [{
        code: "",
        row: '',
        col: 0,
        level: "",
        used: false
    }],
    avilable: {
        code: "",
        row: '',
        col: 0,
        level: ""
    },
    
    enter: false
}
export const ParkingSlice = createSlice({
    name: 'parking',
    initialState: INITIAL_STATE_PARKING,
    reducers: {
        
        setEnter(state, action) {
            state.enter=action.payload;
           
        } 
    },
    extraReducers: (builder) => {
        builder.addCase(getAllParkingThunk.fulfilled, (state, action) => {
            state.carParkings = action.payload;
        })
        builder.addCase(getAllParkingThunk.rejected, (state, action) => {
        })
        builder.addCase(getCarExists.fulfilled, (state, action) => {
            
            state.enter = action.payload;
            if (state.enter === "true") {
                state.avilable = state.carParkings.find(p => !p.used);
            }

        })
        builder.addCase(getCarExists.rejected, (state, action) => {
        })
    }
})
export const { setEnter } = ParkingSlice.actions;