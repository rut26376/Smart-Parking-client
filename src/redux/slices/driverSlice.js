import { createSlice } from "@reduxjs/toolkit"
import { loginThunk } from "../Thunks/loginThunk";
import { addDriverThunk } from "../Thunks/addDriverThunk";



const INITIAL_STATE_DRIVER = {
    licensePlate: "",
    userName: "",
    password: "",
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
        insertPassword: (state, action) => {
            state.password = action.payload;


        },
        insertLicensePlate: (state, action) => {
            state.licensePlate = action.payload;


        },
        setIsNew: (state, action) => {
            state.isNew = action.payload;


        },
        insertCode: (state, action) => {
            state.code = action.payload;

        },
    },
    extraReducers: (builder) => {

        builder.addCase(loginThunk.fulfilled, (state, action) => {
            console.log(action.payload);
            state.licensePlate = action.payload.licensePlate;
            state.code = action.payload.driverCode;
            console.log(state.licensePlate + " " + state.code );
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
    }
})
export const { insertUserName, insertPassword, insertLicensePlate ,insertCode , setIsNew} = DriverSlice.actions;