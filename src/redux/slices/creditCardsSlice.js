import { createSlice } from "@reduxjs/toolkit"
import { getDriversCardsThunk } from "../Thunks/getDriversCardsThunk";
import { addCreditCardThunk } from "../Thunks/addCreditCardThunk";


const INITIAL_STATE_CARDS = {
    creditCards: [{
        code: 0,
        creditCardNum: "",
        validityCard: "",
        cvv: "",
        id: ""
    }],

    lastCreditCards: {
        code: 0,
        creditCardNum: "",
        validityCard: "",
        id: "",
        cvv: "",
        driverCode: ""
    }
}
export const CreditCardsSlice = createSlice({
    name: 'cards',
    initialState: INITIAL_STATE_CARDS,
    reducers: {
        changeCcDetails: (state, action) => { 
           debugger
            state.lastCreditCards = state.creditCards.find(c=>c.code == action.payload);
        }
    },
    extraReducers: (builder) => {

        builder.addCase(getDriversCardsThunk.fulfilled, (state, action) => {
            console.log(action.payload, "action.payload from cc");
            state.creditCards = action.payload
            if (state.creditCards.length > 0)
                state.lastCreditCards = state.creditCards[state.creditCards.length - 1]
        })
        builder.addCase(getDriversCardsThunk.rejected, (state, action) => {
            state.isNew = true;
            console.log("noooooooooo");
        })
        builder.addCase(addCreditCardThunk.fulfilled, (state, action) => {

            console.log("yessss");
        })
        builder.addCase(addCreditCardThunk.rejected, (state, action) => {
            console.log("noooooooooo");
        })
    }
})
export const { changeCcDetails } = CreditCardsSlice.actions;