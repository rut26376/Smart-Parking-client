  import { createSlice } from "@reduxjs/toolkit"
  import { getAllParkingThunk } from "../Thunks/getParkingsThunk";
  import { getCarExists } from "../Thunks/getCarExists";
  import { paymentThunk } from "../Thunks/paymentThunk";
  import { getAllPaymentsThunk } from "../Thunks/getAllPaymentsThunk";


  const INITIAL_STATE_PAYMENT = {

    licensePlate: "",
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

    },
    allPayments: [{
        creditCardCode: 0,
        sum: 0,
        date: null,
        paymentsDetails: [
          {
            code: 0,
            date: null,
            sum: 0,
            paid: false
          }
        ]
      }]
  }
  export const PaymentSlice = createSlice({
    name: 'payment',
    initialState: INITIAL_STATE_PAYMENT,
    reducers: {
      setLicense: (state, action) => {
        state.licensePlate = action.payload;
      }
    },
    extraReducers: (builder) => {

      builder.addCase(getAllPaymentsThunk.fulfilled, (state, action) => {
        state.allPayments = action.payload;

      })
    }
  })
  export const { setLicense } = PaymentSlice.actions;