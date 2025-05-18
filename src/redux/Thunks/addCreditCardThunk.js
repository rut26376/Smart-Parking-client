import { createAsyncThunk } from "@reduxjs/toolkit";

export const addCreditCardThunk = createAsyncThunk(

    // הפונקציה מקבלת את השם 
    'addCreditCardThunk',
    // פונקציה להפעלה 

    async (creditCard) => {
        debugger
        console.log(creditCard, "creditCard");
        const card = {
            creditCardNum: creditCard.creditCardNum,
            validityCard: creditCard.validityCard,
            cvv: creditCard.cvv,
            id: creditCard.id,
        }
        const response = await fetch(`https://localhost:7164/api/CreditCards/addCreditCard`, {
            method: 'POST',
            body: JSON.stringify(card),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else {
            throw new Error('faild to fetch');
        }
    }
)