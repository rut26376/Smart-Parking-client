import { createSlice } from "@reduxjs/toolkit"
import { getAllParkingThunk } from "../Thunks/getParkingsThunk";
import { getCarExists } from "../Thunks/getCarExists";
import { paymentThunk } from "../Thunks/paymentThunk";
import { Today } from "@mui/icons-material";




const INITIAL_STATE_PAYMENT = {
   shiluv:
    {
        blPayment: {
          creditCardCode: 0,
          sum: 0,
          date: new Date()
        },
        blCreditCards: {
          code: 0, 
          creditCardNum: "",
          validityCard: "",
          id: "",
          cvv: "",
          driverCode: ""
        }
      
   }
}
export const PaymentSlice = createSlice({
    name: 'parking',
    initialState: INITIAL_STATE_PAYMENT,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder.addCase(paymentThunk.fulfilled, (state, action) => {

            console.log("yess",action.payload);

        })
        builder.addCase(paymentThunk.rejected, (state, action) => {
            console.log("noooooooooo",paymentThunk);
        })
    }
})
export const {  } = PaymentSlice.actions;