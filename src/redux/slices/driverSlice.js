import { createSlice } from "@reduxjs/toolkit"
import { loginThunk } from "../Thunks/loginThunk";
import { addDriverThunk } from "../Thunks/addDriverThunk";
import { getAllDriversThunk } from "../Thunks/getAllDriversThunk";



const INITIAL_STATE_DRIVER = {
    allDrivers : [{
        name: "",
        phoneNumber: "",
        userName: "",
       
      }],
    vehicles: [],
    userName: "",
    code: "",
    isNew: false,
    
}
export const DriverSlice = createSlice({
    name: 'driver',
    initialState: INITIAL_STATE_DRIVER,
    reducers: {
        insertUserName: (state, action) => {
            state.userName = action.payload;
        },
        setIsNew: (state, action) => {
            state.isNew = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.fulfilled, (state, action) => {
    
            state.vehicles = action.payload.vehicles;
            state.code = action.payload.code;
        })
        builder.addCase(loginThunk.rejected, (state, action) => {
            state.isNew = true;
            console.log("noooooooooo");
        })
        builder.addCase(addDriverThunk.fulfilled, (state, action) => {
            state.code = action.payload;
        })
        builder.addCase(addDriverThunk.rejected, (state, action) => {
            console.log("fail");
        })
        builder.addCase(getAllDriversThunk.fulfilled, (state, action) => {
            
            state.allDrivers = action.payload;
        })
    }
})
export const { insertUserName, setIsNew } = DriverSlice.actions;